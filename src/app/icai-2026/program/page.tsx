import { PageHeader } from "@/components/layout/PageHeader";
import { CONFERENCE_INFO } from "@/data/conference";

const PROGRAM_DAYS = [
  {
    date: CONFERENCE_INFO.date,
    items: [
      {
        time: "TBA",
        type: "other",
        title: "ICAI-2026 Conference Day",
        description: "Detailed program will be updated soon.",
      },
    ],
  },
];

export default function ProgramPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <PageHeader title="Program" />

      <section className="px-4 py-12 sm:py-16 lg:py-20">
        <div className="mx-auto w-full min-w-0 max-w-5xl">
          <div className="space-y-8">
            {PROGRAM_DAYS.map((day) => (
              <section key={day.date}>
                <h2 className="mb-4 text-2xl font-bold text-slate-900">{day.date}</h2>
                <div className="space-y-3">
                  {day.items.map((item) => (
                    <div
                      key={item.title}
                      className="grid grid-cols-1 gap-4 rounded-lg border border-slate-900 bg-white p-5 shadow-sm md:grid-cols-[180px_1fr]"
                    >
                      <div className="font-semibold text-blue-600">{item.time}</div>
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                          {item.type}
                        </p>
                        <h3 className="mt-1 text-lg font-bold text-slate-900">{item.title}</h3>
                        <p className="mt-3 text-slate-600">{item.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
