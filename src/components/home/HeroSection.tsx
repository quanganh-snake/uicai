import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  CalendarDays,
  MapPin,
  BookMarked,
  Globe2,
  Sparkles,
} from "lucide-react";
import { CONFERENCE_INFO } from "@/data/conference";

export function HeroSection() {
  return (
    <section className="relative isolate flex min-h-[calc(100svh-4rem)] overflow-hidden bg-slate-950 px-4 py-12 text-white sm:min-h-[calc(100svh-5rem)] sm:px-6 sm:py-16 lg:px-8 items-stretch w-full">
      <div className="absolute inset-0 -z-20">
        <Image
          src="/images/banner.png"
          alt="AI-Native for Universities conference banner"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div
          className="absolute inset-0"
          style={{
            backgroundColor: "#044182",
            opacity: 0.65,
            mixBlendMode: "multiply",
          }}
        />
        <div className="absolute inset-0 bg-slate-950/40" />
      </div>

      <div className="absolute inset-0 -z-10 opacity-[0.18] [background-image:linear-gradient(rgba(255,255,255,0.18)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.18)_1px,transparent_1px)] [background-size:44px_44px]" />

      <div className="mx-auto grid w-full max-w-7xl gap-10 lg:grid-cols-[minmax(0,1fr)_23rem] my-auto relative z-10">
        <div className="max-w-4xl lg:order-1 lg:self-start">
          <div className="mb-6 flex flex-wrap items-center gap-3 text-xs font-semibold uppercase tracking-[0.18em] text-[#f2f7f7]">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 backdrop-blur">
              <Sparkles className="h-4 w-4" />
              {CONFERENCE_INFO.badgeSubtitle}
            </span>
            <span>{CONFERENCE_INFO.editionBadge}</span>
          </div>

          <h1 className="max-w-5xl leading-[1.08] tracking-normal text-3xl sm:text-5xl lg:text-6xl font-semibold text-white drop-shadow-md">
            {CONFERENCE_INFO.name}
          </h1>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/icai-2026/authors"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md px-6 text-sm font-semibold text-white shadow-lg transition hover:-translate-y-0.5 hover:shadow-xl bg-[#3124eb] hover:bg-[#2518cf]"
            >
              Submit a Paper
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="#conference-objectives"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md border border-white/80 bg-white px-6 text-sm font-semibold text-slate-950 shadow-lg transition hover:-translate-y-0.5 hover:bg-slate-100 hover:shadow-xl"
            >
              Explore Topics
              <BookOpen className="h-4 w-4" />
            </Link>
          </div>
        </div>

        <div className="grid gap-3 rounded-xl p-4 border border-white/15 bg-white/10 shadow-2xl backdrop-blur-md lg:order-2 lg:self-center">
          <div className="grid grid-cols-[2.5rem_minmax(0,1fr)] gap-3 rounded-md border border-white/10 bg-slate-950/40 p-3 text-left">
            <div className="flex h-10 w-10 items-center justify-center rounded-md bg-white text-slate-950">
              <CalendarDays className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-300">
                Date
              </p>
              <p className="mt-0.5 text-sm font-semibold leading-6 text-white">
                {CONFERENCE_INFO.date}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-[2.5rem_minmax(0,1fr)] gap-3 rounded-md border border-white/10 bg-slate-950/40 p-3 text-left">
            <div className="flex h-10 w-10 items-center justify-center rounded-md bg-white text-slate-950">
              <MapPin className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-300">
                Venue
              </p>
              <p className="mt-0.5 text-sm font-semibold leading-6 text-white">
                {CONFERENCE_INFO.venue}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-[2.5rem_minmax(0,1fr)] gap-3 rounded-md border border-white/10 bg-slate-950/40 p-3 text-left">
            <div className="flex h-10 w-10 items-center justify-center rounded-md bg-white text-slate-950">
              <BookMarked className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-300">
                Publication
              </p>
              <p className="mt-0.5 text-sm font-semibold leading-6 text-white">
                {CONFERENCE_INFO.publication}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-[2.5rem_minmax(0,1fr)] gap-3 rounded-md border border-white/10 bg-slate-950/40 p-3 text-left">
            <div className="flex h-10 w-10 items-center justify-center rounded-md bg-white text-slate-950">
              <Globe2 className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-300">
                International forum
              </p>
              <p className="mt-0.5 text-sm font-semibold leading-6 text-white">
                {CONFERENCE_INFO.forumType}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

