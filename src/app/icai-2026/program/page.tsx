import { PageHeader } from "@/components/layout/PageHeader";
import { CONFERENCE_INFO } from "@/data/conference";
import { Calendar, Bell } from "lucide-react";

export default function ProgramPage() {
  return (
    <div>
      <PageHeader
        title="Program"
        description="Conference schedule, presentations, and activities for The 2nd International Conference on AI: AI-Native for Universities and Industry."
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-8">
        <div className="max-w-3xl space-y-4">
          <div className="flex items-center gap-2 text-[#3124eb] font-semibold text-sm">
            <Calendar className="h-4 w-4" />
            <span>{CONFERENCE_INFO.date}</span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            December 3, 2026
          </h2>
        </div>

        <div className="max-w-3xl rounded-xl border border-slate-200 bg-white p-8 shadow-xs">
          <div className="flex items-center gap-3 mb-4">
            <span className="rounded-md bg-blue-50 px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider text-[#3124eb]">
              TBA
            </span>
            <span className="rounded-md bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600">
              other
            </span>
          </div>

          <h3 className="text-xl font-bold text-slate-900">
            ICAI-2026 Conference Day
          </h3>
          <p className="mt-3 text-base text-slate-600 leading-relaxed">
            Detailed program will be updated soon.
          </p>

          <div className="mt-6 flex items-start gap-3 rounded-lg bg-blue-50/50 p-4 border border-blue-100">
            <Bell className="h-5 w-5 text-[#3124eb] shrink-0 mt-0.5" />
            <p className="text-xs sm:text-sm text-slate-700">
              The full program schedule including opening ceremony, keynote speeches, parallel technical tracks, and AI technology exhibition will be released following the final camera-ready deadline.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
