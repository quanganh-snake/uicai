import { createHash, createHmac, timingSafeEqual } from "node:crypto";
import CryptoJS from "crypto-js";

export const AUTH_COOKIE_NAME = "icai_auth_session";
export const AUTH_SESSION_MAX_AGE = 60 * 60 * 24 * 7;

/** WinSW XML, prompts and .env files deliver secrets with surrounding whitespace or quotes;
 *  apiv3 rejects a passphrase that differs by even one character. */
export function normalizeSecret(value: string | undefined) {
  const trimmed = value?.trim();
  if (!trimmed) return undefined;
  const unquoted =
    (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
    (trimmed.startsWith("'") && trimmed.endsWith("'"))
      ? trimmed.slice(1, -1).trim()
      : trimmed;
  return unquoted || undefined;
}

/** Irreversible fingerprint of the secret, to compare configuration between environments
 *  without printing the secret to logs. */
export function secretFingerprint(value: string | undefined) {
  const secret = normalizeSecret(value);
  if (!secret) return "unset";
  return `${createHash("sha256").update(secret).digest("hex").slice(0, 8)}/${secret.length}`;
}

export const AES_PASSPHRASE = normalizeSecret(process.env.PRIVATE_KEY_ENCRYPT);

const SESSION_SECRET =
  normalizeSecret(process.env.SESSION_SECRET) ?? AES_PASSPHRASE;
const ENCRYPTION_KEY = AES_PASSPHRASE;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const CRYPTO_JS_AES_PREFIX = "U2FsdGVkX1";

/**
 * Plaintext of a CryptoJS AES payload, or `undefined` when the value is not
 * AES ciphertext or cannot be decrypted with `PRIVATE_KEY_ENCRYPT`.
 */
export function decryptAesText(value: string) {
  const text = value.trim();

  if (!ENCRYPTION_KEY || !text.startsWith(CRYPTO_JS_AES_PREFIX)) {
    return undefined;
  }

  try {
    return (
      CryptoJS.AES.decrypt(text, ENCRYPTION_KEY)
        .toString(CryptoJS.enc.Utf8)
        .trim() || undefined
    );
  } catch {
    return undefined;
  }
}

function readableEmail(value: string) {
  const email = value.trim();

  if (!email || EMAIL_PATTERN.test(email)) {
    return email;
  }

  const decrypted = decryptAesText(email);

  return decrypted && EMAIL_PATTERN.test(decrypted) ? decrypted : email;
}

/** Account classification returned by the login procedure as `Loai`. */
export type AuthRole = 0 | 1 | 2;

export function isAuthRole(value: unknown): value is AuthRole {
  return value === 0 || value === 1 || value === 2;
}

export interface AuthUser {
  id: number;
  username: string;
  email: string;
  fullName: string;
  HT_GROUPUSER_ID: string[];
  Role: AuthRole;
}

export interface AuthSession {
  user: AuthUser;
  /** apiv3 access token, valid for 40 minutes (`ACCESS_TOKEN_EXPIRES_IN`). */
  token?: string;
  /** apiv3 refresh token: without it the session dies after 40 minutes because the backend
   *  cannot renew it and returns 401. */
  refreshToken?: string;
}
export function shouldUseSecureCookie(request: Request) {
  const forwardedProtocol = request.headers
    .get("x-forwarded-proto")
    ?.split(",")[0]
    .trim();

  if (forwardedProtocol) {
    return forwardedProtocol === "https";
  }

  return new URL(request.url).protocol === "https:";
}

function signPayload(payload: string) {
  if (!SESSION_SECRET) {
    throw new Error("SESSION_SECRET is not configured");
  }

  return createHmac("sha256", SESSION_SECRET)
    .update(payload)
    .digest("base64url");
}

export function serializeAuthSession(session: AuthSession) {
  const payload = Buffer.from(
    JSON.stringify({
      ...session,
      user: {
        ...session.user,
        email: readableEmail(session.user.email),
      },
      expiresAt: Date.now() + AUTH_SESSION_MAX_AGE * 1000,
    }),
    "utf8",
  ).toString("base64url");

  return `${payload}.${signPayload(payload)}`;
}

export function parseAuthSession(
  value: string | undefined,
): AuthSession | null {
  if (!value || !SESSION_SECRET) {
    return null;
  }

  try {
    const [payload, signature, extra] = value.split(".");
    if (!payload || !signature || extra) {
      return null;
    }

    const providedSignature = Buffer.from(signature, "base64url");
    const expectedSignature = Buffer.from(signPayload(payload), "base64url");
    if (
      providedSignature.length !== expectedSignature.length ||
      !timingSafeEqual(providedSignature, expectedSignature)
    ) {
      return null;
    }

    const parsed = JSON.parse(
      Buffer.from(payload, "base64url").toString("utf8"),
    ) as Partial<AuthSession> & { expiresAt?: unknown };
    const user = parsed.user;

    if (
      !user ||
      typeof user.id !== "number" ||
      typeof user.username !== "string" ||
      typeof user.email !== "string" ||
      typeof user.fullName !== "string" ||
      !Array.isArray(user.HT_GROUPUSER_ID) ||
      !user.HT_GROUPUSER_ID.every((groupId) => typeof groupId === "string") ||
      !isAuthRole(user.Role) ||
      typeof parsed.expiresAt !== "number" ||
      parsed.expiresAt <= Date.now()
    ) {
      return null;
    }

    return {
      user: {
        ...user,
        email: readableEmail(user.email),
      },
      token:
        typeof parsed.token === "string" && parsed.token.trim()
          ? parsed.token
          : undefined,
      refreshToken:
        typeof parsed.refreshToken === "string" && parsed.refreshToken.trim()
          ? parsed.refreshToken
          : undefined,
    };
  } catch {
    return null;
  }
}
