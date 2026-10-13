import { GraduationCap, Factory, Presentation } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CONFERENCE_INFO } from "@/data/conference";

export function ScopeSection() {
  return (
    <section
      id="conference-objectives"
      className="scroll-mt-24 border-t border-slate-200/80 bg-slate-50/70 py-16 sm:py-24"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-wider text-[#3124eb]">
            Scientific Scope
          </p>
          <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl lg:text-4xl">
            Conference objectives and research tracks
          </h2>
          <p className="mt-4 text-base sm:text-lg leading-relaxed text-slate-700">
            {CONFERENCE_INFO.description}
          </p>
        </div>

        {/* Tracks Grid */}
        <div className="mt-12 space-y-10">
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-4">
              Themes / Parallel Sessions and Research Topics
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs hover:border-blue-200 transition">
                <div className="h-9 w-9 rounded-lg bg-blue-50 text-[#3124eb] flex items-center justify-center font-bold text-xs mb-3">
                  01
                </div>
                <h4 className="text-base font-bold text-slate-900 mb-2">
                  Economics & Business Administration
                </h4>
                <p className="text-xs text-slate-500 mb-3">
                  Digital economy, AI transformation, Fintech, marketing, and governance.
                </p>
              </div>

              <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs hover:border-blue-200 transition">
                <div className="h-9 w-9 rounded-lg bg-blue-50 text-[#3124eb] flex items-center justify-center font-bold text-xs mb-3">
                  02
                </div>
                <h4 className="text-base font-bold text-slate-900 mb-2">
                  Information Technology and Communications
                </h4>
                <p className="text-xs text-slate-500 mb-3">
                  Deep learning, neural networks, data science, NLP, and intelligent software.
                </p>
              </div>

              <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs hover:border-blue-200 transition">
                <div className="h-9 w-9 rounded-lg bg-blue-50 text-[#3124eb] flex items-center justify-center font-bold text-xs mb-3">
                  03
                </div>
                <h4 className="text-base font-bold text-slate-900 mb-2">
                  Microelectronics and Telecommunications
                </h4>
                <p className="text-xs text-slate-500 mb-3">
                  Chip design, IoT & AIoT devices, next-gen networking, and telecommunications.
                </p>
              </div>
            </div>
          </div>

          {/* Special Sessions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="rounded-xl border border-blue-200/80 bg-blue-50/40 p-5">
              <div className="flex items-center gap-3 mb-2">
                <GraduationCap className="h-5 w-5 text-[#3124eb]" />
                <h4 className="font-bold text-sm text-slate-900">AI for Education</h4>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Invited talks on AI in higher education, curriculum design, learning analytics, and university transformation.
              </p>
            </div>

            <div className="rounded-xl border border-blue-200/80 bg-blue-50/40 p-5">
              <div className="flex items-center gap-3 mb-2">
                <Factory className="h-5 w-5 text-[#3124eb]" />
                <h4 className="font-bold text-sm text-slate-900">AI for Industry</h4>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Smart manufacturing, industrial automation, predictive maintenance, logistics, and digital twins.
              </p>
            </div>

            <div className="rounded-xl border border-blue-200/80 bg-blue-50/40 p-5">
              <div className="flex items-center gap-3 mb-2">
                <Presentation className="h-5 w-5 text-[#3124eb]" />
                <h4 className="font-bold text-sm text-slate-900">AI Technology Exhibition</h4>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Showcase practical AI technologies, enterprise demos, and prototypes connecting industry and academia.
              </p>
            </div>
          </div>

          <div className="text-center pt-2">
            <Button asChild variant="outline" className="border-slate-300">
              <Link href="/icai-2026/sessions">
                View all session details & topics
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
