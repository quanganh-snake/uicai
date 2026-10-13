import { PageHeader } from "@/components/layout/PageHeader";
import { JOURNALS } from "@/data/conference";
import { BookCheck, Award } from "lucide-react";

export default function ProceedingsPage() {
  return (
    <div>
      <PageHeader
        title="Proceedings"
        description="Proceedings publication with ISBN and journal recommendation opportunities for accepted papers."
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-12">
        <div className="max-w-4xl space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-[#3124eb]">
              <BookCheck className="h-5 w-5" />
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-slate-900">
              Proceedings Publication
            </h2>
          </div>
          <p className="text-base sm:text-lg leading-relaxed text-slate-700">
            All accepted full papers will be published in conference proceedings with an official <strong>ISBN</strong>.
          </p>
        </div>

        <div className="max-w-4xl space-y-6">
          <div>
            <h3 className="text-xl font-bold tracking-tight text-slate-900">
              Selected Journal Publication Opportunities
            </h3>
            <p className="mt-2 text-sm sm:text-base text-slate-600">
              Selected high-quality papers will be recommended for publication in the following prestigious journals:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {JOURNALS.map((j) => (
              <div
                key={j.name}
                className="flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-6 shadow-xs hover:border-blue-200 transition"
              >
                <div>
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-[#3124eb] mb-4">
                    <Award className="h-4 w-4" />
                  </div>
                  <h4 className="font-bold text-slate-900 text-base leading-snug">
                    {j.name}
                  </h4>
                </div>
                <div className="mt-6 pt-4 border-t border-slate-100">
                  <span className="inline-block rounded-md bg-blue-50 px-2.5 py-1 text-xs font-semibold text-[#3124eb]">
                    {j.indexing}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="rounded-xl border border-slate-200 bg-slate-50 p-6">
            <h4 className="font-semibold text-slate-900 text-sm mb-2">
              Review & Recommendation Process
            </h4>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Papers recommended for journals will undergo the standard editorial evaluation and additional journal review policies where applicable.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
