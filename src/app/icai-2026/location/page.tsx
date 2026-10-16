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
            <h2 style={{ marginLeft: 0 }}>
              <table
                border={1}
                cellSpacing={0}
                cellPadding={0}
                style={{ marginLeft: 0, borderWidth: "medium", borderStyle: "none", borderColor: "currentcolor" }}
              >
                <tbody>
                  <tr>
                    <td
                      width={292}
                      valign="top"
                      style={{ width: "218.75pt", borderWidth: "1pt", borderColor: "windowtext", padding: "0cm 5.4pt" }}
                    >
                      <p style={{ marginBottom: 0, lineHeight: "normal" }}>
                        <b>
                          <span style={CALIBRI}>REGISTRATION OPTIONS</span>
                        </b>
                      </p>
                    </td>
                    <td
                      width={241}
                      valign="top"
                      style={{
                        width: "180.6pt",
                        borderWidth: "1pt 1pt 1pt medium",
                        borderStyle: "solid solid solid none",
                        borderColor: "windowtext windowtext windowtext currentcolor",
                        padding: "0cm 5.4pt",
                      }}
                    >
                      <p style={{ ...CELL_PARAGRAPH, textAlign: "center" }}>
                        <b>
                          <span style={CALIBRI}>FEES</span>
                        </b>
                      </p>
                    </td>
                  </tr>
                  {REGISTRATION_FEES.map((row, index) => (
                    <tr key={row.category}>
                      <td width={292} valign="top" style={OPTION_CELL}>
                        <p style={CELL_PARAGRAPH}>
                          <span style={BODY_TEXT}>{row.category}</span>
                        </p>
                      </td>
                      <td width={241} valign={index === 0 ? undefined : "top"} style={FEE_CELL}>
                        <p style={{ ...CELL_PARAGRAPH, textAlign: "right" }}>
                          <span style={BODY_TEXT}>{row.fee}</span>
                        </p>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p>
                <span style={BODY_TEXT}>
                  If an author has multiple accepted papers, each paper must be registered
                  separately. Registration fees cover abstract booklet, conference
                  materials, coffee breaks &amp; lunch during the conference and gala
                  dinner. Transportation and accommodation are not included.{"\u00a0\u00a0"}
                </span>
              </p>
            </h2>
            <p />
            <table
              border={1}
              cellSpacing={0}
              cellPadding={0}
              style={{ marginLeft: "54pt", borderWidth: "medium", borderStyle: "none", borderColor: "currentcolor" }}
            >
              <tbody>
                <tr />
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
}
