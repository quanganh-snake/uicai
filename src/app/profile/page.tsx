import type { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { UserRound } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  AUTH_COOKIE_NAME,
  parseAuthSession,
} from "@/lib/auth/session";

export const metadata: Metadata = {
  title: "Profile | AIESI 2027",
  description: "View the account information for your AIESI 2027 profile.",
};

function EmailAddress({ email }: { email: string }) {
  const atIndex = email.lastIndexOf("@");

  if (atIndex < 0) {
    return <>{email}</>;
  }

  return (
    <>
      {email.slice(0, atIndex + 1)}
      <wbr />
      {email.slice(atIndex + 1)}
    </>
  );
}

export default async function ProfilePage() {
  const cookieStore = await cookies();
  const session = parseAuthSession(cookieStore.get(AUTH_COOKIE_NAME)?.value);

  if (!session) {
    redirect("/auth/login");
  }

  const { user } = session;
  const displayName = user.fullName.trim() || user.username;

  return (
    <div className="min-h-[calc(100vh-9rem)] bg-slate-50 px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
      <div className="mx-auto w-full max-w-3xl">
        <header className="mb-8">
          <h1 className="text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">
            Profile
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
            Review the account information associated
          </p>
        </header>

        <Card className="gap-0 py-0">
          <CardHeader className="flex grid-cols-none flex-row items-center gap-4 border-b border-border py-5">
            <span
              className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-700 ring-1 ring-blue-200"
              aria-hidden
            >
              <UserRound className="h-6 w-6" />
            </span>
            <div className="min-w-0">
              <CardTitle className="truncate text-lg font-semibold" title={displayName}>
                {displayName}
              </CardTitle>
              <CardDescription className="mt-1 truncate" title={user.username}>
                @{user.username}
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="py-5">
            <h2 className="mb-5 text-base font-semibold text-slate-950">
              Account Information
            </h2>
            <dl className="@container space-y-4 text-sm">
              <div className="grid gap-1 @sm:grid-cols-[9rem_minmax(0,1fr)] @sm:items-baseline @sm:gap-6">
                <dt className="text-muted-foreground">Full name</dt>
                <dd className="min-w-0 font-medium text-foreground [overflow-wrap:anywhere]">
                  {displayName}
                </dd>
              </div>
              <div className="grid gap-1 @sm:grid-cols-[9rem_minmax(0,1fr)] @sm:items-baseline @sm:gap-6">
                <dt className="text-muted-foreground">Username</dt>
                <dd className="min-w-0 font-medium text-foreground [overflow-wrap:anywhere]">
                  {user.username}
                </dd>
              </div>
              <div className="grid gap-1 @sm:grid-cols-[9rem_minmax(0,1fr)] @sm:items-baseline @sm:gap-6">
                <dt className="text-muted-foreground">Email</dt>
                <dd className="min-w-0 font-medium text-foreground [overflow-wrap:anywhere]">
                  <a
                    href={`mailto:${user.email}`}
                    className="hover:underline hover:underline-offset-4"
                  >
                    <EmailAddress email={user.email} />
                  </a>
                </dd>
              </div>
            </dl>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
