import { PageHeader } from "@/components/layout/PageHeader";
import { SPEAKERS } from "@/data/conference";
import Image from "next/image";
import { Building2 } from "lucide-react";

export default function CommitteesPage() {
  return (
    <div>
      <PageHeader
        title="Committees"
        description="Organizing, program, and scientific committee members for The 2nd International Conference on AI: AI-Native for Universities and Industry."
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="mb-10">
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Keynote Speakers and Organizing Committee
          </h2>
          <p className="mt-2 text-sm sm:text-base text-slate-600">
            Distinguished leaders and scholars guiding the strategic direction and academic rigor of ICAI-2026.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {SPEAKERS.map((member) => (
            <article
              key={member.id}
              className="group flex min-w-0 flex-col overflow-hidden rounded-lg border border-slate-200 bg-slate-50 transition hover:-translate-y-0.5 hover:border-blue-200 hover:bg-white hover:shadow-lg"
            >
              <div
                className="relative flex aspect-[4/3] w-full items-center justify-center overflow-hidden text-4xl font-semibold text-white"
                style={{
                  background: "linear-gradient(145deg, #3124eb, #14b8a6)",
                }}
              >
                <Image
                  src={member.avatar}
                  alt={member.name}
                  width={640}
                  height={480}
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  sizes="(min-width: 1280px) 25vw, (min-width: 640px) 50vw, 100vw"
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
                  {member.affiliation.map((item, index) => (
                    <li key={index} className="flex gap-2">
                      <Building2 className="mt-1 h-4 w-4 shrink-0 text-slate-400" />
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
  );
}
