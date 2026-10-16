import { BookOpen, CalendarDays, Earth, MapPin } from "lucide-react";
import { CONFERENCE_INFO } from "@/data/conference";

const FACTS = [
  { label: "Conference date", value: CONFERENCE_INFO.date, icon: CalendarDays },
  { label: "Host city", value: CONFERENCE_INFO.venue, icon: MapPin },
  { label: "Publication", value: CONFERENCE_INFO.publication, icon: BookOpen },
  { label: "International forum", value: CONFERENCE_INFO.forumType, icon: Earth },
];

export function ConferenceFactsSection() {
  return (
    <section className="border-b border-slate-200 bg-white px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-3 md:grid-cols-2 xl:grid-cols-4">
        {FACTS.map(({ label, value, icon: Icon }) => (
          <div
            key={label}
            className="grid min-h-32 grid-cols-[2.75rem_minmax(0,1fr)] gap-4 rounded-lg border border-slate-200 bg-white p-5 shadow-sm"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-md bg-slate-100 text-slate-700">
              <Icon className="h-5 w-5" aria-hidden />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                {label}
              </p>
              <p className="mt-2 text-base font-semibold leading-6 text-slate-950">
                {value}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
