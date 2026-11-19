import type {
  RegisterFormData,
  LoginFormData,
  ResendVerificationFormData,
} from "../validations/auth";
import type { AuthUser } from "../auth/session";

// API base URL - configure via env in production
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://apiv3.uneti.edu.vn";

interface ApiResponse<T = unknown> {
  code: number;
  success: boolean;
  message: string;
  errors?: string[];
  reference?: string;
  body?: T;
}

interface LoginResponse {
  code: number;
  message: string;
  isAuthenticated: boolean;
  user: AuthUser | null;
}

interface RegisterResult {
  HT_NguoiDungNgoai_ID: number;
}

const CLIENT_NETWORK_MESSAGE =
  "We couldn't connect to the server. Please check your internet connection and try again.";
const CLIENT_CONTRACT_MESSAGE =
  "The server returned an unexpected response. Please try again later or contact the administrator.";

/** Error already interpreted for end users: `message` is always an English sentence,
 *  `reference` is a short reference code to match against server logs. */
export class AuthRequestError extends Error {
  constructor(
    message: string,
    readonly reference?: string,
  ) {
    super(message);
    this.name = "AuthRequestError";
  }
}

/** Every auth API call goes through here: a non-JSON response (HTML error page
 *  from the host, 502 from a reverse proxy) becomes an English message, NEVER
 *  a JSON.parse error string. */
async function requestAuthJson<T>(
  path: string,
  init: RequestInit,
  prefix: string,
  fallbackMessage: string,
): Promise<T> {
  let response: Response;

  try {
    response = await fetch(path, { cache: "no-store", ...init });
  } catch {
    throw new AuthRequestError(CLIENT_NETWORK_MESSAGE, `${prefix}-NET`);
  }

  const rawBody = await response.text().catch(() => "");
  let result: (Partial<ApiResponse> & Record<string, unknown>) | null = null;

  try {
    result = rawBody ? JSON.parse(rawBody) : null;
  } catch {
    result = null;
  }

  if (!result || typeof result !== "object") {
    throw new AuthRequestError(
      CLIENT_CONTRACT_MESSAGE,
      `${prefix}-${response.status}`,
    );
  }

  if (!response.ok) {
    const message =
      typeof result.message === "string" && result.message.trim()
        ? result.message
        : fallbackMessage;
    const reference =
      typeof result.reference === "string"
        ? result.reference
        : `${prefix}-${response.status}`;

    throw new AuthRequestError(message, reference);
  }

  return result as T;
}

/**
 * Register an external user account
 */
export async function registerUser(
  data: RegisterFormData
): Promise<ApiResponse<RegisterResult[]>> {
  return requestAuthJson<ApiResponse<RegisterResult[]>>(
    "/api/auth/register",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    },
    "REG",
    "Registration failed. Please try again later.",
  );
}

/**
 * Sign in to an account
 */
export async function loginUser(data: LoginFormData): Promise<LoginResponse> {
  return requestAuthJson<LoginResponse>(
    "/api/auth/login",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(data),
    },
    "LGN",
    "Sign-in failed. Please check your details and try again.",
  );
}

/**
 * Builds the email verification URL so the browser navigates directly to the API.
 * The API verifies the token, then redirects to /verify-email-result.
 */
export function getEmailVerificationUrl(token: string) {
  return `${API_BASE_URL}/api/auth/nguoi-dung-ngoai/verify-email?token=${encodeURIComponent(token)}`;
}

/**
 * Resend verification email
 */
export async function resendVerificationEmail(
  data: ResendVerificationFormData,
): Promise<ApiResponse> {
  return requestAuthJson<ApiResponse>(
    "/api/auth/resend-verification",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    },
    "RSV",
    "Failed to send the verification email. Please try again later.",
  );
}
