import Image from "next/image";
import { PageHeader } from "@/components/layout/PageHeader";
import { CONFERENCE_INFO } from "@/data/conference";

const SUBMISSION_DEADLINE = "December 30, 2026";

const BEFORE_SUBMISSION = [
  "Prepare their manuscripts in English using the official AIESI 2027 paper template.",
  "Verify the accuracy of the paper title, author information, and institutional affiliations.",
  "Ensure that their research aligns with the conference themes.",
  "Review their manuscripts for completeness and consistency with the template.",
];

const CREATE_SUBMISSION_STEPS = [
  "Prepare the manuscript according to the conference template.",
  "Compose an email with the paper title in the subject line.",
  "Attach the completed manuscript.",
  "Send the email to the official submission address.",
];

const AUTHOR_FIELDS = [
  "Full name",
  "Institutional affiliation",
  "Department/Faculty/Organization",
  "Country/Region",
  "Email address",
];

const IMPORTANT_NOTES = [
  "All submissions will be peer-reviewed.",
  "Notification of acceptance: February 28, 2027.",
  "Camera-ready submission deadline: March 30, 2027.",
  "Selected papers will be published in the conference proceedings with an ISBN.",
  <>
    For inquiries regarding paper submissions, please contact{" "}
    <a href={`mailto:${CONFERENCE_INFO.contactEmail}`}>{CONFERENCE_INFO.contactEmail}</a>.
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
                    Submission
                  </p>
                  <h2 className="mt-2 text-2xl font-bold text-white sm:text-3xl">Open</h2>
                </div>
                <a
                  href={`mailto:${CONFERENCE_INFO.contactEmail}`}
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
                  All papers for the International Conference on Artificial Intelligence,
                  Engineering and Sustainable Innovation (AIESI 2027) must be submitted
                  electronically via email.
                </p>
                <p>
                  The conference welcomes original, unpublished research papers, review
                  papers, and application-oriented studies related to its research areas.
                </p>

                <p>
                  <b>Submission Method</b>
                </p>
                <p>
                  Authors should submit their full papers to the official conference email
                  address:
                </p>
                <p>
                  <a href={`mailto:${CONFERENCE_INFO.contactEmail}`}>
                    <b>{CONFERENCE_INFO.contactEmail}</b>
                  </a>
                </p>

                <p>
                  <b>Before Submission</b>
                </p>
                <p>Authors are encouraged to:</p>
                {BEFORE_SUBMISSION.map((item, index) => (
                  <IndentedItem key={index} marker="·">
                    {item}
                  </IndentedItem>
                ))}

                <p>
                  <b>Creating a Submission</b>
                </p>
                <p>To submit a paper to AIESI 2027:</p>
                {CREATE_SUBMISSION_STEPS.map((item, index) => (
                  <IndentedItem key={index} marker={`${index + 1}.`}>
                    {item}
                  </IndentedItem>
                ))}
                <p>
                  Authors are encouraged to retain a copy of their submission email for
                  reference.
                </p>

                <p>
                  <b>Author Information</b>
                </p>
                <p>
                  The corresponding author should ensure that the following information is
                  accurate:
                </p>
                <ul>
                  {AUTHOR_FIELDS.map((field) => (
                    <li key={field}>{field}</li>
                  ))}
                </ul>

                <p>
                  <b>Manuscript File</b>
                </p>
                <p>
                  Manuscripts should be prepared using the official AIESI 2027 paper
                  template.
                </p>
                <p>
                  <b>Language:</b> English
                </p>
                <p>
                  <b>Paper Template:</b>
                </p>
                <div className="relative mx-auto aspect-square h-[320px] max-w-full overflow-hidden rounded-lg bg-slate-900">
                  <Image
                    src="/qr_scan_aiesi2027.jpg"
                    alt="Scan QR code for the official AIESI 2027 paper template"
                    width={320}
                    height={320}
                    className="!m-0 h-full w-full rounded-lg border-8 border-slate-800 object-cover"
                    sizes="320px"
                  />
                </div>
                <p className="text-center">
                  <i>
                    Scan the QR code to access the official paper template and related
                    documents.
                  </i>
                </p>

                <p>
                  <b>Important Notes</b>
                </p>
                {IMPORTANT_NOTES.map((item, index) => (
                  <IndentedItem key={index} marker="·">
                    {item}
                  </IndentedItem>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
