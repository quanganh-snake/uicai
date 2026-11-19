#!/usr/bin/env node
// Lấy NGUYÊN VĂN phản hồi của apiv3 cho luồng nộp bài báo (upload + add), thứ mà
// BFF không đọc được: IIS trước iisnode thay body lỗi của Express bằng trang HTML
// của nó, nên `/api/submissions` chỉ còn thấy "Yêu cầu không hợp lệ...".
//
// Không import dependency của repo (chạy được cả trên máy chủ không có node_modules).
//
//   node scripts/probe-khcn-submission.mjs --user <TenDangNhap> --pass <MatKhau>
//   node scripts/probe-khcn-submission.mjs --user u --pass p --file ./bai-bao.pdf
//   node scripts/probe-khcn-submission.mjs --user u --pass p --add     # gọi cả Add_Para (TẠO DỮ LIỆU THẬT)
//   node scripts/probe-khcn-submission.mjs --user u --pass p --keep    # không xoá file đã upload
//
// Exit codes: 0 = upload 200, 2 = upload 4xx/5xx, 3 = không đăng nhập được.
//
// KHÔNG log token/cookie value, chỉ log tên cookie và thân phản hồi của endpoint nghiệp vụ.
import { createCipheriv, createHash, randomBytes } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";

const EXIT_OK = 0;
const EXIT_UPSTREAM_REJECTED = 2;
const EXIT_UNKNOWN = 3;

const SNIPPET_LIMIT = 500;

/** AES-256-CBC + KDF MD5 của OpenSSL ("Salted__"), đúng định dạng CryptoJS
 *  `AES.encrypt(text, passphrase).toString()` mà apiv3 giải mã.
 *  Bản sao của scripts/check-auth-upstream.mjs — giữ script độc lập dependency. */
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

function readEnvFile(path) {
  const values = {};
  if (!existsSync(path)) return values;
  for (const line of readFileSync(path, "utf8").split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const split = trimmed.indexOf("=");
    if (split < 1) continue;
    values[trimmed.slice(0, split).trim()] = trimmed.slice(split + 1);
  }
  return values;
}

const ACCESS_TOKEN_COOKIE = /(?:^|,\s*)access_token=([^;]*)/i;
const REFRESH_TOKEN_COOKIE = /(?:^|,\s*)refresh_token=([^;]*)/i;

