import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  CalendarDays,
  MapPin,
  Sparkles,
} from "lucide-react";
import { CONFERENCE_INFO } from "@/data/conference";

const HERO_FACTS = [
  { label: "Date", value: CONFERENCE_INFO.date, icon: CalendarDays },
  { label: "Venue", value: CONFERENCE_INFO.venue, icon: MapPin },
];

export function HeroSection() {
  return (
    <section className="relative isolate flex min-h-[calc(100svh-4rem)] items-stretch overflow-hidden bg-slate-950 px-4 py-14 text-white sm:min-h-[calc(100svh-5rem)] sm:px-6 sm:py-16 lg:px-8">
      <div className="absolute inset-0 -z-20">
        <Image
          src="/images/banner_uneti.png"
          alt="AI-Native for Universities conference banner"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div
          className="absolute inset-0"
          style={{ backgroundColor: "#e9f782", opacity: 0.04 }}
        />
      </div>
      <div className="absolute inset-0 -z-10 opacity-[0.18] [background-image:linear-gradient(rgba(255,255,255,0.18)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.18)_1px,transparent_1px)] [background-size:44px_44px]" />

      <div className="mx-auto grid w-full max-w-7xl gap-10 lg:grid-cols-[minmax(0,1fr)_23rem]">
        <div className="max-w-4xl lg:order-1 lg:self-start">
          <div className="mb-6 flex flex-wrap items-center gap-3 text-xs font-semibold uppercase tracking-[0.18em] text-[#f2f7f7]">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 backdrop-blur">
              <Sparkles className="h-4 w-4" aria-hidden />
              {CONFERENCE_INFO.badgeSubtitle}
            </span>
            <span>{CONFERENCE_INFO.editionBadge}</span>
          </div>
          <h1 className="max-w-5xl text-4xl leading-[1.05] font-semibold tracking-normal text-white sm:text-5xl lg:text-6xl">
            {CONFERENCE_INFO.name}
          </h1>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/icai-2026/authors"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md bg-[#3124eb] px-5 text-sm font-semibold text-white shadow-lg transition hover:-translate-y-0.5 hover:shadow-xl"
            >
              Submit a Paper
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
            <Link
              href="#conference-objectives"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md border border-white/80 bg-white px-5 text-sm font-semibold text-slate-950 shadow-lg transition hover:-translate-y-0.5 hover:bg-slate-100 hover:shadow-xl"
            >
              Explore Topics
              <BookOpen className="h-4 w-4" aria-hidden />
            </Link>
          </div>
        </div>

        <div className="grid gap-3 rounded-lg border border-white/15 bg-white/10 p-4 shadow-2xl backdrop-blur-md lg:order-2 lg:self-center">
          {HERO_FACTS.map(({ label, value, icon: Icon }) => (
            <div
              key={label}
              className="grid grid-cols-[2.5rem_minmax(0,1fr)] gap-3 rounded-md border border-white/10 bg-slate-950/30 p-3 text-left"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-md bg-white text-slate-950">
                <Icon className="h-5 w-5" aria-hidden />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                  {label}
                </p>
                <p className="mt-1 text-sm font-semibold leading-6 text-white">
                  {value}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
