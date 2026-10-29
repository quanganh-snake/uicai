import { PageHeader } from "@/components/layout/PageHeader";
import { CONFERENCE_INFO, TEMPLATES } from "@/data/conference";
import Image from "next/image";

export default function AuthorsPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <PageHeader title="Authors" />

      <section className="px-4 py-12 sm:py-16 lg:py-20">
        <div className="mx-auto w-full min-w-0 max-w-5xl">
          <div className="prose prose-slate max-w-none prose-headings:font-bold prose-a:transition-colors hover:prose-a:text-blue-600 sm:prose-lg">
            <h2>Submission Information</h2>
            <p>
              Authors are invited to submit original, unpublished research papers, review papers, and application-oriented studies related to the conference theme and research areas of the International Conference on Artificial Intelligence, Engineering and Sustainable Innovation (AIESI 2027).
            </p>
            <p>All submissions will be peer-reviewed</p>
            <p>
              <b>Submission Email:{"\u00a0"}</b>
              <a
                href={`mailto:${CONFERENCE_INFO.contactEmail}`}
                className="text-[12pt]"
                style={{ fontFamily: "Aptos, sans-serif" }}
              >
                {CONFERENCE_INFO.contactEmail}
              </a>
            </p>

            <h2>AIESI 2027 Paper Template</h2>
            <p>
              <span className="text-[1rem]">
                To ensure consistent manuscript preparation, authors are encouraged to use the official <b>AIESI 2027 paper template</b>.
              </span>
            </p>
            <p>The template is available through the QR code below.</p>
            <p>AIESI 2027 Paper Template</p>
            <div className="relative aspect-square h-[320px] mx-auto overflow-hidden bg-slate-900 rounded-lg">
                    <Image
                      src={'/qr_scan_aiesi2027.jpg'}
                      alt={'Scan QRCode AIESI 2027'}
                      width={320}
                      height={320}
                      className="h-full w-full object-cover transition duration-500 !m-0 border-8 border-slate-800 rounded-lg"
                      sizes="(min-width: 320px) 50vw, 100vw"
                    />
                  </div>
            <p className="text-center">
              <i>Scan the QR code to access the official paper template and related documents.</i>
            </p>
            <p>
              Authors should follow the formatting instructions provided in the template when preparing their manuscripts.
            </p>
            <p>
              <span className="text-[1.5em] font-bold text-slate-900">
                Peer Review & Publication:
              </span>
              <br />
              <span>All submitted papers will undergo peer review.</span>
              <br />
              <span>Selected papers will be published in the conference proceedings with an ISBN.</span>
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
