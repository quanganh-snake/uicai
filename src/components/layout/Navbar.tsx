"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
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

export function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <header
      className="fixed inset-x-0 top-0 z-50 w-full border-b border-blue-900/40 backdrop-blur-md shadow-sm"
      style={{
        backgroundColor: "rgba(4, 65, 130, 0.92)",
        color: "#ffffff",
      }}
    >
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between gap-3 px-4 sm:h-20 sm:px-6 lg:px-8">
        <Link
          href="/icai-2026"
          className="flex min-w-0 items-center gap-3 transition-opacity hover:opacity-90"
          aria-label="The 2nd International Conference on AI: AI-Native for Universities and Industry home"
        >
          <div className="relative h-10 w-28 sm:h-12 sm:w-36">
            <Image
              src="/images/logo.png"
              alt="ICAI 2026 logo"
              fill
              priority
              className="object-contain"
              sizes="(min-width: 640px) 144px, 112px"
            />
          </div>
        </Link>

        <nav className="hidden xl:flex items-center gap-1">
          {NAV_LINKS.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`px-2.5 py-1.5 text-xs font-medium uppercase tracking-wider transition-colors rounded-md hover:bg-white/10 hover:text-white ${
                  isActive
                    ? "bg-white/15 text-white font-semibold"
                    : "text-slate-200"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden sm:flex items-center gap-3">
          <Button
            asChild
            className="bg-white hover:bg-slate-100 text-[#044182] font-semibold text-xs uppercase tracking-wider h-9 px-4 rounded-md shadow-xs hover:shadow-sm"
          >
            <Link href="/icai-2026/join">
              Submission
              <ArrowUpRight className="ml-1 h-3.5 w-3.5" />
            </Link>
          </Button>
        </div>

        <div className="flex items-center gap-2 xl:hidden">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white hover:bg-white/15 h-9 w-9 rounded-md"
                  aria-label="Toggle navigation menu"
                >
                  <Menu className="h-5 w-5" />
                </Button>
              }
            />
            <SheetContent
              side="right"
              className="w-[300px] sm:w-[350px] bg-[#044182] text-white border-l border-blue-900/60 p-6 flex flex-col justify-between"
            >
              <div className="space-y-6">
                <SheetHeader className="text-left pb-4 border-b border-white/10">
                  <SheetTitle className="text-white text-base font-bold flex items-center gap-2">
                    <span className="relative h-8 w-24 inline-block">
                      <Image
                        src="/images/logo.png"
                        alt="ICAI 2026"
                        fill
                        className="object-contain"
                      />
                    </span>
                  </SheetTitle>
                </SheetHeader>
                <nav className="flex flex-col space-y-1">
                  <Link
                    href="/icai-2026"
                    onClick={() => setIsOpen(false)}
                    className="px-3 py-2 text-sm font-medium rounded-md text-slate-200 hover:bg-white/10 hover:text-white"
                  >
                    Home
                  </Link>
                  {NAV_LINKS.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setIsOpen(false)}
                      className={`px-3 py-2 text-sm font-medium rounded-md ${
                        pathname === link.href
                          ? "bg-white/20 text-white font-semibold"
                          : "text-slate-200 hover:bg-white/10 hover:text-white"
                      }`}
                    >
                      {link.label}
                    </Link>
                  ))}
                </nav>
              </div>

              <div className="pt-6 border-t border-white/10 space-y-3">
                <Button
                  asChild
                  className="w-full bg-white hover:bg-slate-100 text-[#044182] font-semibold text-sm h-10"
                >
                  <Link href="/icai-2026/join" onClick={() => setIsOpen(false)}>
                    Submit a Paper
                    <ArrowUpRight className="ml-1 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
