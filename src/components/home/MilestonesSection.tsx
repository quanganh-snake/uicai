import Link from "next/link";
import { ArrowRight, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";

const FEATURED_MILESTONES = [
  {
    step: "01",
    title: "Full paper submission",
    date: "October 31, 2026",
    status: "Active",
  },
  {
    step: "02",
    title: "Acceptance notification",
    date: "November 10, 2026",
    status: "Upcoming",
  },
  {
    step: "03",
    title: "Camera-ready deadline",
    date: "November 20, 2026",
    status: "Upcoming",
  },
];

export function MilestonesSection() {
  return (
    <section className="border-t border-slate-200/80 bg-slate-50/60 py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-10">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-[#3124eb]">
              Timeline
            </p>
            <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl lg:text-4xl">
              Key submission milestones
            </h2>
          </div>
          <Button
            asChild
            variant="outline"
            className="self-start md:self-auto border-slate-300 hover:bg-white text-slate-800 font-medium"
          >
            <Link href="/icai-2026/dates">
              View all dates
              <ArrowRight className="ml-1.5 h-4 w-4" />
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {FEATURED_MILESTONES.map((item) => (
            <div
              key={item.step}
              className="group relative flex flex-col justify-between overflow-hidden rounded-xl border border-slate-200 bg-white p-6 shadow-xs transition hover:-translate-y-1 hover:border-blue-300 hover:shadow-md"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-3xl font-extrabold text-blue-600/30 group-hover:text-[#3124eb] transition-colors">
                  {item.step}
                </span>
                <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-[#3124eb]">
                  {item.status}
                </span>
              </div>
              <div className="mt-8 space-y-2">
                <h3 className="text-lg font-bold text-slate-900 group-hover:text-[#3124eb] transition-colors">
                  {item.title}
                </h3>
                <div className="flex items-center gap-2 text-sm font-semibold text-slate-600">
                  <Calendar className="h-4 w-4 text-[#3124eb]" />
                  <span>{item.date}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
