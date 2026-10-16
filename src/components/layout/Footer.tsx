import Link from "next/link";
import { CONFERENCE_INFO } from "@/data/conference";

const QUICK_LINKS = [
  { href: "/icai-2026/program", label: "Program" },
  { href: "/icai-2026/dates", label: "Dates" },
  { href: "/icai-2026/authors", label: "Authors" },
  { href: "/icai-2026/news", label: "News" },
  { href: "/icai-2026/join", label: "Submission" },
];

export function Footer() {
  return (
    <footer
      className="relative mt-12 overflow-hidden py-12 text-sm text-[#efccd5] sm:mt-20 sm:py-16"
      style={{ backgroundColor: "rgba(4, 65, 130, 0.86)" }}
    >
      <div className="absolute top-0 left-0 h-1 w-full bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-50" />
      <div className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-10 px-4 sm:px-6 md:grid-cols-2 lg:grid-cols-4 lg:px-8">
        <div className="lg:col-span-2">
          <h3 className="mb-5 text-xl font-bold tracking-tight sm:text-2xl">
            {CONFERENCE_INFO.name}
          </h3>
          <p className="mb-6 max-w-md leading-relaxed">
            {CONFERENCE_INFO.description}
          </p>
        </div>

        <div>
          <h4 className="mb-6 text-xs font-semibold uppercase tracking-wider">
            Quick Links
          </h4>
          <ul className="space-y-3">
            {QUICK_LINKS.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="transition-colors hover:text-white">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="mb-6 text-xs font-semibold uppercase tracking-wider">
            Contact Us
          </h4>
          <ul className="space-y-4">
            <li>
              <span className="mb-1 block text-xs">Academic Master</span>
              <a
                href={`mailto:${CONFERENCE_INFO.contactEmail}`}
                className="transition-colors hover:text-white"
              >
                {CONFERENCE_INFO.contactEmail}
              </a>
            </li>
            <li>
              <span className="mb-1 block text-xs">Webmaster</span>
              <a
                href={`mailto:${CONFERENCE_INFO.webmasterEmail}`}
                className="transition-colors hover:text-white"
              >
                {CONFERENCE_INFO.webmasterEmail}
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="mx-auto mt-12 flex w-full max-w-7xl flex-col items-center justify-between gap-4 border-t border-white/20 px-4 pt-8 text-center text-xs sm:px-6 md:flex-row md:text-left lg:px-8">
        <p>© 2026 AI-Native for Universities. All rights reserved.</p>
        <p>
          Powered by{" "}
          <span className="font-medium">
            Digital University Division - CMC University
          </span>
        </p>
      </div>
    </footer>
  );
}
