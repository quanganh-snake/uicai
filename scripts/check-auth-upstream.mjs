#!/usr/bin/env node
// Kiểm chứng PRIVATE_KEY_ENCRYPT đang dùng trên một máy chủ có khớp passphrase
// AES của apiv3 hay không.
//
// Chạy được trên server IIS (không có node_modules của repo) nên không import
// dependency nào: AES tương thích CryptoJS được dựng bằng node:crypto.
//
// Hai cách kết luận, đều tất định (đã đo trên API backend):
//   1. So vân tay khoá đang cài với vân tay khoá tham chiếu — offline:
//        node check-auth-upstream.mjs --service-xml <xml> --expect <khoá|vân tay>
//        node check-auth-upstream.mjs --service-xml <xml> --expect-env-file <.env.local>
//   2. Đăng nhập thật bằng một tài khoản có thật: apiv3 CHỈ trả JSON khi khoá
//      đúng và tài khoản đúng; mọi trường hợp khác là HTML.
//        node check-auth-upstream.mjs --service-xml <xml> --user <u> --pass <p>
//
// Không có tài khoản thật thì chỉ dò được khả năng kết nối: apiv3 trả cùng một
// loại phản hồi HTML (400 "Bad Request" hoặc trang lỗi iisnode, thay đổi ngẫu
// nhiên giữa các lần gọi) cho MỌI lần đăng nhập thất bại, nên hình dạng phản hồi
// KHÔNG phân biệt được khoá sai với tài khoản sai.
//
// Exit codes: 0 = khoá đúng, 2 = khoá sai/bị từ chối, 3 = không xác định.
import { createCipheriv, createHash, randomBytes } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";

const PLACEHOLDER = "REPLACE_WITH_BACKEND_AES_KEY";
const PROBE_ACCOUNT = "aiesi2027-deploy-probe";
const IISNODE_CRASH_MARKER = "iisnode encountered an error";
const STATUS_TEXT_BODY = /^(bad request|unauthorized|forbidden)$/i;
const REJECTION_STATUSES = new Set([400, 401, 403]);

const EXIT_OK = 0;
const EXIT_WRONG_KEY = 2;
const EXIT_UNKNOWN = 3;

/** AES-256-CBC + KDF MD5 của OpenSSL ("Salted__"), đúng định dạng CryptoJS
 *  `AES.encrypt(text, passphrase).toString()` mà apiv3 giải mã. */
function cryptoJsAesEncrypt(plaintext, passphrase) {
  const salt = randomBytes(8);
  const pass = Buffer.from(passphrase, "binary");
  let data = Buffer.alloc(0);
  let prev = Buffer.alloc(0);
  while (data.length < 48) {
    prev = createHash("md5")
      .update(Buffer.concat([prev, pass, salt]))
      .digest();
    data = Buffer.concat([data, prev]);
  }
  const cipher = createCipheriv(
    "aes-256-cbc",
    data.subarray(0, 32),
    data.subarray(32, 48),
  );
  const body = Buffer.concat([
    cipher.update(Buffer.from(plaintext, "utf8")),
    cipher.final(),
  ]);
  return Buffer.concat([
    Buffer.from("Salted__", "binary"),
    salt,
    body,
  ]).toString("base64");
}

/** Song ánh với normalizeSecret() trong src/lib/auth/session.ts. */
function normalizeSecret(value) {
  const trimmed = value?.trim();
  if (!trimmed) return undefined;
  const unquoted =
    (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
    (trimmed.startsWith("'") && trimmed.endsWith("'"))
      ? trimmed.slice(1, -1).trim()
      : trimmed;
  return unquoted || undefined;
}

function fingerprint(secret) {
  if (!secret) return "unset";
  return `${createHash("sha256").update(secret).digest("hex").slice(0, 8)}/${secret.length}`;
}

function parseArgs(argv) {
  const args = {};
  for (let i = 0; i < argv.length; i += 1) {
    const token = argv[i];
    if (!token.startsWith("--")) continue;
    const name = token.slice(2);
    const next = argv[i + 1];
    if (next === undefined || next.startsWith("--")) {
      args[name] = "true";
      continue;
    }
    args[name] = next;
    i += 1;
  }
  return args;
}

function unescapeXml(value) {
  return value
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&amp;/g, "&");
}

function readServiceXmlKey(path) {
  const xml = readFileSync(path, "utf8");
  const match =
    /<env\s+name="PRIVATE_KEY_ENCRYPT"\s+value="([^"]*)"/i.exec(xml);
  if (!match) {
    throw new Error(
      `Không tìm thấy <env name="PRIVATE_KEY_ENCRYPT"> trong ${path}`,
    );
  }
  return unescapeXml(match[1]);
}

