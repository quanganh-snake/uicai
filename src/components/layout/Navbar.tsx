"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

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
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <header
      className="fixed inset-x-0 top-0 z-[60] w-full border-b border-slate-200/70 shadow-sm backdrop-blur-lg"
      style={{ backgroundColor: NAV_BACKGROUND, color: "#ffffff" }}
    >
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between gap-3 px-4 sm:h-20 sm:px-6 lg:px-8">
        <Link
          href="/icai-2026"
          className="flex min-w-0 flex-1 items-center gap-3 xl:flex-none"
          aria-label="The 2nd International Conference on AI: AI-Native for Universities and Industry home"
        >
          <span className="relative h-10 w-24 shrink-0 sm:h-12 sm:w-36">
            <Image
              src="/images/logo.png"
              alt="The 2nd International Conference on AI: AI-Native for Universities and Industry logo"
              fill
              priority
              className="object-contain object-left"
              sizes="(min-width: 640px) 144px, 96px"
            />
          </span>
        </Link>

        <nav className="hidden min-w-0 items-center gap-3 xl:flex 2xl:gap-5">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="shrink-0 text-sm font-medium text-white transition-colors hover:text-blue-200"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/icai-2026/join"
            className="shrink-0 rounded-full bg-[#3124eb] px-5 py-2.5 text-sm font-semibold text-white shadow-md transition hover:shadow-lg"
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
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="flex min-h-12 items-center rounded-lg px-3 text-base font-medium text-white transition hover:bg-white/10"
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="/icai-2026/join"
                onClick={() => setIsOpen(false)}
                className="mt-2 flex min-h-12 items-center justify-center rounded-full bg-[#3124eb] px-5 text-center text-sm font-semibold text-white shadow-md"
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
