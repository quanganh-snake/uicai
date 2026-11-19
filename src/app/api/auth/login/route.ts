import { NextResponse } from "next/server";
import CryptoJS from "crypto-js";
import { z } from "zod";

import {
  AES_PASSPHRASE,
  AUTH_COOKIE_NAME,
  AUTH_SESSION_MAX_AGE,
  decryptAesText,
  isAuthRole,
  secretFingerprint,
  serializeAuthSession,
  shouldUseSecureCookie,
  type AuthRole,
  type AuthUser,
} from "@/lib/auth/session";
import { loginSchema } from "@/lib/validations/auth";
import { readUpstreamPayload } from "@/lib/auth/upstream";

const API_BASE_URL =
  process.env.API_URL ??
  process.env.NEXT_PUBLIC_API_URL ??
  "https://apiv3.uneti.edu.vn";
const LOGIN_ENDPOINT = `${API_BASE_URL}/api/auth/login`;
const ENCRYPTION_KEY = AES_PASSPHRASE;

const ACCESS_TOKEN_COOKIE = /(?:^|,\s*)access_token=([^;]*)/i;
const REFRESH_TOKEN_COOKIE = /(?:^|,\s*)refresh_token=([^;]*)/i;
const ACCESS_TOKEN_HEADER = "x-auth-access-token";

const USERNAME_KEYS = [
  "username",
  "userName",
  "TenDangNhap",
  "HT_NguoiDungNgoai_TenDangNhap",
] as const;
const ID_KEYS = [
  "id",
  "Id",
  "ID",
  "HT_NguoiDungNgoai_ID",
  "IDNhanSu",
  "IdSinhVien",
  "IDSinhVien",
  "nguoiDungId",
] as const;
const EMAIL_KEYS = ["email", "Email", "HT_NguoiDungNgoai_Email"] as const;
const FULL_NAME_KEYS = [
  "fullName",
  "hoTen",
  "HoTen",
  "HT_NguoiDungNgoai_HoTen",
] as const;
const FIRST_NAME_KEYS = ["HT_NguoiDungNgoai_HoDem", "hoDem"] as const;
const LAST_NAME_KEYS = ["HT_NguoiDungNgoai_Ten", "ten"] as const;
const GROUP_KEYS = ["HT_GROUPUSER_ID"] as const;
const TOKEN_KEYS = ["token", "accessToken", "access_token"] as const;
/** The backend returns the account classification as an AES-encrypted `Role`. */
const ROLE_KEY = "Role";

const MISSING_ROLE_MESSAGE =
  "Your account is not activated or does not have access to the system. Please contact the administrator.";

const CREDENTIALS_REJECTED_MESSAGE =
  "Sign-in was not successful. Please check your account details and whether your email has been verified.";
const UPSTREAM_INTERNAL_ERROR_MESSAGE =
  "The sign-in service ran into a problem. Please try again in a few minutes.";
const UPSTREAM_CONTRACT_MESSAGE =
  "The sign-in service returned a response that is not valid JSON.";

/** Diagnostic log: only the shape of the upstream response + the key fingerprint.
 *  NEVER log TenDangNhap, MatKhau, ciphertext or tokens. */
function logUpstreamAnomaly(kind: string, detail: Record<string, unknown>) {
  console.error(
    `[auth/login] ${kind}`,
    JSON.stringify({
      endpoint: LOGIN_ENDPOINT,
      keyFingerprint: secretFingerprint(process.env.PRIVATE_KEY_ENCRYPT),
      ...detail,
    }),
  );
}

const externalLoginResponseSchema = z
  .object({
    code: z.number(),
    success: z.boolean().optional(),
    message: z.string().optional(),
    isAuthenticated: z.boolean().optional(),
    user: z.unknown().optional(),
    body: z.unknown().optional(),
  })
  .passthrough();

type ExternalLoginResponse = z.infer<typeof externalLoginResponseSchema>;
type Payload = Record<string, unknown>;

class AuthenticationContractError extends Error {}

function authFailure(code: number, message: string, status = code) {
  return NextResponse.json(
    { code, message, isAuthenticated: false, user: null },
    { status },
  );
}

function asPayload(value: unknown): Payload | null {
  const candidate = Array.isArray(value) ? value[0] : value;

  return candidate !== null &&
    typeof candidate === "object" &&
    !Array.isArray(candidate)
    ? (candidate as Payload)
    : null;
}

/**
 * The provider may split profile fields and the account classification between
 * `user`, nested `body.user`/`body.nguoiDung`/`body.data`, `body`, and the
 * response root, so every claim is resolved against all of them in that
 * priority order instead of a single chosen object.
 */
