import { NextResponse, type NextRequest } from "next/server";

import {
  AUTH_COOKIE_NAME,
  parseAuthSession,
} from "@/lib/auth/session";

const HOME_PATH = "/aiesi-2027";
const LOGIN_PATH = "/auth/login";

const PRIVATE_PATHS = [
  "/admin",
  "/aiesi-2027/submissions",
  "/aiesi-2027/aiesi-demo",
  "/profile",
];
const AUTH_PATHS = [
  "/auth/login",
  "/auth/register",
  "/auth/resend-verification",
  "/auth/verify-email",
  "/verify-email",
  "/verify-email-result",
];

function matchesPath(pathname: string, paths: readonly string[]) {
  return paths.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`),
  );
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isAuthenticated = Boolean(
    parseAuthSession(request.cookies.get(AUTH_COOKIE_NAME)?.value),
  );

  if (!isAuthenticated && matchesPath(pathname, PRIVATE_PATHS)) {
    return NextResponse.redirect(new URL(LOGIN_PATH, request.url));
  }

  if (isAuthenticated && matchesPath(pathname, AUTH_PATHS)) {
    return NextResponse.redirect(new URL(HOME_PATH, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/aiesi-2027/submissions/:path*",
    "/aiesi-2027/aiesi-demo/:path*",
    "/profile/:path*",
    "/auth/:path*",
    "/verify-email/:path*",
    "/verify-email-result/:path*",
  ],
};
