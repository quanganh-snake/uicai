import "server-only";

import { cookies } from "next/headers";
import type { z } from "zod";

import {
  AUTH_COOKIE_NAME,
  AUTH_SESSION_MAX_AGE,
  parseAuthSession,
  serializeAuthSession,
  type AuthSession,
} from "@/lib/auth/session";
import { KHCN_AIESI_API_BASE, KHCN_AIESI_FILE_BASE } from "./config";
import { getFriendlyErrorMessage } from "./error-messages";
import type { UploadedFile } from "./types";

export class BackendHttpError extends Error {
  constructor(
    public readonly status: number,
    message: string,
    /** Verbatim upstream response, ONLY for server-side logging. */
    public readonly detail?: string,
    /** KHCN_AIESI endpoint that was called, so logs can tell which stage failed. */
    public readonly endpoint?: string,
    /** true when the message is only the BFF's fallback sentence for the HTTP status: upstream
     *  returned no readable message (usually because IIS replaced the body with an error page).
     *  Network errors, data contract errors and real upstream messages are all false
     *  so callers don't merge them into one generic message. */
    public readonly genericHttpMessage = false,
  ) {
    super(message);
  }
}

const ACCESS_TOKEN_COOKIE = /(?:^|,\s*)access_token=([^;]*)/i;
const REFRESH_TOKEN_COOKIE = /(?:^|,\s*)refresh_token=([^;]*)/i;
/** IIS error page (apiv3 runs on iisnode without httpErrors passThrough) swallows
 *  Express's real message; flagged so logs state why it was masked. */
const IIS_ERROR_PAGE = /<title>\s*\d{3}\s*-\s/i;

async function loadBackendSession(): Promise<AuthSession> {
  const store = await cookies();
  const session = parseAuthSession(store.get(AUTH_COOKIE_NAME)?.value);

  if (!session?.token) {
    throw new BackendHttpError(401, "Your session is not valid. Please sign in again.");
  }

  return session;
}

function backendCookieHeader(session: AuthSession) {
  const parts = [`access_token=${encodeURIComponent(session.token ?? "")}`];

  // apiv3's verifyJWT can only renew an expired access token when a refresh token is present.
  if (session.refreshToken) {
    parts.push(`refresh_token=${encodeURIComponent(session.refreshToken)}`);
  }

  return parts.join("; ");
}

function decodeCookieValue(value: string) {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

/** Token newly issued by apiv3 on the response. An empty value is a command to delete the cookie
 *  (logout) so it is ignored: only a cookie with content is a new token. */
function readRotatedTokens(headers: Headers) {
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

  return { token, refreshToken };
}

/** apiv3 rotates the refresh token and deletes the old one in the DB, so if the new pair is not saved
 *  the next call will certainly return 401. */
async function persistRotatedSession(
  session: AuthSession,
  rotated: { token?: string; refreshToken?: string },
  endpoint: string,
) {
  const token = rotated.token ?? session.token;
  const refreshToken = rotated.refreshToken ?? session.refreshToken;

  if (token === session.token && refreshToken === session.refreshToken) {
    return;
  }

  try {
    const store = await cookies();
    store.set({
      name: AUTH_COOKIE_NAME,
      value: serializeAuthSession({ user: session.user, token, refreshToken }),
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: AUTH_SESSION_MAX_AGE,
      priority: "high",
    });
    console.info("[khcn-aiesi] session_rotated", JSON.stringify({ endpoint }));
  } catch {
    // A Server Component can only read cookies: keep the old token, the next request will rotate it.
  }
}

function backendMessage(payload: unknown) {
  if (
    payload &&
    typeof payload === "object" &&
    "message" in payload &&
    typeof payload.message === "string"
  ) {
    return payload.message.trim();
  }
  return "";
}

export async function fetchKHCNAIESI(
  path: string,
  init: RequestInit = {},
  options: { exposeJsonMessage?: boolean; timeoutMs?: number } = {},
): Promise<unknown> {
  const session = await loadBackendSession();
  const headers = new Headers(init.headers);
  headers.set("Cookie", backendCookieHeader(session));
  headers.set("Accept", "application/json");

  let response: Response;
  try {
    response = await fetch(new URL(path, KHCN_AIESI_API_BASE), {
      ...init,
      headers,
      cache: "no-store",
      signal: init.signal ?? AbortSignal.timeout(options.timeoutMs ?? 30_000),
    });
  } catch (error) {
    console.error(
      "[khcn-aiesi] upstream_unreachable",
      JSON.stringify({ endpoint: path, reason: String(error) }),
    );
    throw new BackendHttpError(
      502,
      "We couldn't reach the submission service. Please try again in a moment.",
      undefined,
      path,
    );
  }

  await persistRotatedSession(session, readRotatedTokens(response.headers), path);

  const contentType = response.headers.get("content-type") ?? "";
  const payload: unknown = contentType.includes("application/json")
    ? await response.json().catch(() => null)
    : await response.text().catch(() => "");

  if (!response.ok) {
    const detail = (
      typeof payload === "string" ? payload : (JSON.stringify(payload) ?? "")
    ).slice(0, 300);

    console.error(
      "[khcn-aiesi] upstream_error",
      JSON.stringify({
        endpoint: path,
        status: response.status,
        contentType,
        bodyLength: detail.length,
        maskedByIis: IIS_ERROR_PAGE.test(detail),
        snippet: detail.slice(0, 300),
      }),
    );

    if (response.status === 401) {
      throw new BackendHttpError(
        401,
        "Your session has expired. Please sign in again.",
        detail,
        path,
      );
    }

    const safeMessage = options.exposeJsonMessage ? backendMessage(payload) : "";
    throw new BackendHttpError(
      response.status >= 400 && response.status < 600 ? response.status : 502,
      safeMessage ||
        (response.status === 400
          ? "The request is not valid. Please check your information and try again."
          : "The submission service couldn't process your request. Please try again."),
      detail,
      path,
      safeMessage === "",
    );
  }

  return payload;
}

export function parseBackend<T>(schema: z.ZodType<T>, payload: unknown): T {
  const parsed = schema.safeParse(payload);
  if (!parsed.success) {
    throw new BackendHttpError(
      502,
      "The submission service returned an unexpected response. Please try again later.",
      parsed.error.issues
        .slice(0, 5)
        .map((issue) => `${issue.path.join(".") || "<root>"}:${issue.code}`)
        .join(", "),
    );
  }
  return parsed.data;
}

export function absoluteFile(file: UploadedFile): UploadedFile {
  return {
    ...file,
    URL: new URL(file.URL, KHCN_AIESI_FILE_BASE).toString(),
  };
}

export function backendFile(file: UploadedFile): UploadedFile {
  try {
    return { ...file, URL: new URL(file.URL).pathname };
  } catch {
    return file;
  }
}

export function toErrorResponse(error: unknown): Response {
  if (error instanceof BackendHttpError) {
    return Response.json(
      {
        ok: false,
        error: {
          status: error.status,
          message: getFriendlyErrorMessage(error.message),
        },
      },
      { status: error.status },
    );
  }

  return Response.json(
    {
      ok: false,
      error: {
        status: 502,
        message:
          "We couldn't reach the submission service. Please try again in a moment.",
      },
    },
    { status: 502 },
  );
}

export function invalidResponse(message: string, details?: unknown) {
  return Response.json(
    { ok: false, error: { status: 400, message, details } },
    { status: 400 },
  );
}
