import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Building2, Users } from "lucide-react";
import { SPEAKERS } from "@/data/conference";

export function CommitteeSection() {
  return (
    <section
      id="committee"
      className="bg-white px-4 py-16 sm:px-6 sm:py-20 lg:px-8"
    >
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-8 lg:grid-cols-[19rem_minmax(0,1fr)] lg:gap-10">
          <div className="relative overflow-hidden rounded-lg bg-slate-950 p-7 text-white lg:sticky lg:top-28 lg:self-start">
            <div className="absolute inset-0 opacity-[0.14] [background-image:linear-gradient(rgba(255,255,255,0.26)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.26)_1px,transparent_1px)] [background-size:30px_30px]" />
            <div className="relative">
              <div className="flex h-12 w-12 items-center justify-center rounded-md bg-white text-slate-950">
                <Users className="h-6 w-6" aria-hidden />
              </div>
              <h2 className="mt-3 text-3xl font-semibold leading-tight">
                Keynote speakers and Organizing committee
              </h2>
              <div className="mt-7 grid grid-cols-2 gap-3">
                <div className="rounded-md border border-white/10 bg-white/10 p-3">
                  <p className="text-2xl font-semibold">{SPEAKERS.length}</p>
                  <p className="mt-1 text-xs text-slate-300">Active members</p>
                </div>
              </div>
              <Link
                href="/icai-2026/committees"
                className="mt-7 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-md bg-white px-4 text-sm font-semibold text-slate-950 transition hover:bg-cyan-50"
              >
                Meet the full committee
                <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {SPEAKERS.map((member) => (
              <article
                key={member.id}
                className="group flex min-w-0 flex-col overflow-hidden rounded-lg border border-slate-200 bg-slate-50 transition hover:-translate-y-0.5 hover:border-blue-200 hover:bg-white hover:shadow-lg"
              >
                <div
                  className="flex aspect-[4/3] w-full items-center justify-center overflow-hidden text-4xl font-semibold text-white"
                  style={{ background: "linear-gradient(145deg, #3124eb, #14b8a6)" }}
                >
                  <Image
                    src={member.avatar}
                    alt={member.name}
                    width={640}
                    height={480}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    sizes="(min-width: 1280px) 20vw, (min-width: 640px) 50vw, 100vw"
                  />
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.12em] text-blue-700">
                    Keynote Speakers and Organizing Committee
                  </p>
                  <h3 className="mt-2 [overflow-wrap:anywhere] text-xl font-semibold leading-7 text-slate-950">
                    {member.name}
                  </h3>
                  <ul className="mt-4 space-y-2 text-sm leading-6 text-slate-600">
                    {member.affiliation.map((item) => (
                      <li key={item} className="flex gap-2">
                        <Building2
                          className="mt-1 h-4 w-4 shrink-0 text-slate-400"
                          aria-hidden
                        />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
