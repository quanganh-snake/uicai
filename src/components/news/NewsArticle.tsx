import Link from "next/link";
import { getNewsItem } from "@/data/conference";

export function NewsArticle({
  slug,
  children,
}: {
  slug: string;
  children: React.ReactNode;
}) {
  const item = getNewsItem(slug);

  return (
    <div className="min-h-screen overflow-x-hidden bg-slate-50">
      <section className="relative flex min-h-[300px] items-center justify-center overflow-hidden bg-slate-950 px-4 py-16 text-center sm:min-h-[360px] sm:py-20">
        <div className="relative z-10 max-w-4xl">
          <Link
            href="/icai-2026/news"
            className="text-sm font-semibold uppercase tracking-wider text-blue-300"
          >
            News
          </Link>
          <h1 className="mt-4 text-3xl font-extrabold leading-tight tracking-tight text-white sm:text-4xl md:text-6xl">
            {item.title}
          </h1>
          <time
            dateTime={item.isoDate}
            className="mt-5 block text-sm font-medium text-slate-300"
          >
            {item.date}
          </time>
        </div>
      </section>

      <section className="px-4 py-12 sm:py-16">
        <article className="mx-auto max-w-4xl rounded-lg border border-slate-900 bg-white p-5 shadow-sm sm:p-8 md:p-12">
          <p className="mb-8 text-lg leading-8 text-slate-600 sm:text-xl">{item.excerpt}</p>
          <div className="prose prose-slate max-w-none prose-headings:font-bold prose-img:rounded-lg sm:prose-lg">
            {children}
          </div>
        </article>
      </section>
    </div>
  );
}