function collectClaimSources(result: ExternalLoginResponse): Payload[] {
  const sources: Payload[] = [];
  const push = (value: unknown) => {
    const payload = asPayload(value);
    if (payload && !sources.includes(payload)) {
      sources.push(payload);
    }
  };

  push(result.user);

  const body = asPayload(result.body);
  if (body) {
    push(body.user);
    push(body.nguoiDung);
    push(body.data);
    push(body);
  }

  push(result);

  return sources;
}

function readString(sources: Payload[], keys: readonly string[]) {
  for (const source of sources) {
    for (const key of keys) {
      const value = source[key];

      if (typeof value === "string") {
        const trimmed = value.trim();
        if (trimmed) return trimmed;
      }
    }
  }

  return undefined;
}

function toFiniteNumber(value: unknown) {
  if (typeof value === "number") {
    return Number.isFinite(value) ? value : undefined;
  }

  if (typeof value === "string" && value.trim()) {
    const parsed = Number(value.trim());
    return Number.isFinite(parsed) ? parsed : undefined;
  }

  return undefined;
}

function readNumber(sources: Payload[], keys: readonly string[]) {
  for (const source of sources) {
    for (const key of keys) {
      const value = toFiniteNumber(source[key]);
      if (value !== undefined) return value;
    }
  }

  return undefined;
}

function readStringArray(sources: Payload[], keys: readonly string[]) {
  for (const source of sources) {
    for (const key of keys) {
      const value = source[key];
      const items =
        typeof value === "string"
          ? value.split(",")
          : Array.isArray(value)
            ? value
            : null;

      if (items) {
        const normalized = items
          .map((item) => String(item).trim())
          .filter(Boolean);

        if (normalized.length) return normalized;
      }
    }
  }

  return [];
}

/**
 * Reads the `Role` claim the backend returns, decrypting the CryptoJS AES
 * payload it is wrapped in (`U2FsdGVkX1…` = `"0" | "1" | "2"`). A classification
 * outside `0 | 1 | 2` is reported separately from a missing one so the browser
 * never sees a missing-claim message for a malformed upstream value.
 */
function readAuthRole(sources: Payload[]): AuthRole {
  let invalidClaim: string | undefined;

  for (const source of sources) {
    const raw = source[ROLE_KEY];
    if (raw === null || raw === undefined) continue;

    const plain = typeof raw === "string" ? (decryptAesText(raw) ?? raw) : raw;
    const numeric = toFiniteNumber(plain);
    if (isAuthRole(numeric)) return numeric;

    if (invalidClaim === undefined && typeof plain !== "object") {
      const text = String(plain).trim();
      if (text) invalidClaim = text;
    }
  }

  throw new AuthenticationContractError(
    invalidClaim === undefined
      ? MISSING_ROLE_MESSAGE
      : `The sign-in service returned an invalid account type (${invalidClaim}).`,
  );
}

function normalizeAuthenticatedUser(
  result: ExternalLoginResponse,
  fallbackUsername: string,
) {
  const sources = collectClaimSources(result);
  const username = readString(sources, USERNAME_KEYS) ?? fallbackUsername;
  const combinedName = [
    readString(sources, FIRST_NAME_KEYS),
    readString(sources, LAST_NAME_KEYS),
  ]
    .filter(Boolean)
    .join(" ");

  const user: AuthUser = {
    id: readNumber(sources, ID_KEYS) ?? 0,
    username,
    email: readString(sources, EMAIL_KEYS) ?? "",
    fullName:
      readString(sources, FULL_NAME_KEYS) ?? (combinedName || username),
    HT_GROUPUSER_ID: readStringArray(sources, GROUP_KEYS),
    Role: readAuthRole(sources),
  };

  return { user, token: readString(sources, TOKEN_KEYS) };
}