function decodeCookieValue(value) {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

function readAuthCookies(headers) {
  const setCookies = headers.getSetCookie();
  const candidates = setCookies.length
    ? setCookies
    : [headers.get("set-cookie") ?? ""];
  const result = {};
  for (const header of candidates) {
    const access = ACCESS_TOKEN_COOKIE.exec(header)?.[1]?.trim();
    if (access && !result.token) result.token = decodeCookieValue(access);
    const refresh = REFRESH_TOKEN_COOKIE.exec(header)?.[1]?.trim();
    if (refresh && !result.refreshToken) {
      result.refreshToken = decodeCookieValue(refresh);
    }
  }
  const headerToken = headers.get("x-auth-access-token")?.trim();
  if (!result.token && headerToken) result.token = headerToken;
  result.mirroredInHeader = Boolean(headerToken);
  result.cookieNames = candidates
    .map((header) => header.split("=")[0]?.trim())
    .filter(Boolean);
  return result;
}

function cookieHeader(tokens) {
  const parts = [`access_token=${encodeURIComponent(tokens.token ?? "")}`];
  if (tokens.refreshToken) {
    parts.push(`refresh_token=${encodeURIComponent(tokens.refreshToken)}`);
  }
  return parts.join("; ");
}

async function describe(label, response) {
  const body = await response.text();
  console.log(`\n== ${label} ==`);
  console.log(`status       : ${response.status}`);
  console.log(`content-type : ${response.headers.get("content-type") ?? "-"}`);
  console.log(
    `content-length: ${response.headers.get("content-length") ?? String(body.length)}`,
  );
  console.log(`body         : ${body.replace(/\s+/g, " ").trim().slice(0, SNIPPET_LIMIT)}`);
  let json;
  try {
    json = JSON.parse(body);
  } catch {
    json = undefined;
  }
  if (!json && /<title>\s*\d{3}\s*-\s/i.test(body)) {
    console.log(
      "ghi chú      : body là trang lỗi HTML của IIS — message thật của Express đã bị thay thế.",
    );
  }
  return { status: response.status, body, json };
}

/** PDF hợp lệ tối thiểu để multer/fileFilter của apiv3 nhận đuôi .pdf. */
function fakePdfBytes() {
  return Buffer.from(
    "%PDF-1.4\n1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj\n" +
      "2 0 obj<</Type/Pages/Kids[]/Count 0>>endobj\n" +
      "trailer<</Root 1 0 R>>\n%%EOF\n",
    "utf8",
  );
}

const args = parseArgs(process.argv.slice(2));
if (args.user === undefined || args.pass === undefined) {
  console.error(
    "Thiếu tài khoản: node scripts/probe-khcn-submission.mjs --user <TenDangNhap> --pass <MatKhau>",
  );
  process.exit(EXIT_UNKNOWN);
}

const env = readEnvFile(args["env-file"] ?? ".env.local");
const key = normalizeSecret(
  args.key ?? process.env.PRIVATE_KEY_ENCRYPT ?? env.PRIVATE_KEY_ENCRYPT,
);
if (!key) {
  console.error(
    "KHÔNG XÁC ĐỊNH: thiếu PRIVATE_KEY_ENCRYPT (dùng --key, biến môi trường, hoặc .env.local).",
  );
  process.exit(EXIT_UNKNOWN);
}

const apiOrigin = (
  args.api ??
  process.env.KHCN_AIESI_API_URL ??
  env.KHCN_AIESI_API_URL ??
  process.env.API_URL ??
  env.API_URL ??
  "https://apiv3.uneti.edu.vn"
).replace(/\/+$/, "");
const loginEndpoint = `${apiOrigin}/api/auth/login`;
const backendBase = `${apiOrigin}/api/SP_KHCN_AIESI`;

console.log(`api origin   : ${apiOrigin}`);
console.log(`key fingerprint: ${createHash("sha256").update(key).digest("hex").slice(0, 8)}/${key.length}`);

// ---- Bước 1: đăng nhập thật để lấy cookie backend ----
let loginResponse;
try {
  loginResponse = await fetch(loginEndpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      TenDangNhap: cryptoJsAesEncrypt(args.user, key),
      MatKhau: cryptoJsAesEncrypt(args.pass, key),
    }),
    cache: "no-store",
  });
} catch (error) {
  console.error(`KHÔNG XÁC ĐỊNH: không gọi được ${loginEndpoint}: ${error}`);
  process.exit(EXIT_UNKNOWN);
}

const tokens = readAuthCookies(loginResponse.headers);
const loginBody = await loginResponse.text();
console.log("\n== login ==");
console.log(`status       : ${loginResponse.status}`);
console.log(`set-cookie   : ${tokens.cookieNames.join(", ") || "(không có)"}`);
console.log(`access_token : ${tokens.token ? "có" : "KHÔNG"}`);
console.log(`refresh_token: ${tokens.refreshToken ? "có" : "KHÔNG"}`);
console.log(`x-auth-access-token: ${tokens.mirroredInHeader ? "có" : "không"}`);
if (!tokens.token) {
  console.error(
    `\nKHÔNG XÁC ĐỊNH: đăng nhập không trả access_token. body: ${loginBody
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, SNIPPET_LIMIT)}`,
  );
  process.exit(EXIT_UNKNOWN);
}

// ---- Bước 1b: đọc claim định danh trong access token ----
// Payload JWT là base64url, giải mã KHÔNG cần secret. Chỉ in TÊN trường và kiểu
// dữ liệu của những claim mà verifyJWT dùng để suy ra req.HT_USER.
const ID_CLAIMS = [
  "Id",
  "ID",
  "HT_NguoiDungNgoai_ID",
  "IDNhanSu",
  "IdSinhVien",
  "IDSinhVien",
  "MaNhanSu",
  "MaSinhVien",
];

function decodeJwtPayload(token) {
  const part = token.split(".")[1];
  if (!part) return undefined;
  try {
    return JSON.parse(Buffer.from(part, "base64url").toString("utf8"));
  } catch {
    return undefined;
  }
}

