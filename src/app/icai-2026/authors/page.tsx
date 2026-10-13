import { PageHeader } from "@/components/layout/PageHeader";
import { TEMPLATES, CONFERENCE_INFO } from "@/data/conference";
import { FileText, Download, Mail, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AuthorsPage() {
  return (
    <div>
      <PageHeader
        title="Authors"
        description="Guidelines, paper formatting templates, and submission instructions for authors preparing manuscripts for ICAI-2026."
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-12">
        <div className="max-w-4xl space-y-4">
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">
            Submission Information
          </h2>
          <p className="text-base leading-relaxed text-slate-700">
            Authors are invited to submit original, unpublished research papers, review papers and application-oriented studies related to the conference themes and parallel sessions. Submitted papers will be reviewed by the Technical Program Committee.
          </p>
          <div className="flex flex-wrap items-center gap-6 pt-2 text-sm text-slate-600">
            <div>
              <span className="font-semibold text-slate-800">Website: </span>
              <a href={CONFERENCE_INFO.websiteUrl} className="text-[#3124eb] hover:underline">
                {CONFERENCE_INFO.websiteUrl}
              </a>
            </div>
            <div>
              <span className="font-semibold text-slate-800">Email: </span>
              <a href={`mailto:${CONFERENCE_INFO.contactEmail}`} className="text-[#3124eb] hover:underline inline-flex items-center gap-1">
                <Mail className="h-3.5 w-3.5" />
                {CONFERENCE_INFO.contactEmail}
              </a>
            </div>
          </div>
        </div>

        <div className="max-w-4xl space-y-6">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-slate-900">
              ICAI-FAI 2026 Paper Templates
            </h2>
            <p className="mt-2 text-base leading-relaxed text-slate-700">
              To ensure a consistent format for all submitted and accepted papers, authors are required to prepare manuscripts using the official ICAI-FAI 2026 conference templates referencing IEEE style.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
            {TEMPLATES.map((tmpl) => (
              <div
                key={tmpl.name}
                className="flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-6 shadow-xs hover:border-blue-200 transition"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-[#3124eb]">
                      <FileText className="h-5 w-5" />
                    </div>
                    <span className="rounded bg-slate-100 px-2 py-0.5 text-xs font-mono font-semibold text-slate-700">
                      {tmpl.fileType}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900">{tmpl.name}</h3>
                  <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {tmpl.desc}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 space-y-2">
                  <Button asChild size="sm" className="w-full bg-[#3124eb] hover:bg-[#2518cf] text-white">
                    <a href={tmpl.url} target="_blank" rel="noopener noreferrer">
                      <Download className="mr-1.5 h-3.5 w-3.5" />
                      Download
                    </a>
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <div className="rounded-xl border border-slate-200 bg-slate-50 p-6 space-y-3">
            <h3 className="font-bold text-slate-900 text-base">
              Manuscript Page Limit & Formatting Rules
            </h3>
            <ul className="space-y-2 text-sm text-slate-700">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-[#3124eb] shrink-0 mt-0.5" />
                <span>Manuscripts should not exceed <strong>8 pages</strong>, including tables, figures, and references.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-[#3124eb] shrink-0 mt-0.5" />
                <span>Authors should not modify margins, font sizes, or column layouts of the templates.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-[#3124eb] shrink-0 mt-0.5" />
                <span>Remove all instructional placeholder text before final submission.</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="max-w-4xl rounded-xl border border-blue-100 bg-blue-50/50 p-6">
          <h3 className="text-base font-bold text-slate-900 mb-2">Acknowledgement</h3>
          <p className="text-xs sm:text-sm leading-relaxed text-slate-700">
            The Microsoft CMT service was used for managing the peer-reviewing process for this conference. This service was provided for free by Microsoft and they bore all expenses, including costs for Azure cloud services as well as for software development and support.
          </p>
        </div>
      </div>
    </div>
  );
}
