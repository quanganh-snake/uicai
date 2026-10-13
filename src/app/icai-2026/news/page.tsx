import { PageHeader } from "@/components/layout/PageHeader";
import { NEWS_ITEMS } from "@/data/conference";
import Link from "next/link";
import { Calendar, ArrowRight } from "lucide-react";

export default function NewsPage() {
  return (
    <div>
      <PageHeader
        title="News"
        description="Latest news, announcements, and updates for The 2nd International Conference on AI: AI-Native for Universities and Industry."
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="max-w-4xl space-y-6">
          {NEWS_ITEMS.map((item) => (
            <Link
              key={item.slug}
              href={`/icai-2026/news/${item.slug}`}
              className="group block rounded-xl border border-slate-200 bg-white p-6 shadow-xs hover:border-blue-200 hover:shadow-md transition"
            >
              <div className="flex items-center gap-2 text-xs font-semibold text-[#3124eb] mb-2">
                <Calendar className="h-3.5 w-3.5" />
                <span>{item.date}</span>
              </div>
              <h2 className="text-xl font-bold text-slate-900 group-hover:text-[#3124eb] transition-colors">
                {item.title}
              </h2>
              <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                {item.excerpt}
              </p>
              <div className="mt-4 flex items-center text-xs font-semibold text-[#3124eb] group-hover:underline">
                Read full article
                <ArrowRight className="ml-1 h-3.5 w-3.5 transition group-hover:translate-x-0.5" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
