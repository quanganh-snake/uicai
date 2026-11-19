import Image from "next/image";
import {
  Building2,
  Cpu,
  GraduationCap,
  MicVocal,
  Sparkles,
} from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { SPEAKERS } from "@/data/conference";

const KEYNOTE_SPEAKERS = SPEAKERS.filter((speaker) => speaker.isKeynote);

const STAGE_FACTS = [
  {
    value: String(KEYNOTE_SPEAKERS.length),
    label: "Keynote speakers",
    icon: MicVocal,
  },
  {
    value: "Artificial Intelligence, Engineering and Sustainable Innovation",
    label: "Conference Theme",
    icon: Cpu,
  },
  { value: "International", label: "Forum", icon: GraduationCap },
];

const VIEWPORT_SAFE_WIDTH = { maxWidth: "min(100%, calc(100vw - 2rem))" };

export default function KeynotesPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <PageHeader title="Keynotes" />

      <section className="px-4 py-12 sm:py-16 lg:py-20">
        <div className="mx-auto w-full min-w-0 max-w-7xl">
          <div
            className="relative isolate mb-8 w-full min-w-0 overflow-hidden rounded-lg border border-slate-800 bg-slate-950 p-5 text-white shadow-2xl sm:p-7 lg:p-8"
            style={VIEWPORT_SAFE_WIDTH}
          >
            <div className="absolute inset-0 -z-10 bg-[linear-gradient(120deg,rgba(37,99,235,0.28),transparent_38%),linear-gradient(290deg,rgba(20,184,166,0.22),transparent_42%)]" />
            <div className="absolute inset-0 -z-10 opacity-[0.14] bg-[linear-gradient(rgba(255,255,255,0.26)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.26)_1px,transparent_1px)] bg-size-[34px_34px]" />
            <div className="grid min-w-0 gap-7 lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-end">
              <div className="min-w-0">
                <p className="inline-flex items-center gap-2 rounded-md border border-cyan-300/20 bg-cyan-300/10 px-3 py-2 text-xs font-semibold uppercase tracking-wider text-cyan-100">
                  <Sparkles className="h-4 w-4" aria-hidden />
                  AIESI 2027 Keynote Stage
                </p>
                <h2 className="mt-5 max-w-3xl wrap-anywhere text-2xl font-semibold leading-tight sm:text-3xl lg:text-4xl">
                  Research voices advancing Artificial Intelligence, Engineering
                  and Sustainable Innovation.
                </h2>
                <p className="mt-4 max-w-3xl wrap-anywhere text-sm leading-7 text-slate-300 sm:text-base">
                  Meet the invited speakers bringing together perspectives on
                  Artificial Intelligence, advanced engineering, high-tech
                  industries, business transformation, and sustainable
                  development.
                </p>
              </div>
              <div className="grid min-w-0 gap-3 sm:grid-cols-3 lg:grid-cols-1">
                {STAGE_FACTS.map(({ value, label, icon: Icon }) => (
                  <div
                    key={label}
                    className="grid min-w-0 grid-cols-[2.75rem_minmax(0,1fr)] gap-3 rounded-md border border-white/10 bg-white/10 p-3 backdrop-blur"
                  >
                    <div className="flex h-11 w-11 items-center justify-center rounded-md bg-white text-slate-950">
                      <Icon className="h-5 w-5" aria-hidden />
                    </div>
                    <div className="min-w-0">
                      <p className="wrap-anywhere text-lg font-semibold leading-6 text-white">
                        {value}
                      </p>
                      <p className="mt-1 wrap-anywhere text-xs font-medium uppercase tracking-wider text-slate-400">
                        {label}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
            {KEYNOTE_SPEAKERS.map((speaker) => (
              <article
                key={speaker.id}
                className="group w-full overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl"
                style={VIEWPORT_SAFE_WIDTH}
              >
                <div className="relative grid gap-0 sm:grid-cols-[12rem_minmax(0,1fr)]">
                  <div className="relative min-h-64 overflow-hidden bg-slate-950 sm:min-h-72">
                    <Image
                      src={speaker.avatar}
                      alt={speaker.name}
                      width={640}
                      height={800}
                      className="h-full min-h-64 w-full object-cover transition duration-500 group-hover:scale-105 sm:absolute sm:inset-0"
                      sizes="(min-width: 1024px) 12rem, 100vw"
                    />
                    <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_42%,rgba(2,6,23,0.84))]" />
                    <div className="absolute bottom-4 left-4 inline-flex items-center gap-2 rounded-md border border-white/15 bg-white/15 px-3 py-2 text-xs font-semibold uppercase tracking-wider text-white backdrop-blur">
                      <MicVocal className="h-4 w-4" aria-hidden />
                      {speaker.role}
                    </div>
                  </div>
                  <div className="flex min-w-0 flex-col p-5 sm:p-6">
                    <div className="mb-4 flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <h2 className="text-2xl font-semibold leading-tight text-slate-950">
                          {speaker.name}
                        </h2>
                        {speaker.affiliation.map((item) => (
                          <p
                            key={item}
                            className="mt-2 flex gap-2 text-sm font-medium leading-6 text-blue-700"
                          >
                            <Building2
                              className="mt-0.5 h-4 w-4 shrink-0"
                              aria-hidden
                            />
                            <span>{item}</span>
                          </p>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