const claims = decodeJwtPayload(tokens.token);
console.log("\n== claim định danh trong access token ==");
if (!claims) {
  console.log("payload      : KHÔNG giải mã được (token không phải JWT 3 phần)");
} else {
  const tokenUser = Array.isArray(claims.data) ? (claims.data[0] ?? {}) : {};
  const present = ID_CLAIMS.filter((name) => tokenUser[name] !== undefined).map(
    (name) => `${name}:${typeof tokenUser[name]}`,
  );
  // verifyJWT: req.HT_USER = <claim ID đầu tiên> || decoded.id || decoded.username
  const resolved =
    ID_CLAIMS.map((name) => tokenUser[name]).find(Boolean) ??
    claims.id ??
    claims.username;
  console.log(`username     : ${claims.username ? "có" : "KHÔNG"}`);
  console.log(
    `data[0]      : ${Array.isArray(claims.data) ? `mảng ${claims.data.length} phần tử` : "KHÔNG phải mảng"}`,
  );
  console.log(`field data[0]: ${Object.keys(tokenUser).join(", ") || "(rỗng)"}`);
  console.log(`claim ID     : ${present.join(", ") || "KHÔNG có claim ID nào"}`);
  console.log(
    `=> req.HT_USER: ${resolved === undefined || resolved === "" ? "RỖNG → apiv3 trả 400 \"Không xác định được người dùng…\"" : `${typeof resolved} (có giá trị)`}`,
  );
}

// ---- Bước 1c: endpoint khác cũng phụ thuộc req.HT_USER ----
// Load_Paged ép HT_USER_Create theo token cho tài khoản thường; nếu nó cũng
// hỏng thì định danh thiếu ở mức token chứ không phải riêng bước upload.
await describe(
  "KHCN_AIESI_BaiDang_Load_Paged (kiểm tra chéo HT_USER)",
  await fetch(`${backendBase}/KHCN_AIESI_BaiDang_Load_Paged?pageNumber=1&pageSize=1`, {
    headers: { Cookie: cookieHeader(tokens), Accept: "application/json" },
    cache: "no-store",
  }),
);

// ---- Bước 2: upload đúng như BFF làm (field `files`) ----
const filePath = args.file;
const fileBytes = filePath ? readFileSync(filePath) : fakePdfBytes();
const fileName = filePath ? filePath.split(/[\\/]/).pop() : "probe-manuscript.pdf";
const uploadForm = new FormData();
uploadForm.append(
  "files",
  new File([fileBytes], fileName, { type: "application/pdf" }),
  fileName,
);
console.log(`\nupload file  : ${fileName} (${fileBytes.length} byte)`);

const uploadResult = await describe(
  "KHCN_AIESI_Upload",
  await fetch(`${backendBase}/KHCN_AIESI_Upload`, {
    method: "POST",
    headers: { Cookie: cookieHeader(tokens), Accept: "application/json" },
    body: uploadForm,
    cache: "no-store",
  }),
);

const uploadedFiles = Array.isArray(uploadResult.json?.body)
  ? uploadResult.json.body
  : [];

// ---- Bước 3 (tuỳ chọn): Add_Para với đúng payload của /api/submissions ----
if (args.add !== undefined && uploadedFiles.length > 0) {
  await describe(
    "KHCN_AIESI_BaiDang_Add_Para",
    await fetch(`${backendBase}/KHCN_AIESI_BaiDang_Add_Para`, {
      method: "POST",
      headers: {
        Cookie: cookieHeader(tokens),
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        KHCN_AIESI_BaiDang_TenBai: `PROBE ${new Date().toISOString()}`,
        KHCN_AIESI_BaiDang_TomTat: "<p>Probe abstract</p>",
        KHCN_AIESI_BaiDang_TacGia: "Probe author",
        KHCN_AIESI_BaiDang_TuKhoa: "probe",
        KHCN_AIESI_BaiDang_LinkFile: uploadedFiles,
        KHCN_AIESI_BaiDang_TrangThai: null,
        KHCN_AIESI_BaiDang_NguoiXuLy_NoiDung: "",
        KHCN_AIESI_BaiDang_NguonTiepNhan: 1,
        KHCN_AIESI_BaiDang_LoaiTaiKhoan: 2,
        KHCN_AIESI_BaiDang_EmailNguoiGui: "",
      }),
      cache: "no-store",
    }),
  );
  console.log(
    "ghi chú      : --add đã tạo bản ghi thật trong KHCN_AIESI_BaiDang (SP không trả ID).",
  );
}

// ---- Bước 4: dọn file đã upload ----
if (uploadedFiles.length > 0 && args.keep === undefined) {
  await describe(
    "KHCN_AIESI_DeleteFile (dọn dẹp)",
    await fetch(`${backendBase}/KHCN_AIESI_DeleteFile`, {
      method: "POST",
      headers: {
        Cookie: cookieHeader(tokens),
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ fileUrls: uploadedFiles.map((file) => file.URL) }),
      cache: "no-store",
    }),
  );
}

process.exit(uploadResult.status === 200 ? EXIT_OK : EXIT_UPSTREAM_REJECTED);
