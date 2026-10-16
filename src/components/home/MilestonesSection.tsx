import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  CircleCheck,
  FileText,
  type LucideIcon,
} from "lucide-react";
import { MILESTONES } from "@/data/conference";

const HOME_MILESTONE_STYLE: Record<string, { icon: LucideIcon; color: string }> = {
  submission: { icon: FileText, color: "#3124eb" },
  acceptance: { icon: CircleCheck, color: "#14b8a6" },
  "camera-ready": { icon: CalendarDays, color: "#3124eb" },
};

const HOME_MILESTONES = MILESTONES.filter((item) => item.id in HOME_MILESTONE_STYLE);

export function MilestonesSection() {
  return (
    <section className="bg-white px-4 py-14 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              Timeline
            </p>
            <h2 className="mt-3 text-3xl font-semibold text-slate-950">
              Key submission milestones
            </h2>
          </div>
          <Link
            href="/icai-2026/dates"
            className="inline-flex items-center gap-2 text-sm font-semibold text-blue-700 hover:text-blue-900"
          >
            View all dates
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {HOME_MILESTONES.map((item) => {
            const { icon: Icon, color } = HOME_MILESTONE_STYLE[item.id];
            return (
              <div
                key={item.id}
                className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm"
              >
                <div className="flex items-center justify-between gap-4">
                  <div
                    className="flex h-11 w-11 items-center justify-center rounded-md text-white"
                    style={{ backgroundColor: color }}
                  >
                    <Icon className="h-5 w-5" aria-hidden />
                  </div>
                  <span className="text-sm font-semibold text-slate-400">
                    {item.step}
                  </span>
                </div>
                <h3 className="mt-5 text-lg font-semibold text-slate-950">
                  {item.homeTitle ?? item.title}
                </h3>
                <p className="mt-2 text-base text-slate-600">{item.date}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
