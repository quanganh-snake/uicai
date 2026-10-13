import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SPEAKERS } from "@/data/conference";

export function CommitteeSection() {
  return (
    <section className="border-t border-slate-200/80 bg-slate-50/50 py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-12">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Badge
                variant="secondary"
                className="bg-blue-100 text-[#3124eb] font-semibold text-xs px-2.5 py-0.5"
              >
                {SPEAKERS.length} Active members
              </Badge>
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl lg:text-4xl">
              Keynote speakers and Organizing committee
            </h2>
          </div>
          <Button
            asChild
            variant="outline"
            className="self-start md:self-auto border-slate-300 hover:bg-white text-slate-800"
          >
            <Link href="/icai-2026/committees">
              Meet the full committee
              <ArrowRight className="ml-1.5 h-4 w-4" />
            </Link>
          </Button>
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
    </section>
  );
}
