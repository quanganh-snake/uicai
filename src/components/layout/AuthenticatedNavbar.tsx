import { cookies } from "next/headers";

import { Navbar } from "@/components/layout/Navbar";
import { isAdminUser } from "@/lib/auth/admin";
import {
  AUTH_COOKIE_NAME,
  parseAuthSession,
} from "@/lib/auth/session";

export async function AuthenticatedNavbar() {
  const cookieStore = await cookies();
  const session = parseAuthSession(cookieStore.get(AUTH_COOKIE_NAME)?.value);

  return (
    <Navbar
      initialUser={session?.user ?? null}
      initialIsAdmin={session ? isAdminUser(session.user) : false}
    />
  );
}
