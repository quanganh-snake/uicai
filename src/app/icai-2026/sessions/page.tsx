import { PageHeader } from "@/components/layout/PageHeader";
import { RESEARCH_TRACKS } from "@/data/conference";

export default function SessionsPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <PageHeader title="Sessions" />

      <section className="px-4 py-12 sm:py-16 lg:py-20">
        <div className="mx-auto w-full min-w-0 max-w-5xl">
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            {RESEARCH_TRACKS.map((track) => (
              <div
                key={track.title}
                className="rounded-lg border border-slate-900 bg-white p-5 shadow-sm sm:p-6"
              >
                <h2 className="text-xl font-bold text-slate-900">
                  {track.title}
                </h2>
                {track.description && (
                  <div
                    className="mt-4 text-slate-600"
                    dangerouslySetInnerHTML={{ __html: track.description }}
                  />
                )}
                {track.topics && (
                  <div className="mt-5 flex flex-wrap gap-2">
                    {track.topics.map((topic) => (
                      <span
                        key={topic}
                        className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-700"
                      >
                        {topic}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
