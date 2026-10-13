import Link from "next/link";
import { ArrowLeft, Calendar, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/layout/PageHeader";

export default function CallForPapersPage() {
  return (
    <div>
      <PageHeader
        title="News"
        description="Call for Papers: ICAI-FAI 2026"
      />

      <div className="py-12 sm:py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 space-y-8">
          <div>
            <Button asChild variant="ghost" size="sm" className="mb-4 text-slate-600 hover:text-slate-900 -ml-2">
              <Link href="/icai-2026/news">
                <ArrowLeft className="mr-1.5 h-4 w-4" />
                Back to News
              </Link>
            </Button>

            <div className="flex items-center gap-2 text-xs font-semibold text-[#3124eb] mb-2">
              <Calendar className="h-3.5 w-3.5" />
              <span>June 1, 2026</span>
            </div>

            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
              Call for Papers: ICAI-FAI 2026
            </h1>
            <p className="mt-2 text-base font-semibold text-[#3124eb]">
              Theme: Frontier AI
            </p>
          </div>

          <div className="prose prose-slate max-w-none text-slate-700 leading-relaxed space-y-4">
            <p>
              ICAI-FAI 2026 is the second international conference on Artificial Intelligence in the annual conference series organized by CMC University, in collaboration with Steinbeis University - Schools of Next Practices, Germany, and Tsinghua University, Shenzhen International Graduate School (SIGS), China. The conference provides an international forum for researchers, scholars, practitioners, policymakers and industry experts to present and discuss recent advances, emerging trends, impacts and practical applications of frontier AI.
            </p>

            <h2 className="text-xl font-bold text-slate-900 pt-4">
              Themes / Parallel Sessions and Research Topics
            </h2>

            <div className="space-y-4 pt-2">
              <div>
                <h3 className="font-bold text-slate-900">1. Economics & Business Administration</h3>
                <p className="text-sm text-slate-600 mt-1">
                  Global Trends and Future of AI; Digital Economy, Digital and Green Growth; Digital & AI Transformation in Organizations; AI Applications across Healthcare, Manufacturing, Agriculture, Education; Fintech, HRM, Risk Management, Digital Marketing, and Governance.
                </p>
              </div>

              <div>
                <h3 className="font-bold text-slate-900">2. Information Technology and Communications</h3>
                <p className="text-sm text-slate-600 mt-1">
                  Deep Learning and Neural Networks; Machine Learning and Data Mining; Data Science; Natural Language Processing; and intelligent application systems.
                </p>
              </div>

              <div>
                <h3 className="font-bold text-slate-900">3. Microelectronics and Telecommunications</h3>
                <p className="text-sm text-slate-600 mt-1">
                  Microelectronics and Semiconductor Engineering; Networking; IC/Chip design; IoT, AIoT devices; and smart hardware.
                </p>
              </div>

              <div>
                <h3 className="font-bold text-slate-900">4. AI in Industry</h3>
                <p className="text-sm text-slate-600 mt-1">
                  Smart Manufacturing, Industrial Robotics, Predictive Maintenance, Supply Chain Optimization, Digital Twins, and Workflow Automation.
                </p>
              </div>

              <div>
                <h3 className="font-bold text-slate-900">5. AI for Education</h3>
                <p className="text-sm text-slate-600 mt-1">
                  AI-enhanced teaching and assessment; Intelligent tutoring systems; Learning analytics; Curriculum transformation; and responsible AI ethics.
                </p>
              </div>
            </div>

            <div className="pt-6">
              <Button asChild className="bg-[#3124eb] hover:bg-[#2518cf] text-white">
                <Link href="/icai-2026/authors">
                  View Submission & Formatting Details
                  <ArrowRight className="ml-1.5 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

