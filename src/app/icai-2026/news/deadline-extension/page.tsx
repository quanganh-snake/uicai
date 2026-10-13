import Link from "next/link";
import { ArrowLeft, Calendar, ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function DeadlineExtensionPage() {
  return (
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
            <span>October 1, 2026</span>
          </div>

          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            ICAI-2026 Deadline Extension
          </h1>
          <p className="mt-2 text-base text-slate-600">
            Extension of Paper Submission Deadline – ICAI-2026
          </p>
        </div>

        <div className="prose prose-slate max-w-none text-slate-700 leading-relaxed space-y-5">
          <p>
            We are pleased to inform you that the submission deadline for <strong>the Second International Conference on AI: AI-Native for Universities and Industry (ICAI-2026)</strong> has been extended to <strong>October 31, 2026</strong>.
          </p>

          <p>
            This extension provides authors with additional time to complete and polish their manuscripts for submission. We warmly invite researchers, academics, and professionals to submit their papers and join us for this exciting event, which will take place on <strong>December 3, 2026</strong> in <strong>Hanoi, Vietnam</strong>.
          </p>

          <div className="rounded-xl border border-slate-200 bg-slate-50 p-6 space-y-3">
            <h2 className="text-lg font-bold text-slate-900">Updated Key Dates:</h2>
            <ul className="space-y-2 text-sm text-slate-700">
              <li className="flex items-center gap-2 font-medium">
                <CheckCircle2 className="h-4 w-4 text-[#3124eb]" />
                <span>New Submission Deadline: <strong>October 31, 2026</strong></span>
              </li>
              <li className="flex items-center gap-2 font-medium">
                <CheckCircle2 className="h-4 w-4 text-[#3124eb]" />
                <span>Notification of Acceptance: <strong>November 10, 2026</strong></span>
              </li>
              <li className="flex items-center gap-2 font-medium">
                <CheckCircle2 className="h-4 w-4 text-[#3124eb]" />
                <span>Camera-ready Submission: <strong>November 20, 2026</strong></span>
              </li>
            </ul>
          </div>

          <p>
            We look forward to your valuable contributions!
          </p>
          <p className="font-semibold text-slate-900">
            Organizing Committee – ICAI-2026
          </p>

          <div className="pt-4 flex gap-4">
            <Button asChild className="bg-[#3124eb] hover:bg-[#2518cf] text-white">
              <Link href="/icai-2026/join">
                Submit Paper Now
                <ArrowRight className="ml-1.5 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/icai-2026/dates">
                View All Dates
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
