import type { CSSProperties } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { REGISTRATION_FEES } from "@/data/conference";

// Mirrors the reference site's CMS (Word-exported) table so the rendered
// table geometry, borders and Calibri text match the original page.
const CALIBRI: CSSProperties = { fontFamily: "Calibri, sans-serif" };
const BODY_TEXT: CSSProperties = { ...CALIBRI, fontWeight: "normal" };
const CELL_PARAGRAPH: CSSProperties = { margin: 0, lineHeight: "normal" };
const OPTION_CELL: CSSProperties = {
  width: "218.75pt",
  borderWidth: "medium 1pt 1pt",
  borderStyle: "none solid solid",
  borderColor: "currentcolor windowtext windowtext",
  padding: "0cm 5.4pt",
};
const FEE_CELL: CSSProperties = {
  width: "180.6pt",
  borderTop: "none",
  borderLeft: "none",
  borderBottom: "solid windowtext 1pt",
  borderRight: "solid windowtext 1pt",
  padding: "0cm 5.4pt",
};

export default function RegistrationFeesPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <PageHeader title="Registration & Fees" />

      <section className="px-4 py-12 sm:py-16 lg:py-20">
        <div className="mx-auto w-full min-w-0 max-w-5xl">
          <div className="prose prose-slate max-w-none rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
            <h2 className="ml-0! text-justify">
              <p>
                <span style={BODY_TEXT}>
                  AIESI 2027 welcomes researchers, scholars, practitioners,
                  educators, policymakers, and industry experts interested in
                  Artificial Intelligence, engineering, sustainable
                  technologies, and the digital economy.
                  {"\u00a0\u00a0"}
                </span>
              </p>
              <p>
                <span style={BODY_TEXT}>
                  The conference provides an opportunity for scholarly exchange,
                  professional networking, and interdisciplinary discussions on
                  research advances, emerging technologies, and sustainable
                  innovation.
                  {"\u00a0\u00a0"}
                </span>
              </p>
            </h2>
          </div>
        </div>
      </section>
    </div>
  );
}
