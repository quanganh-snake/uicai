import Image from "next/image";
import Link from "next/link";
import { ArrowRight, MicVocal } from "lucide-react";
import { SPEAKERS } from "@/data/conference";

const KEYNOTE_SPEAKERS = SPEAKERS.filter((speaker) => speaker.isKeynote);

export function KeynotesSection() {
  return (
    <section
      id="keynotes"
      className="relative isolate overflow-hidden bg-slate-950 px-4 py-16 text-white sm:px-6 sm:py-20 lg:px-8"
    >
      <div className="absolute inset-0 -z-20 bg-[radial-gradient(circle_at_12%_12%,rgba(37,99,235,0.28),transparent_30%),radial-gradient(circle_at_88%_75%,rgba(13,148,136,0.2),transparent_34%)]" />
      <div className="absolute inset-0 -z-10 opacity-[0.12] [background-image:linear-gradient(rgba(255,255,255,0.22)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.22)_1px,transparent_1px)] [background-size:42px_42px]" />

      <div className="mx-auto max-w-7xl">
        <div className="mb-10 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div className="max-w-3xl">
            <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-cyan-200">
              <MicVocal className="h-4 w-4" aria-hidden />
              Keynote stage
            </p>
            <h2 className="mt-3 text-3xl font-semibold leading-tight sm:text-4xl">
              Meet the voices shaping the conference conversation
            </h2>
            <p className="mt-5 max-w-2xl text-base leading-7 text-slate-300">
              Invited experts connecting research breakthroughs with responsible,
              real-world impact.
            </p>
          </div>
          <Link
            href="/icai-2026/keynotes"
            className="inline-flex min-h-11 w-fit items-center justify-center gap-2 rounded-md border border-white/20 bg-white px-5 text-sm font-semibold text-slate-950 transition hover:-translate-y-0.5 hover:bg-cyan-50"
          >
            View all keynotes
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </div>

        <div className="flex flex-wrap justify-center gap-5">
          {KEYNOTE_SPEAKERS.map((speaker) => (
            <div
              key={speaker.id}
              className="w-full sm:w-[calc((100%_-_1.25rem)_/_2)] xl:w-[calc((100%_-_3.75rem)_/_4)]"
            >
              <article className="group flex h-full flex-col overflow-hidden rounded-lg border border-white/10 bg-white/5 shadow-2xl backdrop-blur-sm">
                <div className="relative aspect-[4/5] overflow-hidden bg-slate-800">
                  <Image
                    src={speaker.avatar}
                    alt={speaker.name}
                    fill
                    className="object-cover transition duration-500 group-hover:scale-105"
                    sizes="(min-width: 1280px) 25vw, (min-width: 640px) 50vw, 100vw"
                  />
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_38%,rgba(2,6,23,0.96)_100%)]" />
                  <div className="absolute left-4 top-4 rounded-md border border-white/15 bg-slate-950/55 px-3 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-white backdrop-blur">
                    {speaker.role}
                  </div>
                  <div className="absolute inset-x-0 bottom-0 p-5">
                    <h3 className="text-xl font-semibold leading-tight text-white">
                      {speaker.name}
                    </h3>
                    {speaker.affiliation.map((item) => (
                      <p key={item} className="mt-2 text-sm leading-6 text-slate-300">
                        {item}
                      </p>
                    ))}
                  </div>
                </div>
              </article>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
