import { PageHeader } from "@/components/layout/PageHeader";
import { MILESTONES } from "@/data/conference";
import { Calendar, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function DatesPage() {
  return (
    <div>
      <PageHeader
        title="Dates"
        description="Submission, notification, camera-ready, and conference deadlines for The 2nd International Conference on AI: AI-Native for Universities and Industry."
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="max-w-4xl space-y-6">
          {MILESTONES.map((item) => (
            <div
              key={item.id}
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl border border-slate-200 bg-white p-6 shadow-xs hover:border-blue-200 hover:shadow-sm transition"
            >
              <div className="space-y-1">
                <span className="inline-block rounded-md bg-blue-50 px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider text-[#3124eb]">
                  {item.badge}
                </span>
                <h3 className="text-xl font-bold text-slate-900">
                  {item.title}
                </h3>
                {item.description && (
                  <p className="text-sm text-slate-600">{item.description}</p>
                )}
              </div>

              <div className="flex items-center gap-2 self-start sm:self-auto rounded-lg bg-slate-50 border border-slate-100 px-4 py-2.5 text-slate-900 font-bold text-base shrink-0">
                <Calendar className="h-4 w-4 text-[#3124eb]" />
                <span>{item.date}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 rounded-xl bg-blue-50/60 border border-blue-200/60 p-6 sm:p-8 max-w-4xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div>
            <h4 className="text-lg font-bold text-slate-900">
              Ready to submit your paper?
            </h4>
            <p className="text-sm text-slate-600 mt-1">
              Submissions are managed via Microsoft CMT platform.
            </p>
          </div>
          <Button asChild className="bg-[#3124eb] hover:bg-[#2518cf] text-white">
            <Link href="/icai-2026/join">
              Go to Submission Guidelines
              <ArrowRight className="ml-1.5 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
