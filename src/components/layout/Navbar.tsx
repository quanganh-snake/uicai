"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "/icai-2026/proceedings", label: "Proceedings" },
  { href: "/icai-2026/program", label: "Program" },
  { href: "/icai-2026/dates", label: "Dates" },
  { href: "/icai-2026/committees", label: "Committees" },
  { href: "/icai-2026/authors", label: "Authors" },
  { href: "/icai-2026/sessions", label: "Sessions" },
  { href: "/icai-2026/keynotes", label: "Keynotes" },
  { href: "/icai-2026/location", label: "Registration & Fees" },
  { href: "/icai-2026/news", label: "News" },
];

const NAV_BACKGROUND = "rgba(4, 65, 130, 0.85)";

export function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = React.useState(false);
  const isSubmissionActive = pathname === "/icai-2026/join";

  return (
    <header
      className="fixed inset-x-0 top-0 z-[60] w-full border-b border-slate-200/70 shadow-sm backdrop-blur-lg"
      style={{ backgroundColor: NAV_BACKGROUND, color: "#ffffff" }}
    >
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between gap-3 px-4 sm:h-20 sm:px-6 lg:px-8">
        <Link
          href="/icai-2026"
          className="flex min-h-10 min-w-0 flex-1 items-center xl:flex-none"
          aria-label="AIESI 2027 home"
        >
          <span className="inline-flex shrink-0 items-baseline whitespace-nowrap">
            <span className="bg-linear-to-r from-white via-cyan-100 to-teal-200 bg-clip-text text-2xl font-black italic leading-none tracking-[-0.055em] text-transparent sm:text-3xl">
              AIESI
            </span>
            <span className="ml-2 bg-linear-to-r from-cyan-100 to-teal-200 bg-clip-text text-xl font-extrabold leading-none tracking-[0.08em] text-transparent sm:text-2xl">
              2027
            </span>
          </span>
        </Link>

        <nav className="hidden min-w-0 items-center gap-3 xl:flex 2xl:gap-5">
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
            href="/icai-2026/join"
            aria-current={isSubmissionActive ? "page" : undefined}
            className={cn(
              "shrink-0 rounded-full bg-[#3124eb] px-5 py-2.5 text-sm font-semibold text-white shadow-md transition hover:shadow-lg",
              isSubmissionActive && "ring-2 ring-white/80",
            )}
          >
            Submission
          </Link>
        </nav>

        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger
            className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-slate-200 text-white shadow-sm transition xl:hidden"
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
            className="gap-0 border-b border-slate-200 bg-[rgba(4,65,130,0.85)] px-4 py-4 text-white shadow-xl backdrop-blur-lg data-[side=top]:top-16 data-[side=top]:sm:top-20 xl:hidden"
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
                      isActive
                        ? "bg-white/10 text-blue-200"
                        : "text-white",
                    )}
                  >
                    {link.label}
                  </Link>
                );
              })}
              <Link
                href="/icai-2026/join"
                aria-current={isSubmissionActive ? "page" : undefined}
                onClick={() => setIsOpen(false)}
                className={cn(
                  "mt-2 flex min-h-12 items-center justify-center rounded-full bg-[#3124eb] px-5 text-center text-sm font-semibold text-white shadow-md",
                  isSubmissionActive && "ring-2 ring-white/80",
                )}
              >
                Submission
              </Link>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
