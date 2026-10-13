import { PageHeader } from "@/components/layout/PageHeader";
import { SPEAKERS } from "@/data/conference";
import Image from "next/image";
import { Sparkles, Globe2 } from "lucide-react";

export default function KeynotesPage() {
  const keynoteSpeakers = SPEAKERS.filter((s) => s.isKeynote);

  return (
    <div>
      <PageHeader
        title="Keynotes"
        description="Meet the invited speakers connecting fundamental AI research, applied technology, responsible deployment and cross-disciplinary innovation."
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 rounded-2xl border border-slate-200 bg-slate-50/70 p-6 sm:p-8">
          <div className="lg:col-span-2 space-y-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#3124eb]">
              AI Keynote Stage
            </span>
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Research voices shaping the frontier of intelligent systems.
            </h2>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              Meet the invited scholars and visionary leaders connecting breakthroughs in AI with universities, industrial applications, and educational innovation.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="flex flex-col items-center justify-center rounded-xl bg-white p-4 text-center border border-slate-200/80 shadow-xs">
              <span className="font-mono text-3xl font-extrabold text-[#3124eb]">2</span>
              <span className="mt-1 text-xs text-slate-500 font-medium">Keynote speakers</span>
            </div>
            <div className="flex flex-col items-center justify-center rounded-xl bg-white p-4 text-center border border-slate-200/80 shadow-xs">
              <Sparkles className="h-6 w-6 text-[#3124eb]" />
              <span className="mt-2 text-xs text-slate-500 font-medium">AI-Native Focus</span>
            </div>
            <div className="flex flex-col items-center justify-center rounded-xl bg-white p-4 text-center border border-slate-200/80 shadow-xs">
              <Globe2 className="h-6 w-6 text-[#3124eb]" />
              <span className="mt-2 text-xs text-slate-500 font-medium">Global Forum</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {keynoteSpeakers.map((speaker) => (
            <div
              key={speaker.id}
              className="flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs hover:border-blue-200 hover:shadow-md transition"
            >
              <div className="relative aspect-[16/10] w-full overflow-hidden bg-gradient-to-br from-[#3124eb] to-teal-500">
                <Image
                  src={speaker.avatar}
                  alt={speaker.name}
                  fill
                  className="object-cover"
                  sizes="(min-width: 768px) 50vw, 100vw"
                />
              </div>
              <div className="p-6 sm:p-8 space-y-4">
                <span className="inline-block rounded-md bg-blue-50 px-2.5 py-1 text-xs font-semibold uppercase tracking-wider text-[#3124eb]">
                  {speaker.role}
                </span>
                <h3 className="text-2xl font-bold text-slate-900">
                  {speaker.name}
                </h3>
                <div className="space-y-1 text-sm text-slate-600 leading-relaxed">
                  {speaker.affiliation.map((aff, i) => (
                    <p key={i}>{aff}</p>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
