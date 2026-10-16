import { PageHeader } from "@/components/layout/PageHeader";
import { MILESTONES } from "@/data/conference";

export default function DatesPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <PageHeader title="Dates" />

      <section className="px-4 py-12 sm:py-16 lg:py-20">
        <div className="mx-auto w-full min-w-0 max-w-5xl">
          <div className="space-y-4">
            {MILESTONES.map((item) => (
              <div
                key={item.id}
                className="grid grid-cols-1 gap-4 rounded-lg border border-slate-900 bg-white p-5 shadow-sm sm:p-6 md:grid-cols-[220px_1fr]"
              >
                <div>
                  <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">
                    {item.badge}
                  </p>
                  <p className="mt-2 text-xl font-bold text-slate-900 sm:text-2xl">
                    {item.date}
                  </p>
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900">{item.title}</h2>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
