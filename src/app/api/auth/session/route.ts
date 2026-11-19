import { NextRequest, NextResponse } from "next/server";

import {
  AUTH_COOKIE_NAME,
  parseAuthSession,
  shouldUseSecureCookie,
} from "@/lib/auth/session";

export function GET(request: NextRequest) {
  const session = parseAuthSession(
    request.cookies.get(AUTH_COOKIE_NAME)?.value,
  );

  return NextResponse.json(
    session
      ? { isAuthenticated: true, user: session.user }
      : { isAuthenticated: false, user: null },
    { headers: { "Cache-Control": "no-store" } },
  );
}

export function DELETE(request: NextRequest) {
  const response = NextResponse.json({ isAuthenticated: false, user: null });

  response.cookies.set({
    name: AUTH_COOKIE_NAME,
    value: "",
    httpOnly: true,
    sameSite: "lax",
    secure: shouldUseSecureCookie(request),
    path: "/",
    maxAge: 0,
    priority: "high",
  });

  return response;
}
