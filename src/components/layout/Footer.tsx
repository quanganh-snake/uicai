import Link from "next/link";
import { Mail } from "lucide-react";
import { CONFERENCE_INFO } from "@/data/conference";

export function Footer() {
  return (
    <footer
      className="relative mt-12 overflow-hidden py-12 text-sm sm:mt-20 sm:py-16 text-slate-200"
      style={{
        backgroundColor: "rgba(4, 65, 130, 0.86)",
      }}
    >
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-400 to-transparent opacity-50" />
      <div className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-10 px-4 sm:px-6 md:grid-cols-2 lg:grid-cols-4 lg:px-8">
        <div className="lg:col-span-2">
          <h3 className="mb-4 text-xl font-bold tracking-tight text-white sm:text-2xl">
            {CONFERENCE_INFO.name}
          </h3>
          <p className="max-w-md text-xs sm:text-sm leading-relaxed text-blue-100/90 mb-6">
            {CONFERENCE_INFO.description}
          </p>
        </div>

        <div>
          <h4 className="font-semibold mb-5 uppercase tracking-wider text-xs text-blue-200">
            Quick Links
          </h4>
          <ul className="space-y-2.5 text-sm">
            <li>
              <Link
                href="/icai-2026/program"
                className="text-blue-100/80 hover:text-white transition-colors"
              >
                Program
              </Link>
            </li>
            <li>
              <Link
                href="/icai-2026/dates"
                className="text-blue-100/80 hover:text-white transition-colors"
              >
                Dates
              </Link>
            </li>
            <li>
              <Link
                href="/icai-2026/authors"
                className="text-blue-100/80 hover:text-white transition-colors"
              >
                Authors
              </Link>
            </li>
            <li>
              <Link
                href="/icai-2026/news"
                className="text-blue-100/80 hover:text-white transition-colors"
              >
                News
              </Link>
            </li>
            <li>
              <Link
                href="/icai-2026/join"
                className="text-blue-100/80 hover:text-white transition-colors"
              >
                Submission
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold mb-5 uppercase tracking-wider text-xs text-blue-200">
            Contact Us
          </h4>
          <ul className="space-y-4 text-sm">
            <li>
              <span className="block text-xs text-blue-200/80 mb-0.5">
                Academic Master
              </span>
              <a
                href={`mailto:${CONFERENCE_INFO.contactEmail}`}
                className="flex items-center gap-1.5 text-blue-100 hover:text-white transition-colors font-medium"
              >
                <Mail className="h-3.5 w-3.5 text-blue-300" />
                {CONFERENCE_INFO.contactEmail}
              </a>
            </li>
            <li>
              <span className="block text-xs text-blue-200/80 mb-0.5">
                Webmaster
              </span>
              <a
                href={`mailto:${CONFERENCE_INFO.webmasterEmail}`}
                className="flex items-center gap-1.5 text-blue-100 hover:text-white transition-colors font-medium"
              >
                <Mail className="h-3.5 w-3.5 text-blue-300" />
                {CONFERENCE_INFO.webmasterEmail}
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="mx-auto mt-12 w-full max-w-7xl border-t border-white/10 px-4 pt-8 text-xs text-blue-200/80 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p>© 2026 AI-Native for Universities. All rights reserved.</p>
        <p className="text-blue-200/70">
          Powered by Digital University Division - CMC University
        </p>
      </div>
    </footer>
  );
}
