import Link from "next/link";
import { PageHeader } from "@/components/layout/PageHeader";
import { NEWS_ITEMS } from "@/data/conference";

export default function NewsPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <PageHeader title="News" />

      <section className="px-4 py-12 sm:py-16 lg:py-20">
        <div className="mx-auto w-full min-w-0 max-w-5xl">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {NEWS_ITEMS.map((item) => (
              <Link
                key={item.slug}
                href={`/icai-2026/news/${item.slug}`}
                className="group overflow-hidden rounded-lg border border-slate-900 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="p-6">
                  <p className="mb-3 text-sm font-medium text-slate-500">
                    {item.date}
                  </p>
                  <h2 className="text-xl font-bold text-slate-900 group-hover:text-blue-600">
                    {item.title}
                  </h2>
                  <div
                    dangerouslySetInnerHTML={{
                      __html: item.excerpt,
                    }}
                    className="mt-3 line-clamp-3 text-slate-600 text-justify"
                  />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
