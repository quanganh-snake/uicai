import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SPEAKERS } from "@/data/conference";

export function KeynotesSection() {
  const keynoteSpeakers = SPEAKERS.filter((s) => s.isKeynote);

  return (
    <section className="border-t border-slate-200/80 bg-white py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-12">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-wider text-[#3124eb]">
              Keynote stage
            </p>
            <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl lg:text-4xl">
              Meet the voices shaping the conference conversation
            </h2>
            <p className="mt-3 text-base text-slate-600">
              Invited experts connecting research breakthroughs with responsible, real-world impact.
            </p>
          </div>
          <Button
            asChild
            variant="outline"
            className="self-start md:self-auto border-slate-300 hover:bg-slate-50 text-slate-800"
          >
            <Link href="/icai-2026/keynotes">
              View all keynotes
              <ArrowRight className="ml-1.5 h-4 w-4" />
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {keynoteSpeakers.map((speaker) => (
            <div
              key={speaker.id}
              className="group flex flex-col sm:flex-row overflow-hidden rounded-2xl border border-slate-200 bg-slate-50/50 shadow-xs transition hover:-translate-y-1 hover:border-blue-200 hover:bg-white hover:shadow-md"
            >
              <div className="relative aspect-[4/3] sm:aspect-square sm:w-56 shrink-0 overflow-hidden bg-gradient-to-br from-[#3124eb] to-teal-500">
                <Image
                  src={speaker.avatar}
                  alt={speaker.name}
                  fill
                  className="object-cover transition duration-500 group-hover:scale-105"
                  sizes="(min-width: 640px) 224px, 100vw"
                />
              </div>
              <div className="flex flex-1 flex-col justify-between p-6">
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-blue-700">
                    {speaker.role}
                  </span>
                  <h3 className="mt-2 text-xl font-bold text-slate-900">
                    {speaker.name}
                  </h3>
                  <div className="mt-3 space-y-1 text-sm text-slate-600">
                    {speaker.affiliation.map((aff, i) => (
                      <p key={i}>{aff}</p>
                    ))}
                  </div>
                </div>
                <div className="mt-6 pt-4 border-t border-slate-200/80">
                  <span className="text-xs font-semibold text-[#3124eb]">
                    Keynote Speaker • ICAI-2026
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