function readEnvFileKey(path) {
  for (const line of readFileSync(path, "utf8").split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const split = trimmed.indexOf("=");
    if (split < 1) continue;
    if (trimmed.slice(0, split).trim() !== "PRIVATE_KEY_ENCRYPT") continue;
    return trimmed.slice(split + 1);
  }
  throw new Error(`Không tìm thấy dòng PRIVATE_KEY_ENCRYPT= trong ${path}`);
}

function resolveKey(args) {
  if (args.key !== undefined) return { raw: args.key, source: "--key" };
  if (args["service-xml"] !== undefined) {
    return {
      raw: readServiceXmlKey(args["service-xml"]),
      source: `service XML (${args["service-xml"]})`,
    };
  }
  if (args["env-file"] !== undefined) {
    return {
      raw: readEnvFileKey(args["env-file"]),
      source: `env file (${args["env-file"]})`,
    };
  }
  if (process.env.PRIVATE_KEY_ENCRYPT) {
    return {
      raw: process.env.PRIVATE_KEY_ENCRYPT,
      source: "process.env.PRIVATE_KEY_ENCRYPT",
    };
  }
  if (existsSync(".env.local")) {
    return { raw: readEnvFileKey(".env.local"), source: "./.env.local" };
  }
  return null;
}

const FINGERPRINT_PATTERN = /^[0-9a-f]{8}\/\d+$/i;

/** Khoá tham chiếu để so offline: một passphrase, một vân tay `hex8/len`, hoặc
 *  một file .env chứa dòng PRIVATE_KEY_ENCRYPT=. */
function resolveExpected(args) {
  if (args["expect-env-file"] !== undefined) {
    const raw = normalizeSecret(readEnvFileKey(args["expect-env-file"]));
    return {
      fingerprint: fingerprint(raw),
      source: `env file (${args["expect-env-file"]})`,
    };
  }
  if (args.expect === undefined) return null;
  const value = args.expect.trim();
  if (FINGERPRINT_PATTERN.test(value)) {
    return { fingerprint: value.toLowerCase(), source: "--expect (vân tay)" };
  }
  return { fingerprint: fingerprint(normalizeSecret(value)), source: "--expect" };
}

function classify(status, body) {
  if (body.includes(IISNODE_CRASH_MARKER)) return "crash";
  try {
    JSON.parse(body);
    return "json";
  } catch {
    // không phải JSON — tiếp tục phân loại bên dưới
  }
  const compact = body.replace(/\s+/g, " ").trim();
  if (REJECTION_STATUSES.has(status) && STATUS_TEXT_BODY.test(compact)) {
    return "rejected";
  }
  return "unknown";
}

async function attempt(endpoint, key, user, pass) {
  const response = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      TenDangNhap: cryptoJsAesEncrypt(user, key),
      MatKhau: cryptoJsAesEncrypt(pass, key),
    }),
    cache: "no-store",
  });
  const body = await response.text();
  let json;
  try {
    json = JSON.parse(body);
  } catch {
    json = undefined;
  }
  return {
    status: response.status,
    contentType: (response.headers.get("content-type") ?? "").split(";")[0],
    kind: classify(response.status, body),
    json,
    snippet: body.replace(/\s+/g, " ").trim().slice(0, 200),
  };
}

const args = parseArgs(process.argv.slice(2));
const apiOrigin =
  args.api ?? process.env.API_URL ?? "https://apiv3.uneti.edu.vn";
const endpoint = `${apiOrigin.replace(/\/+$/, "")}/api/auth/login`;
const hasAccount = args.user !== undefined && args.pass !== undefined;
const user = args.user ?? PROBE_ACCOUNT;
const pass = args.pass ?? PROBE_ACCOUNT;
const repeat = hasAccount ? 1 : Number(args.repeat ?? 2) || 2;

let resolved;
try {
  resolved = resolveKey(args);
} catch (error) {
  console.error(`KHÔNG XÁC ĐỊNH: ${error.message}`);
  process.exit(EXIT_UNKNOWN);
}

if (!resolved) {
  console.error(
    "KHÔNG XÁC ĐỊNH: không tìm được PRIVATE_KEY_ENCRYPT.\n" +
      "Dùng --key <passphrase>, --service-xml <đường dẫn aiesi2027-next.xml>,\n" +
      "--env-file <đường dẫn .env.local>, hoặc đặt biến môi trường PRIVATE_KEY_ENCRYPT.",
  );
  process.exit(EXIT_UNKNOWN);
}

