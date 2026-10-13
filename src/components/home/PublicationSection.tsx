import { BookCheck, Award, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { JOURNALS } from "@/data/conference";

export function PublicationSection() {
  return (
    <section className="border-t border-slate-200/80 bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-wider text-[#3124eb]">
            Publication
          </p>
          <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl lg:text-4xl">
            Proceedings and selected publication opportunities
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed">
            Selected high-quality papers recommended for JED, JABES, VJS and other internationally recognized journals.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Main Proceedings card */}
          <div className="rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50/70 via-white to-indigo-50/50 p-7 shadow-xs">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#3124eb] text-white">
              <BookCheck className="h-6 w-6" />
            </div>
            <p className="mt-6 text-xs font-semibold uppercase tracking-wider text-[#3124eb]">
              Proceedings Published By
            </p>
            <h3 className="mt-2 text-xl font-bold text-slate-900">
              Conference proceedings with ISBN
            </h3>
            <p className="mt-3 text-sm text-slate-600 leading-relaxed">
              All accepted and presented papers will be formally compiled and published in the official conference proceedings volume with ISBN indexing.
            </p>
            <div className="mt-6 pt-4 border-t border-blue-100">
              <Link
                href="/icai-2026/proceedings"
                className="inline-flex items-center text-sm font-semibold text-[#3124eb] hover:underline"
              >
                Learn more about proceedings
                <ArrowUpRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
          </div>

          {/* Recommended Journals cards */}
          <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-4">
            {JOURNALS.map((j) => (
              <div
                key={j.name}
                className="flex flex-col justify-between rounded-xl border border-slate-200 bg-slate-50/50 p-5 shadow-xs hover:border-blue-200 hover:bg-white transition"
              >
                <div>
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-100/60 text-[#3124eb]">
                    <Award className="h-4 w-4" />
                  </div>
                  <h4 className="mt-4 text-sm font-bold text-slate-900 leading-snug">
                    {j.name}
                  </h4>
                </div>
                <div className="mt-6 pt-3 border-t border-slate-200">
                  <span className="text-xs font-semibold text-blue-700 bg-blue-50 px-2 py-1 rounded">
                    {j.indexing}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
