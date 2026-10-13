import Image from "next/image";
import { Badge } from "@/components/ui/badge";

interface PageHeaderProps {
  title: string;
  badge?: string;
  description?: string;
}

export function PageHeader({
  title,
  badge = "AI-Native for Universities",
  description,
}: PageHeaderProps) {
  return (
    <div className="w-full bg-slate-50 border-b border-slate-200/80 pt-6 pb-10 sm:pt-10 sm:pb-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Banner image preview */}
        <div className="relative mb-8 h-36 sm:h-56 md:h-72 w-full overflow-hidden rounded-xl border border-slate-200 shadow-sm">
          <Image
            src="/images/banner.png"
            alt="AI-Native for Universities conference banner"
            fill
            priority
            className="object-cover"
            sizes="(min-width: 1280px) 1200px, 100vw"
          />
        </div>

        <div className="max-w-3xl space-y-3">
          <div className="flex items-center gap-2">
            <Badge
              variant="secondary"
              className="bg-blue-50 text-[#3124eb] hover:bg-blue-100 border border-blue-200/60 font-semibold px-3 py-1 text-xs"
            >
              {badge}
            </Badge>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
            {title}
          </h1>
          {description && (
            <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
              {description}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
