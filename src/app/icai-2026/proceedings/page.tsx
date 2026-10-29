import { PageHeader } from "@/components/layout/PageHeader";
import { JOURNALS } from "@/data/conference";

export default function ProceedingsPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <PageHeader title="Proceedings" />

      <section className="px-4 py-12 sm:py-16 lg:py-20">
        <div className="mx-auto w-full min-w-0 max-w-5xl flex flex-col gap-y-8">
          <div className="prose prose-slate max-w-none prose-headings:font-bold prose-a:transition-colors hover:prose-a:text-blue-600 sm:prose-lg">
            <h2 className="!mb-2">Publication & Peer Review</h2>
            <ul>
              <li>
                <b>Publication:</b> <span>All accepted and presented papers will be published in the conference proceedings with an ISBN.</span>
              </li>
              <li>
                <b>Peer Review:</b> <span>All submitted papers will undergo a rigorous double-blind peer-review process by the Technical Program Committee.</span>
              </li>
              <li>
                <b>Language:</b> <span>English.</span>
              </li>
            </ul>
          </div>
          {/** */}
          <div className="prose prose-slate max-w-none prose-headings:font-bold prose-a:transition-colors hover:prose-a:text-blue-600 sm:prose-lg">
            <h2 className="!mb-2">Submission Guidelines</h2>
            <ul>
              <li>
                <b>Paper Types:</b> <span>Original, unpublished research papers, review papers, and application-oriented studies related to the conference themes.</span>
              </li>
              <li>
                <b>Submission Method:</b> <span>Email your full paper directly to AIESI2027@uneti.edu.vn</span>
              </li>
              <li>
                <b>Paper Template:</b> <span>Scan the official QR code or download the template from the conference website.</span>
              </li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
