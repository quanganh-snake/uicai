import "server-only";

import { NextResponse } from "next/server";

export const UPSTREAM_SNIPPET_LIMIT = 300;
export const IISNODE_CRASH_MARKER = "iisnode encountered an error";
export const STATUS_TEXT_BODY = /^(bad request|unauthorized|forbidden)$/i;
export const REJECTION_STATUSES = new Set([400, 401, 403]);

export const UPSTREAM_NETWORK_MESSAGE =
  "We couldn't connect to the server. Please check your internet connection and try again.";
export const UPSTREAM_INTERNAL_ERROR_MESSAGE =
  "The server ran into a problem. Please try again in a few minutes.";
export const UPSTREAM_CONTRACT_MESSAGE =
  "The server returned an unexpected response. Please try again later or contact the administrator.";

export function upstreamSnippet(value: string) {
  return value.replace(/\s+/g, " ").trim().slice(0, UPSTREAM_SNIPPET_LIMIT);
}

export function hasSuccessFlag(value: unknown) {
  return (
    typeof value === "object" &&
    value !== null &&
    "success" in value &&
    value.success === true
  );
}

export function upstreamMessage(value: unknown): string | null {
  if (typeof value !== "object" || value === null || !("message" in value)) {
    return null;
  }

  const message = value.message;

  return typeof message === "string" && message.trim()
    ? upstreamSnippet(message)
    : null;
}

function upstreamBody(value: unknown): unknown {
  return typeof value === "object" && value !== null && "body" in value
    ? value.body
    : null;
}

export interface UpstreamShape {
  status: number;
  contentType: string;
  bodyLength: number;
  snippet: string;
}

export type UpstreamPayload =
  | ({ kind: "json"; value: unknown } & UpstreamShape)
  | ({ kind: "host-error-page" } & UpstreamShape)
  | ({ kind: "status-text" } & UpstreamShape)
  | ({ kind: "non-json" } & UpstreamShape);

/** apiv3 runs behind iisnode: every failure may return HTML (often with HTTP
 *  200) instead of JSON, so never call `response.json()` directly. */
export async function readUpstreamPayload(
  response: Response,
): Promise<UpstreamPayload> {
  const rawBody = await response.text().catch(() => "");
  const shape: UpstreamShape = {
    status: response.status,
    contentType: response.headers.get("content-type") ?? "",
    bodyLength: rawBody.length,
    snippet: upstreamSnippet(rawBody),
  };

  try {
    return { kind: "json", value: JSON.parse(rawBody), ...shape };
  } catch {
    if (rawBody.includes(IISNODE_CRASH_MARKER)) {
      return { kind: "host-error-page", ...shape };
    }

    // apiv3 rejects with res.sendStatus(): the body is exactly the status text.
    if (
      REJECTION_STATUSES.has(shape.status) &&
      STATUS_TEXT_BODY.test(shape.snippet)
    ) {
      return { kind: "status-text", ...shape };
    }

    return { kind: "non-json", ...shape };
  }
}

export function logUpstreamAnomaly(
  scope: string,
  kind: string,
  detail: Record<string, unknown>,
) {
  console.error(`[${scope}] ${kind}`, JSON.stringify(detail));
}

export interface UpstreamRelayOptions {
  /** Log prefix, e.g. "auth/register". */
  scope: string;
  /** Prefix of the reference code shown to the user, e.g. "REG". */
  prefix: string;
  endpoint: string;
  init?: RequestInit;
  isSuccess: (payload: unknown, response: Response) => boolean;
  successMessage: string;
  rejectedMessage: string;
}

function failure(code: number, message: string, reference: string) {
  return NextResponse.json(
    { code, success: false, message, reference },
    { status: code, headers: { "Cache-Control": "no-store" } },
  );
}

/** Calls upstream, classifies the response and returns a stable JSON contract to the client.
 *
 *  Diagnostic logs contain ONLY the endpoint + the shape of the upstream response: the bodies of
 *  auth forms contain passwords and emails, NEVER log `init.body` or the query. */
export async function relayUpstreamJson(options: UpstreamRelayOptions) {
  const {
    scope,
    prefix,
    endpoint,
    init,
    isSuccess,
    successMessage,
    rejectedMessage,
  } = options;

  let response: Response;

  try {
    response = await fetch(endpoint, { cache: "no-store", ...init });
  } catch (error) {
    logUpstreamAnomaly(scope, "cannot reach upstream", {
      endpoint,
      error: String(error),
    });

    return failure(502, UPSTREAM_NETWORK_MESSAGE, `${prefix}-NET`);
  }

  const payload = await readUpstreamPayload(response);
  const detail = {
    endpoint,
    status: payload.status,
    contentType: payload.contentType,
    bodyLength: payload.bodyLength,
    snippet: payload.snippet,
  };

  if (payload.kind === "host-error-page") {
    logUpstreamAnomaly(scope, "upstream host error page instead of JSON", detail);

    return failure(502, UPSTREAM_INTERNAL_ERROR_MESSAGE, `${prefix}-502`);
  }

  if (payload.kind === "status-text") {
    logUpstreamAnomaly(scope, "upstream rejected the request", detail);

    return failure(
      payload.status,
      rejectedMessage,
      `${prefix}-${payload.status}`,
    );
  }

  if (payload.kind === "non-json") {
    logUpstreamAnomaly(scope, "upstream returned a non-JSON body", detail);

    return failure(502, UPSTREAM_CONTRACT_MESSAGE, `${prefix}-502`);
  }

  if (isSuccess(payload.value, response)) {
    return NextResponse.json(
      {
        code: 200,
        success: true,
        message: upstreamMessage(payload.value) ?? successMessage,
        body: upstreamBody(payload.value),
      },
      { headers: { "Cache-Control": "no-store" } },
    );
  }

  const status = response.ok ? 400 : response.status;

  logUpstreamAnomaly(scope, "upstream rejected the request", {
    endpoint,
    status,
  });

  return failure(
    status,
    upstreamMessage(payload.value) ?? rejectedMessage,
    `${prefix}-${status}`,
  );
}
