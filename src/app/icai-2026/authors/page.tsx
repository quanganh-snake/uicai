import { PageHeader } from "@/components/layout/PageHeader";
import { CONFERENCE_INFO, TEMPLATES } from "@/data/conference";

const IEEE_TEMPLATES_URL = "https://www.ieee.org/conferences/publishing/templates";

const [wordTemplate, latexTemplate, overleafTemplate] = TEMPLATES;

function ExternalLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  );
}

export default function AuthorsPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <PageHeader title="Authors" />

      <section className="px-4 py-12 sm:py-16 lg:py-20">
        <div className="mx-auto w-full min-w-0 max-w-5xl">
          <div className="prose prose-slate max-w-none prose-headings:font-bold prose-a:transition-colors hover:prose-a:text-blue-600 sm:prose-lg">
            <h2>Submission Information</h2>
            <p>
              Authors are invited to submit original, unpublished research papers,
              review papers and application-oriented studies related to the conference
              themes and parallel sessions. Submitted papers will be reviewed by the
              Technical Program Committee.
            </p>
            <p>
              Conference website:{" "}
              <ExternalLink href={CONFERENCE_INFO.websiteUrl}>
                {CONFERENCE_INFO.websiteUrl}
              </ExternalLink>
            </p>
            <p>
              Contact email:{"\u00a0"}
              <a
                href={`mailto:${CONFERENCE_INFO.contactEmail}`}
                className="text-[12pt]"
                style={{ fontFamily: "Aptos, sans-serif" }}
              >
                {CONFERENCE_INFO.contactEmail}
              </a>
            </p>

            <h2>ICAI-FAI 2026 Paper Templates</h2>
            <p>
              <span className="text-[1rem]">
                To ensure a consistent format for all submitted and accepted papers,
                authors are required to prepare their manuscripts using the official
                ICAI-FAI 2026 conference templates. The templates are prepared with
                reference to the IEEE conference paper style and provide predefined
                formatting for the paper title, author information, abstract, keywords,
                section headings, figures, tables, references, and page layout.
              </span>
            </p>
            <p>
              <span className="text-[1.5em] font-bold text-slate-900">
                ICAI-FAI 2026 provides three template options for authors:
              </span>
            </p>
            <ol>
              <li>
                <span className="text-[1rem]">
                  {wordTemplate.name}: {wordTemplate.desc}:{"\u00a0"}
                </span>
                <span className="text-[1rem]">
                  <ExternalLink href={wordTemplate.url}>{wordTemplate.linkLabel}</ExternalLink>
                </span>
              </li>
              <li>
                {latexTemplate.name}: {latexTemplate.desc}:{"\u00a0"}
                <ExternalLink href={latexTemplate.url}>{latexTemplate.linkLabel}</ExternalLink>
                ;{"\u00a0"}
                <ExternalLink href={latexTemplate.extra.url}>
                  {latexTemplate.extra.name}
                </ExternalLink>
              </li>
              <li>
                {overleafTemplate.name}: {overleafTemplate.desc}:{" "}
                <ExternalLink href={overleafTemplate.url}>
                  {overleafTemplate.linkLabel}
                </ExternalLink>
              </li>
            </ol>
            <p>
              <span className="text-[1rem]">
                Manuscripts should not exceed 8 pages, including tables, figures, notes,
                and references.{"\u00a0"}
              </span>
              <span className="text-[1rem]">
                Authors should not change the prescribed formatting, margins, font sizes,
                or column layout of the templates. All instructional text in the template
                must be removed before submission. Papers that do not follow the required
                template may be returned to the authors for revision.{"\u00a0"}
              </span>
            </p>
            <p>
              For additional guidance on IEEE conference paper templates, authors may
              refer to the official IEEE template page:{"\u00a0"}
              <ExternalLink href={IEEE_TEMPLATES_URL}>{IEEE_TEMPLATES_URL}</ExternalLink>
            </p>

            <h2>Acknowledgement</h2>
            <p>
              The Microsoft CMT service was used for managing the peer-reviewing process
              for this conference. This service was provided for free by Microsoft and
              they bore all expenses, including costs for Azure cloud services as well as
              for software development and support.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