const key = normalizeSecret(resolved.raw);

console.log(`endpoint: ${endpoint}`);
console.log(`nguồn khoá: ${resolved.source}`);

if (!key) {
  console.error("KEY SAI: PRIVATE_KEY_ENCRYPT rỗng.");
  process.exit(EXIT_WRONG_KEY);
}
if (key !== resolved.raw) {
  console.log(
    "CẢNH BÁO: khoá có khoảng trắng/dấu nháy thừa — apiv3 từ chối giá trị chưa chuẩn hoá.",
  );
}
console.log(`PRIVATE_KEY_ENCRYPT fingerprint: ${fingerprint(key)}`);

if (key === PLACEHOLDER) {
  console.error(
    "KEY SAI: service XML còn placeholder REPLACE_WITH_BACKEND_AES_KEY.",
  );
  process.exit(EXIT_WRONG_KEY);
}

// 1. So sánh offline với khoá tham chiếu — kết luận tất định, không cần mạng.
let expected;
try {
  expected = resolveExpected(args);
} catch (error) {
  console.error(`KHÔNG XÁC ĐỊNH: ${error.message}`);
  process.exit(EXIT_UNKNOWN);
}

if (expected) {
  console.log(`vân tay tham chiếu: ${expected.fingerprint} (${expected.source})`);
  if (expected.fingerprint !== fingerprint(key)) {
    console.error(
      "KEY SAI: PRIVATE_KEY_ENCRYPT đang cài khác khoá tham chiếu — đặt lại rồi khởi động lại service.",
    );
    process.exit(EXIT_WRONG_KEY);
  }
  console.log("KEY OK: khoá đang cài trùng khoá tham chiếu");
  if (!hasAccount) process.exit(EXIT_OK);
}

// 2. Bằng chứng trực tiếp từ apiv3: chỉ đăng nhập thật mới phân biệt được
//    khoá sai với tài khoản sai (apiv3 trả JSON duy nhất khi cả hai đều đúng).
console.log(
  hasAccount
    ? `thử đăng nhập thật: ${user}`
    : `dò ${repeat} lần bằng tài khoản không tồn tại (${PROBE_ACCOUNT}) — chỉ kiểm tra kết nối`,
);

const results = [];
for (let i = 1; i <= repeat; i += 1) {
  try {
    const result = await attempt(endpoint, key, user, pass);
    results.push(result);
    console.log(
      `#${i} ${result.status} ${result.contentType || "(no content-type)"} ${result.kind}`,
    );
  } catch (error) {
    results.push({ kind: "network", error: String(error) });
    console.log(`#${i} network ${String(error)}`);
  }
}

const kinds = results.map((result) => result.kind);

if (kinds.every((kind) => kind === "network")) {
  console.error(
    "KHÔNG XÁC ĐỊNH: không gọi được API backend từ máy này — kiểm tra mạng/proxy/DNS, không phải khoá.",
  );
  for (const result of results) console.error(`    ${result.error}`);
  process.exit(EXIT_UNKNOWN);
}

if (hasAccount) {
  const authenticated = results.find(
    (result) => result.kind === "json" && result.json?.code === 200,
  );
  if (authenticated) {
    console.log("KEY OK: apiv3 chấp nhận khoá, đăng nhập thành công");
    process.exit(EXIT_OK);
  }
  const json = results.find((result) => result.kind === "json");
  if (json) {
    console.error(
      `KEY OK nhung API backend tu choi: ${json.json?.message ?? json.snippet}`,
    );
    process.exit(EXIT_WRONG_KEY);
  }
  console.error(
    "KEY SAI hoặc tài khoản sai: API backend không trả JSON. Backend chỉ trả JSON khi khoá ĐÚNG và tài khoản ĐÚNG;\n" +
      "kiểm tra lại mật khẩu, nếu mật khẩu chắc chắn đúng thì PRIVATE_KEY_ENCRYPT lệch passphrase của backend.",
  );
  for (const result of results) {
    console.error(`    ${result.status} ${result.contentType} ${result.snippet}`);
  }
  process.exit(EXIT_WRONG_KEY);
}

console.log(
  "KHÔNG XÁC ĐỊNH: API backend trả lời (kết nối tốt) nhưng phản hồi thất bại không phân biệt được\n" +
    "khoá sai với tài khoản sai. Chạy lại với --expect <khoá tham chiếu> hoặc --user/--pass.",
);
process.exit(EXIT_UNKNOWN);
