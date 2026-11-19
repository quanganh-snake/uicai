"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  ChevronDown,
  FileClock,
  LoaderCircle,
  LogIn,
  LogOut,
  Menu,
  ShieldCheck,
  UserRound,
  X,
} from "lucide-react";
import { Menu as MenuPrimitive } from "@base-ui/react/menu";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import type { AuthUser } from "@/lib/auth/session";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "/aiesi-2027/proceedings", label: "Proceedings" },
  { href: "/aiesi-2027/program", label: "Program" },
  { href: "/aiesi-2027/dates", label: "Dates" },
  { href: "/aiesi-2027/committees", label: "Committees" },
  { href: "/aiesi-2027/authors", label: "Authors" },
  { href: "/aiesi-2027/sessions", label: "Sessions" },
  { href: "/aiesi-2027/keynotes", label: "Keynotes" },
  { href: "/aiesi-2027/location", label: "Registration & Fees" },
  { href: "/aiesi-2027/news", label: "News" },
];

const NAV_BACKGROUND = "rgba(4, 65, 130, 0.85)";
const ADMIN_SUBMISSIONS_PATH = "/admin/submissions";
const PROFILE_PATH = "/profile";
const SUBMISSION_HISTORY_PATH = "/aiesi-2027/submissions";

interface NavbarProps {
  initialUser: AuthUser | null;
  initialIsAdmin: boolean;
}

