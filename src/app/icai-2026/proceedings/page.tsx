import { PageHeader } from "@/components/layout/PageHeader";
import { JOURNALS } from "@/data/conference";

export default function ProceedingsPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <PageHeader title="Proceedings" />

      <section className="px-4 py-12 sm:py-16 lg:py-20">
        <div className="mx-auto w-full min-w-0 max-w-5xl">
          <div className="prose prose-slate max-w-none prose-headings:font-bold prose-a:transition-colors hover:prose-a:text-blue-600 sm:prose-lg">
            <h2>Publication</h2>
            <p>
              All accepted full papers will be published in proceedings with ISBN.
              Selected high-quality papers will be recommended for publication in:
            </p>
            <ul>
              {JOURNALS.map((journal) => (
                <li key={journal.name}>
                  {journal.name} ({journal.indexing})
                  {"note" in journal && ` ${journal.note}`}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