function decodeCookieValue(value: string) {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

/**
 * The backend sets both session cookies on the server-to-server response and
 * mirrors the access token in a non-CORS-exposed header; legacy JSON token
 * fields are the last fallback. The refresh token is what keeps the session
 * alive past the 40-minute access-token lifetime, so it is read here too.
 */
function readAuthCookies(headers: Headers): {
  token?: string;
  refreshToken?: string;
} {
  const setCookieHeaders = headers.getSetCookie();
  const candidates = setCookieHeaders.length
    ? setCookieHeaders
    : [headers.get("set-cookie") ?? ""];

  let token: string | undefined;
  let refreshToken: string | undefined;

  for (const header of candidates) {
    const access = ACCESS_TOKEN_COOKIE.exec(header)?.[1]?.trim();
    if (access && !token) token = decodeCookieValue(access);

    const refresh = REFRESH_TOKEN_COOKIE.exec(header)?.[1]?.trim();
    if (refresh && !refreshToken) refreshToken = decodeCookieValue(refresh);
  }

  return {
    token: token ?? (headers.get(ACCESS_TOKEN_HEADER)?.trim() || undefined),
    refreshToken,
  };
}

export async function POST(request: Request) {
  if (!ENCRYPTION_KEY) {
    return authFailure(500, "The server is not configured correctly. Please contact the administrator.");
  }

  const parsedCredentials = loginSchema.safeParse(
    await request.json().catch(() => null),
  );

  if (!parsedCredentials.success) {
    return authFailure(400, "The sign-in details are not valid.");
  }

  const { TenDangNhap, MatKhau } = parsedCredentials.data;

  try {
    let apiResponse: Response;
    try {
      apiResponse = await fetch(LOGIN_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          TenDangNhap: CryptoJS.AES.encrypt(
            TenDangNhap,
            ENCRYPTION_KEY,
          ).toString(),
          MatKhau: CryptoJS.AES.encrypt(MatKhau, ENCRYPTION_KEY).toString(),
        }),
        cache: "no-store",
      });
    } catch (error) {
      logUpstreamAnomaly("cannot reach upstream", { error: String(error) });
      return authFailure(502, "We couldn't reach the sign-in service. Please try again in a moment.");
    }

    const payload = await readUpstreamPayload(apiResponse);
    let rawResult: unknown;

    if (payload.kind === "json") {
      rawResult = payload.value;
    } else {
      const detail = {
        status: payload.status,
        contentType: payload.contentType,
        bodyLength: payload.bodyLength,
        snippet: payload.snippet,
      };

      // apiv3 runs behind iisnode: every failed sign-in may return an iisnode error page
      // (often with HTTP 200) instead of JSON. This shape does NOT distinguish
      // a wrong password from a PRIVATE_KEY_ENCRYPT that mismatches the apiv3 passphrase —
      // the keyFingerprint in the log is what to compare against a working environment.
      if (payload.kind === "host-error-page") {
        logUpstreamAnomaly(
          "upstream host error page instead of JSON; login not processed — compare keyFingerprint with the working environment, then the account itself",
          detail,
        );
        return authFailure(502, UPSTREAM_INTERNAL_ERROR_MESSAGE);
      }

      // apiv3 rejects sign-in with res.sendStatus(): the body is exactly the status text.
      if (payload.kind === "status-text") {
        logUpstreamAnomaly("upstream rejected the login", detail);
        return authFailure(
          payload.status,
          CREDENTIALS_REJECTED_MESSAGE,
          payload.status,
        );
      }

      logUpstreamAnomaly("upstream returned a non-JSON body", detail);
      throw new AuthenticationContractError(UPSTREAM_CONTRACT_MESSAGE);
    }

    const parsedResult = externalLoginResponseSchema.safeParse(rawResult);

    if (!parsedResult.success) {
      logUpstreamAnomaly("upstream payload failed the response contract", {
        status: apiResponse.status,
      });
      throw new AuthenticationContractError(
        "The sign-in service returned data in an unexpected format.",
      );
    }

    const result = parsedResult.data;
    const loginSucceeded =
      apiResponse.ok &&
      result.code === 200 &&
      result.success !== false &&
      result.isAuthenticated !== false;

    if (!loginSucceeded) {
      // Only the status and message are relayed: upstream payloads may carry
      // tokens or account internals that must not reach the browser.
      const status = apiResponse.ok ? 401 : apiResponse.status;
      return authFailure(
        status,
        result.message ?? "Incorrect username or password.",
        status,
      );
    }

    const { user, token: payloadToken } = normalizeAuthenticatedUser(
      result,
      TenDangNhap,
    );
    const { token: cookieToken, refreshToken } = readAuthCookies(
      apiResponse.headers,
    );
    const token = cookieToken ?? payloadToken;

    if (!token) {
      return authFailure(
        502,
        "The sign-in service did not establish a valid session.",
      );
    }

    if (!refreshToken) {
      // Does not block sign-in, but the session will die after 40 minutes because it cannot be renewed.
      logUpstreamAnomaly("upstream login set no refresh_token cookie", {
        status: apiResponse.status,
      });
    }

    const response = NextResponse.json({
      code: 200,
      message: result.message ?? "Signed in successfully.",
      isAuthenticated: true,
      user,
    });

    response.cookies.set({
      name: AUTH_COOKIE_NAME,
      value: serializeAuthSession({ user, token, refreshToken }),
      httpOnly: true,
      sameSite: "lax",
      secure: shouldUseSecureCookie(request),
      path: "/",
      maxAge: AUTH_SESSION_MAX_AGE,
      priority: "high",
    });

    return response;
  } catch (error) {
    return authFailure(
      502,
      error instanceof AuthenticationContractError
        ? error.message
        : "We couldn't process the response from the sign-in service.",
    );
  }
}
