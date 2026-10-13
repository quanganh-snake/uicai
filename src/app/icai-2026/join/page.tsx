import { PageHeader } from "@/components/layout/PageHeader";
import { CONFERENCE_INFO } from "@/data/conference";
import { ArrowUpRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function SubmissionPage() {
  return (
    <div>
      <PageHeader
        title="Submission"
        description="Registration information, deadlines, and Microsoft CMT submission guidelines for ICAI-2026."
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-12">
        {/* Status Banner */}
        <div className="max-w-4xl rounded-2xl border border-blue-200 bg-gradient-to-r from-blue-50/80 to-indigo-50/60 p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="space-y-1">
            <span className="inline-block rounded-md bg-blue-100 px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider text-[#3124eb]">
              Registration Open
            </span>
            <h2 className="text-2xl font-bold text-slate-900">
              Submit Your Paper on Microsoft CMT
            </h2>
            <p className="text-sm font-semibold text-slate-700">
              Submission Deadline: October 31, 2026
            </p>
          </div>
          <Button
            asChild
            size="lg"
            className="bg-[#3124eb] hover:bg-[#2518cf] text-white font-semibold shrink-0 h-11 px-6 shadow-md"
          >
            <a href={CONFERENCE_INFO.cmtUrl} target="_blank" rel="noopener noreferrer">
              Submit Now
              <ArrowUpRight className="ml-1.5 h-4 w-4" />
            </a>
          </Button>
        </div>

        {/* Guidelines */}
        <div className="max-w-4xl space-y-8">
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">
            Submission Guidelines
          </h2>
          <p className="text-base text-slate-700 leading-relaxed">
            All papers for ICAI-2026 must be submitted electronically through the Microsoft Conference Management Toolkit (CMT) platform.
          </p>

          <div className="space-y-6">
            <div className="rounded-xl border border-slate-200 bg-white p-6 space-y-3">
              <h3 className="text-lg font-bold text-slate-900">1. Submission Platform</h3>
              <p className="text-sm text-slate-700 leading-relaxed">
                Authors are required to create a CMT account and submit manuscripts via the official ICAI-2026 CMT link:
              </p>
              <a
                href={CONFERENCE_INFO.cmtUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 font-semibold text-[#3124eb] hover:underline text-sm"
              >
                CMT Submission Link
                <ArrowUpRight className="h-4 w-4" />
              </a>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-6 space-y-3">
              <h3 className="text-lg font-bold text-slate-900">2. Before Submission Checklist</h3>
              <ul className="space-y-2 text-sm text-slate-700">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-[#3124eb] shrink-0 mt-0.5" />
                  <span>Prepare manuscript according to official ICAI-2026 templates (IEEE style).</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-[#3124eb] shrink-0 mt-0.5" />
                  <span>Verify all authors&apos; names, affiliations, email addresses, and countries/regions.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-[#3124eb] shrink-0 mt-0.5" />
                  <span>Ensure author info in CMT exactly matches the manuscript text.</span>
                </li>
              </ul>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-6 space-y-3">
              <h3 className="text-lg font-bold text-slate-900">3. Manuscript Requirements</h3>
              <p className="text-sm text-slate-700 leading-relaxed">
                <strong>Format:</strong> Word, PDF, LaTeX.<br />
                <strong>Page Limit:</strong> Up to 8 pages including figures, tables, and references.
              </p>
              <div className="pt-2">
                <Button asChild variant="outline" size="sm" className="border-slate-300">
                  <Link href="/icai-2026/authors">View Templates</Link>
                </Button>
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-6 space-y-3">
              <h3 className="text-lg font-bold text-slate-900">4. Contact & Support</h3>
              <p className="text-sm text-slate-700 leading-relaxed">
                Questions regarding deadlines or submission options: contact the Organizing Committee at{" "}
                <a href={`mailto:${CONFERENCE_INFO.contactEmail}`} className="text-[#3124eb] font-semibold underline">
                  {CONFERENCE_INFO.contactEmail}
                </a>.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
