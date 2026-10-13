import { PageHeader } from "@/components/layout/PageHeader";
import { RESEARCH_TRACKS } from "@/data/conference";
import { CheckCircle2 } from "lucide-react";

export default function SessionsPage() {
  return (
    <div>
      <PageHeader
        title="Sessions"
        description="Conference sessions, parallel tracks, special sessions, and research topics for ICAI-2026."
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-10">
        <div className="grid grid-cols-1 gap-8">
          {RESEARCH_TRACKS.map((track, idx) => (
            <div
              key={track.title}
              className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs hover:border-blue-200 transition"
            >
              <div className="flex items-center gap-3 mb-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 font-mono text-xs font-bold text-[#3124eb]">
                  0{idx + 1}
                </span>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                  {track.title}
                </h2>
              </div>

              {track.description && (
                <p className="mt-3 text-sm sm:text-base leading-relaxed text-slate-700 bg-slate-50 p-4 rounded-xl border border-slate-100">
                  {track.description}
                </p>
              )}

              {track.topics && track.topics.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3">
                    Topics of Interest
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                    {track.topics.map((t, i) => (
                      <div key={i} className="flex items-start gap-2 text-sm text-slate-700">
                        <CheckCircle2 className="h-4 w-4 text-[#3124eb] shrink-0 mt-0.5" />
                        <span>{t}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
