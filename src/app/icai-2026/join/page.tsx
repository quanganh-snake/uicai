import Link from "next/link";
import { PageHeader } from "@/components/layout/PageHeader";
import { CONFERENCE_INFO } from "@/data/conference";

const SUBMISSION_DEADLINE = "September 30, 2026";

const BEFORE_SUBMISSION = [
  <>
    Prepare the manuscript according to the{" "}
    <Link href="/icai-2026/authors">
      <b>ICAI-2026 paper templates</b>
    </Link>
    .
  </>,
  "Check that all authors' names, affiliations, email addresses, and countries/regions are correctly provided.",
  "Ensure that the author information entered in CMT exactly matches the information in the submitted manuscript.",
  "Ensure that the submission complies with the conference's requirements regarding originality and publication ethics.",
];

const CREATE_SUBMISSION_STEPS = [
  "Access the ICAI-2026 conference page.",
  <>
    Select “Create New Submission<b>”</b>.
  </>,
  "Enter the paper title.",
  "Enter the abstract.",
  "Add all co-authors and verify their information (please refer to section 4)",
  "Select the appropriate Subject Area and Secondary Subject Area (if any).",
  "Upload the manuscript file in the required format (please refer to section 5)",
  "Complete the required conflict-of-interest information.",
  <>
    Click <b>Submit</b> to finalize the submission.
  </>,
];

const AUTHOR_FIELDS = [
  "Full name",
  "Institutional affiliation",
  "Department/Faculty/Organization",
  "Country/Region",
  "Email address",
];

const IMPORTANT_NOTES = [
  "Each paper must be submitted through the official ICAI-2026 CMT system.",
  "Please do not submit the same manuscript multiple times unless specifically instructed by the Organizing Committee.",
  <>
    Authors should carefully verify all submission information before clicking{" "}
    <b>Submit</b>.
  </>,
  "Any changes to the author list or manuscript after submission will be subject to the conference's policies.",
  <>
    Questions concerning conference-specific deadlines, submission requirements, or
    missing submission options should be directed to the ICAI-2026 Organizing
    Committee (
    <a href={`mailto:${CONFERENCE_INFO.contactEmail}`}>{CONFERENCE_INFO.contactEmail}</a>
    ), rather than to CMT support.
  </>,
];

function IndentedItem({
  marker,
  children,
}: {
  marker: string;
  children: React.ReactNode;
}) {
  return (
    <p className="ml-[60.6pt] -indent-[18pt]">
      <span className="inline-block w-[18pt] indent-0 text-[10pt]">{marker}</span>
      {children}
    </p>
  );
}

export default function SubmissionPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <PageHeader title="Submission" />

      <section className="px-4 py-12 sm:py-16 lg:py-20">
        <div className="mx-auto w-full min-w-0 max-w-5xl">
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="bg-[linear-gradient(135deg,#0b1220_0%,#142b5d_52%,#1d4ed8_100%)] p-5 text-white sm:p-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-200">
                    Registration
                  </p>
                  <h2 className="mt-2 text-2xl font-bold text-white sm:text-3xl">Open</h2>
                </div>
                <a
                  href={CONFERENCE_INFO.cmtUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-[52px] w-full animate-pulse items-center justify-center rounded-full border border-orange-100/80 bg-gradient-to-r from-orange-500 via-amber-400 to-yellow-300 px-8 py-4 text-center text-base font-extrabold text-slate-950 shadow-[0_0_0_6px_rgba(251,146,60,0.18),0_18px_38px_rgba(249,115,22,0.7)] transition-all duration-300 hover:-translate-y-1 hover:scale-[1.03] hover:shadow-[0_0_0_8px_rgba(251,146,60,0.22),0_22px_44px_rgba(234,88,12,0.78)] focus:outline-none focus:ring-4 focus:ring-orange-300/80 sm:w-auto"
                >
                  Submit Now
                </a>
              </div>
            </div>

            <div className="p-5 sm:p-6">
              <p className="text-sm text-slate-600">Deadline: {SUBMISSION_DEADLINE}</p>
              <div className="prose prose-slate mt-6 max-w-none">
                <p className="text-center">
                  <b className="text-[14pt] leading-[115%]">Submission Guidelines</b>
                </p>
                <p>
                  All papers for the Second International Conference on Artificial
                  Intelligence: AI-Native for Universities and Industry (ICAI-2026) must be
                  submitted electronically through the Microsoft Conference Management
                  Toolkit (CMT) platform.
                </p>

                <p>
                  <b>1. Submission Platform</b>
                </p>
                <p>
                  Authors are required to create a CMT account and submit their manuscripts
                  through the official ICAI-2026 submission page:
                </p>
                <p>
                  <b>CMT Submission </b>
                  <a href={CONFERENCE_INFO.cmtUrl} target="_blank" rel="noopener noreferrer">
                    <b>Link</b>
                  </a>
                </p>
                <p>
                  Authors should use the conference-specific CMT link provided by the
                  Organizing Committee.
                </p>

                <p>
                  <b>2. Before Submission</b>
                </p>
                <p>Authors are requested to:</p>
                {BEFORE_SUBMISSION.map((item, index) => (
                  <IndentedItem key={index} marker="·">
                    {item}
                  </IndentedItem>
                ))}

                <p>
                  <b>3. Creating a Submission</b>
                </p>
                <p>After logging into CMT:</p>
                {CREATE_SUBMISSION_STEPS.map((item, index) => (
                  <IndentedItem key={index} marker={`${index + 1}.`}>
                    {item}
                  </IndentedItem>
                ))}
                <p>
                  Please note that uploaded files are not saved until the author clicks the{" "}
                  <b>Submit</b> button.
                </p>

                <p>
                  <b>4. Author Information</b>
                </p>
                <p>
                  The corresponding/primary contact author should ensure that the
                  information of all co-authors is complete and accurate.
                </p>
                <p>For each author, please provide:</p>
                <ul>
                  {AUTHOR_FIELDS.map((field) => (
                    <li key={field}>{field}</li>
                  ))}
                </ul>
                <p>
                  If a co-author does not yet have a CMT account, the author may initially
                  be added as a placeholder; however, the co-author should register the
                  relevant email address with CMT to ensure that they can receive
                  conference communications.
                </p>

                <p>
                  <b>5. Manuscript File</b>
                </p>
                <p>
                  The manuscript must be prepared using the official{" "}
                  <b>ICAI-2026 manuscript template</b> and submitted in the file format
                  specified by the Organizing Committee.
                </p>
                <p>
                  <b>Required format:</b> Word, PDF, Latex.
                </p>
                <p>
                  <b>Paper length requirement:</b> Manuscripts should not exceed 8 pages,
                  including tables, figures, notes, and references. Manuscripts exceeding
                  the maximum length may incur an additional charge and, in cases of
                  substantial excess, may be subject to rejection.
                </p>
                <p>
                  <b>Template: </b>
                  <Link href="/icai-2026/authors">
                    <b>ICAI-2026 paper templates</b>
                  </Link>
                </p>

                <p>
                  <b>6. Important Notes</b>
                </p>
                {IMPORTANT_NOTES.map((item, index) => (
                  <IndentedItem key={index} marker="·">
                    {item}
                  </IndentedItem>
                ))}
                <p className="ml-[60.6pt]">
                  For technical instructions on using CMT, please refer to the official CMT
                  Author Submission Guide.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
