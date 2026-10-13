import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Calendar, MapPin, BookOpen, Globe2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CONFERENCE_INFO } from "@/data/conference";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-blue-50/50 via-white to-white pt-8 pb-16 sm:pt-12 sm:pb-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Banner image */}
        <div className="relative mb-10 overflow-hidden rounded-2xl border border-slate-200/80 shadow-md">
          <div className="relative aspect-[21/9] w-full min-h-[220px] sm:min-h-[340px] md:min-h-[420px]">
            <Image
              src="/images/banner.png"
              alt="AI-Native for Universities conference banner"
              fill
              priority
              className="object-cover"
              sizes="(min-width: 1280px) 1280px, 100vw"
            />
          </div>
        </div>

        {/* Hero Headings */}
        <div className="mx-auto max-w-4xl text-center space-y-6">
          <div className="flex flex-wrap items-center justify-center gap-2">
            <Badge
              variant="outline"
              className="border-blue-600/30 bg-blue-50/80 text-[#3124eb] font-semibold px-3 py-1 text-xs sm:text-sm tracking-wide"
            >
              {CONFERENCE_INFO.badgeSubtitle}
            </Badge>
            <Badge
              variant="secondary"
              className="bg-slate-100 text-slate-800 font-medium px-3 py-1 text-xs sm:text-sm"
            >
              {CONFERENCE_INFO.editionBadge}
            </Badge>
          </div>

          <h1 className="text-3xl font-extrabold tracking-tight text-slate-950 sm:text-5xl lg:text-6xl leading-[1.15]">
            {CONFERENCE_INFO.name}
          </h1>

          <p className="text-base sm:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Connecting cutting-edge artificial intelligence research with education, university transformation, and industrial innovation.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Button
              asChild
              size="lg"
              className="bg-[#3124eb] hover:bg-[#2518cf] text-white font-semibold text-sm sm:text-base px-6 h-12 rounded-md shadow-md hover:shadow-lg transition-all"
            >
              <Link href="/icai-2026/authors">
                Submit a Paper
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-slate-300 bg-white hover:bg-slate-50 text-slate-900 font-semibold text-sm sm:text-base px-6 h-12 rounded-md shadow-xs"
            >
              <Link href="#conference-objectives">Explore Topics</Link>
            </Button>
          </div>
        </div>

        {/* Quick Info Grid */}
        <div className="mt-14 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="flex items-start gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-xs transition hover:border-blue-200 hover:shadow-sm">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-[#3124eb]">
              <Calendar className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Conference Date
              </p>
              <p className="mt-1 text-base font-bold text-slate-900">
                {CONFERENCE_INFO.date}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-xs transition hover:border-blue-200 hover:shadow-sm">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-[#3124eb]">
              <MapPin className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Host City / Venue
              </p>
              <p className="mt-1 text-base font-bold text-slate-900">
                {CONFERENCE_INFO.venue}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-xs transition hover:border-blue-200 hover:shadow-sm">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-[#3124eb]">
              <BookOpen className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Publication
              </p>
              <p className="mt-1 text-base font-bold text-slate-900">
                {CONFERENCE_INFO.publication}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-xs transition hover:border-blue-200 hover:shadow-sm">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-[#3124eb]">
              <Globe2 className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                International Forum
              </p>
              <p className="mt-1 text-base font-bold text-slate-900">
                {CONFERENCE_INFO.forumType}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