export function Navbar({ initialUser, initialIsAdmin }: NavbarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = React.useState(false);
  const [isSigningOut, setIsSigningOut] = React.useState(false);
  const [signOutError, setSignOutError] = React.useState("");
  const isSubmissionActive = pathname === "/aiesi-2027/join";
  const isProfileActive = pathname === PROFILE_PATH;
  const isSubmissionHistoryActive = pathname === SUBMISSION_HISTORY_PATH;
  const isAdminSubmissionsActive = pathname === ADMIN_SUBMISSIONS_PATH;
  const displayName = initialUser?.fullName.trim() || initialUser?.username;

  React.useEffect(() => {
    if (!initialUser || isSigningOut) return;

    let active = true;
    const checkSession = async () => {
      try {
        const response = await fetch("/api/auth/session", { cache: "no-store" });
        const result = (await response.json()) as { isAuthenticated?: boolean };
        if (!active || result.isAuthenticated) return;

        if (
          pathname === "/aiesi-2027/join" &&
          document.getElementById("paper-submission-form")
        ) {
          return;
        }

        window.location.replace("/aiesi-2027");
      } catch {
        // A network failure is not proof that the session expired.
      }
    };
    const checkVisibleSession = () => {
      if (document.visibilityState === "visible") void checkSession();
    };

    void checkSession();
    const interval = window.setInterval(checkSession, 30_000);
    window.addEventListener("focus", checkSession);
    document.addEventListener("visibilitychange", checkVisibleSession);
    return () => {
      active = false;
      window.clearInterval(interval);
      window.removeEventListener("focus", checkSession);
      document.removeEventListener("visibilitychange", checkVisibleSession);
    };
  }, [initialUser, isSigningOut, pathname]);

  const handleSignOut = async () => {
    if (isSigningOut) {
      return;
    }

    setIsSigningOut(true);
    setSignOutError("");

    try {
      const response = await fetch("/api/auth/session", { method: "DELETE" });

      if (!response.ok) {
        throw new Error("Sign out failed");
      }

      setIsOpen(false);
      router.replace("/auth/login");
      router.refresh();
    } catch {
      setSignOutError("Unable to sign out. Please try again.");
    } finally {
      setIsSigningOut(false);
    }
  };

  return (
    <header
      className="fixed inset-x-0 top-0 z-60 w-full border-b border-slate-200/70 shadow-sm backdrop-blur-lg"
      style={{ backgroundColor: NAV_BACKGROUND, color: "#ffffff" }}
    >
      <div className="mx-auto flex h-16 w-full max-w-[96rem] items-center justify-between gap-3 px-4 sm:h-20 sm:px-6 lg:px-8">
        <Link
          href="/aiesi-2027"
          className="flex min-h-10 min-w-0 flex-1 items-center 2xl:flex-none"
          aria-label="AIESI 2027 home"
        >
          <span className="inline-flex shrink-0 items-baseline whitespace-nowrap">
            <span className="bg-linear-to-r from-white via-cyan-100 to-teal-200 bg-clip-text text-2xl font-black leading-none text-transparent sm:text-3xl">
              AIESI
            </span>
            <span className="mx-2 inline-block h-6 w-0.5 bg-white text-blue-200" />
            <span className="bg-linear-to-r from-white via-cyan-100 to-teal-200 bg-clip-text text-2xl font-black leading-none text-transparent sm:text-3xl">
              2027
            </span>
          </span>
        </Link>

        <nav className="hidden min-w-0 items-center gap-3 2xl:flex">
          {NAV_LINKS.map((link) => {
            const isActive = pathname === link.href;

            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "shrink-0 text-sm font-medium transition-colors hover:text-blue-200",
                  isActive
                    ? "text-blue-200 underline decoration-2 underline-offset-8"
                    : "text-white",
                )}
              >
                {link.label}
              </Link>
            );
          })}
          <Link
            href="/aiesi-2027/join"
            aria-current={isSubmissionActive ? "page" : undefined}
            className={cn(
              "shrink-0 rounded-full bg-[#3124eb] px-5 py-2.5 text-sm font-semibold text-white shadow-md transition hover:shadow-lg",
              isSubmissionActive && "ring-2 ring-white/80",
            )}
          >
            Submission
          </Link>
        </nav>

        <div className="hidden shrink-0 items-center gap-2 2xl:flex">
          {initialUser ? (
            <MenuPrimitive.Root>
              <MenuPrimitive.Trigger
                className={({ open }) =>
                  cn(
                    "flex min-h-11 max-w-64 cursor-pointer items-center gap-3 rounded-xl px-2.5 py-1.5 text-left text-white transition-colors hover:bg-white/15",
                    open && "bg-white/15",
                  )
                }
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/10">
                  <UserRound className="h-5 w-5" aria-hidden />
                </span>
                <span className="min-w-0 flex-1 leading-tight">
                  <span className="block truncate text-sm font-semibold" title={displayName}>
                    {displayName}
                  </span>
                  <span
                    className="block truncate text-xs text-blue-100"
                    title={initialUser.email}
                  >
                    {initialUser.email}
                  </span>
                </span>
                <ChevronDown className="h-4 w-4 shrink-0 text-blue-100" aria-hidden />
              </MenuPrimitive.Trigger>
              <MenuPrimitive.Portal>
                <MenuPrimitive.Positioner
                  align="end"
                  sideOffset={8}
                  className="z-70"
                >
                  <MenuPrimitive.Popup className="w-60 origin-top-right rounded-2xl border border-border bg-popover text-popover-foreground shadow-lg transition-[opacity,scale,translate] duration-150 ease-out data-ending-style:scale-95 data-ending-style:opacity-0 data-starting-style:scale-95 data-starting-style:opacity-0 data-[side=bottom]:data-starting-style:-translate-y-1 motion-reduce:translate-y-0 motion-reduce:transition-opacity">
                    <div className="flex flex-col gap-1 p-1">
                      <MenuPrimitive.LinkItem
                        render={
                          <Link
                            href={PROFILE_PATH}
                            aria-current={isProfileActive ? "page" : undefined}
                          />
                        }
                        closeOnClick
                        className={cn(
                          "flex min-h-10 cursor-pointer items-center gap-3 rounded-xl px-3 text-sm font-medium outline-none hover:bg-accent data-highlighted:bg-accent",
                          isProfileActive && "bg-accent",
                        )}
                      >
                        <UserRound
                          className="h-4 w-4 text-muted-foreground"
                          aria-hidden
                        />
                        Profile
                      </MenuPrimitive.LinkItem>
                      <MenuPrimitive.LinkItem
                        render={
                          <Link
                            href={SUBMISSION_HISTORY_PATH}
                            aria-current={
                              isSubmissionHistoryActive ? "page" : undefined
                            }
                          />
                        }
                        closeOnClick
                        className={cn(
                          "flex min-h-10 cursor-pointer items-center gap-3 rounded-xl px-3 text-sm font-medium outline-none hover:bg-accent data-highlighted:bg-accent",
                          isSubmissionHistoryActive && "bg-accent",
                        )}
                      >
                        <FileClock
                          className="h-4 w-4 text-muted-foreground"
                          aria-hidden
                        />
                        Submission History
                      </MenuPrimitive.LinkItem>
                      {initialIsAdmin ? (
                        <MenuPrimitive.LinkItem
                          render={
                            <Link
                              href={ADMIN_SUBMISSIONS_PATH}
                              aria-current={
                                isAdminSubmissionsActive ? "page" : undefined
                              }
                            />
                          }
                          closeOnClick
                          className={cn(
                            "flex min-h-10 cursor-pointer items-center gap-3 rounded-xl px-3 text-sm font-medium outline-none hover:bg-accent data-highlighted:bg-accent",
                            isAdminSubmissionsActive && "bg-accent",
                          )}
                        >
                          <ShieldCheck
                            className="h-4 w-4 text-muted-foreground"
                            aria-hidden
                          />
                          Review Submissions
                        </MenuPrimitive.LinkItem>
                      ) : null}
                    </div>
                    <MenuPrimitive.Separator className="h-px bg-border" />
                    <div className="p-1">
                      <MenuPrimitive.Item
                        onClick={handleSignOut}
                        disabled={isSigningOut}
                        aria-busy={isSigningOut}
                        className="flex min-h-10 w-full cursor-pointer items-center gap-3 rounded-xl px-3 text-sm font-medium outline-none hover:bg-rose-500/10 hover:text-rose-700 data-highlighted:bg-rose-500/10 data-highlighted:text-rose-700 data-disabled:cursor-wait data-disabled:opacity-60"
                      >
                        {isSigningOut ? (
                          <LoaderCircle
                            className="h-4 w-4 animate-spin"
                            aria-hidden
                          />
                        ) : (
                          <LogOut className="h-4 w-4" aria-hidden />
                        )}
                        Sign Out
                      </MenuPrimitive.Item>
                    </div>
                  </MenuPrimitive.Popup>
                </MenuPrimitive.Positioner>
              </MenuPrimitive.Portal>
            </MenuPrimitive.Root>
          ) : (
            <Link
              href="/auth/login"
              className="inline-flex min-h-10 shrink-0 items-center gap-2 rounded-xl border border-white/60 bg-white/10 px-3 text-sm font-semibold text-white transition-colors hover:bg-white/20"
            >
              <LogIn className="h-4 w-4" aria-hidden />
              Sign in
            </Link>
          )}
        </div>

        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger
            className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-slate-200 text-white shadow-sm transition 2xl:hidden"
            style={{ backgroundColor: NAV_BACKGROUND }}
            aria-label={isOpen ? "Close navigation" : "Open navigation"}
          >
            {isOpen ? (
              <X className="h-5 w-5" aria-hidden />
            ) : (
              <Menu className="h-5 w-5" aria-hidden />
            )}
          </SheetTrigger>
          <SheetContent
            side="top"
            showCloseButton={false}
            className="gap-0 border-b border-slate-200 bg-[rgba(4,65,130,0.85)] px-4 py-4 text-white shadow-xl backdrop-blur-lg data-[side=top]:top-16 data-[side=top]:sm:top-20 2xl:hidden"
          >
            <SheetTitle className="sr-only">Navigation</SheetTitle>
            <nav className="mx-auto flex max-h-[calc(100vh-5rem)] w-full max-w-3xl flex-col gap-1 overflow-y-auto sm:max-h-[calc(100vh-6rem)]">
              {NAV_LINKS.map((link) => {
                const isActive = pathname === link.href;

                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    aria-current={isActive ? "page" : undefined}
                    onClick={() => setIsOpen(false)}
                    className={cn(
                      "flex min-h-12 items-center rounded-lg px-3 text-base font-medium transition hover:bg-white/10",
                      isActive ? "bg-white/10 text-blue-200" : "text-white",
                    )}
                  >
                    {link.label}
                  </Link>
                );
              })}
              <Link
                href="/aiesi-2027/join"
                aria-current={isSubmissionActive ? "page" : undefined}
                onClick={() => setIsOpen(false)}
                className={cn(
                  "mt-2 flex min-h-12 items-center justify-center rounded-full bg-[#3124eb] px-5 text-center text-sm font-semibold text-white shadow-md",
                  isSubmissionActive && "ring-2 ring-white/80",
                )}
              >
                Submission
              </Link>

              <div className="mt-3 border-t border-white/20 pt-3">
                {initialUser ? (
                  <div className="space-y-3">
                    <div className="flex min-w-0 items-center gap-3 px-3">
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/10">
                        <UserRound className="h-5 w-5" aria-hidden />
                      </span>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold" title={displayName}>
                          {displayName}
                        </p>
                        <p
                          className="truncate text-xs text-blue-100"
                          title={initialUser.email}
                        >
                          {initialUser.email}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col gap-1">
                      <Link
                        href={PROFILE_PATH}
                        aria-current={isProfileActive ? "page" : undefined}
                        onClick={() => setIsOpen(false)}
                        className={cn(
                          "flex min-h-12 items-center gap-3 rounded-xl px-3 text-sm font-medium transition-colors hover:bg-white/10",
                          isProfileActive && "bg-white/10 text-blue-100",
                        )}
                      >
                        <UserRound className="h-4 w-4 text-blue-100" aria-hidden />
                        Profile
                      </Link>
                      <Link
                        href={SUBMISSION_HISTORY_PATH}
                        aria-current={
                          isSubmissionHistoryActive ? "page" : undefined
                        }
                        onClick={() => setIsOpen(false)}
                        className={cn(
                          "flex min-h-12 items-center gap-3 rounded-xl px-3 text-sm font-medium transition-colors hover:bg-white/10",
                          isSubmissionHistoryActive &&
                            "bg-white/10 text-blue-100",
                        )}
                      >
                        <FileClock className="h-4 w-4 text-blue-100" aria-hidden />
                        Submission History
                      </Link>
                      {initialIsAdmin ? (
                        <Link
                          href={ADMIN_SUBMISSIONS_PATH}
                          aria-current={
                            isAdminSubmissionsActive ? "page" : undefined
                          }
                          onClick={() => setIsOpen(false)}
                          className={cn(
                            "flex min-h-12 items-center gap-3 rounded-xl px-3 text-sm font-medium transition-colors hover:bg-white/10",
                            isAdminSubmissionsActive &&
                              "bg-white/10 text-blue-100",
                          )}
                        >
                          <ShieldCheck
                            className="h-4 w-4 text-blue-100"
                            aria-hidden
                          />
                          Review Submissions
                        </Link>
                      ) : null}
                      <button
                        type="button"
                        onClick={handleSignOut}
                        aria-disabled={isSigningOut}
                        aria-busy={isSigningOut}
                        className="flex min-h-12 w-full cursor-pointer items-center gap-3 rounded-xl px-3 text-left text-sm font-medium transition-colors hover:bg-rose-500/20 hover:text-rose-100"
                      >
                        {isSigningOut ? (
                          <LoaderCircle
                            className="h-4 w-4 animate-spin"
                            aria-hidden
                          />
                        ) : (
                          <LogOut className="h-4 w-4" aria-hidden />
                        )}
                        Sign Out
                      </button>
                    </div>
                  </div>
                ) : (
                  <Link
                    href="/auth/login"
                    onClick={() => setIsOpen(false)}
                    className="flex min-h-12 w-full items-center justify-center gap-2 rounded-xl border border-white/60 bg-white/10 px-4 text-sm font-semibold text-white transition-colors hover:bg-white/20"
                  >
                    <LogIn className="h-4 w-4" aria-hidden />
                    Sign in
                  </Link>
                )}
              </div>
            </nav>
          </SheetContent>
        </Sheet>

        {signOutError ? (
          <p className="sr-only" role="alert">
            {signOutError}
          </p>
        ) : null}
      </div>
    </header>
  );
}
