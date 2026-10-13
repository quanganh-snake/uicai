import Image from "next/image";
import { ExternalLink } from "lucide-react";

export function PartnersSection() {
  return (
    <section className="border-t border-slate-200/80 bg-white py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Host Institution */}
        <div>
          <div className="max-w-2xl mb-8">
            <p className="text-xs font-semibold uppercase tracking-wider text-[#3124eb]">
              Host Institutions
            </p>
            <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Organized by academic and innovation partners
            </h2>
          </div>

          <div className="max-w-md">
            <a
              href="https://cmcu.edu.vn/"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col items-center sm:items-start p-6 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-blue-200 hover:shadow-md transition"
            >
              <div className="relative h-20 w-48 mb-4">
                <Image
                  src="/images/cmc-uni.png"
                  alt="CMC University"
                  fill
                  className="object-contain"
                />
              </div>
              <div className="flex items-center gap-1.5 text-base font-bold text-slate-900 group-hover:text-[#3124eb] transition-colors">
                <span>CMC University</span>
                <ExternalLink className="h-4 w-4 text-slate-400 group-hover:text-[#3124eb]" />
              </div>
              <p className="mt-1 text-xs text-slate-500">
                Lead Host & Organizing Institution
              </p>
            </a>
          </div>
        </div>

        {/* International Cooperation */}
        <div>
          <div className="max-w-2xl mb-8">
            <p className="text-xs font-semibold uppercase tracking-wider text-[#3124eb]">
              International Cooperation
            </p>
            <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              In cooperation with
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-3xl">
            <a
              href="https://www.steinbeis-next.de/"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col items-center sm:items-start p-6 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-blue-200 hover:shadow-md transition"
            >
              <div className="relative h-20 w-48 mb-4">
                <Image
                  src="/images/steinbeis.svg"
                  alt="Steinbeis University - Schools of Next Practices"
                  fill
                  className="object-contain"
                />
              </div>
              <div className="flex items-center gap-1.5 text-base font-bold text-slate-900 group-hover:text-[#3124eb] transition-colors">
                <span>Steinbeis University - Schools of Next Practices</span>
                <ExternalLink className="h-4 w-4 text-slate-400 group-hover:text-[#3124eb]" />
              </div>
              <p className="mt-1 text-xs font-semibold text-[#3124eb]">
                Co-organizer • Germany
              </p>
            </a>

            <a
              href="https://www.tsinghua.edu.cn/"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col items-center sm:items-start p-6 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-blue-200 hover:shadow-md transition"
            >
              <div className="relative h-20 w-48 mb-4">
                <Image
                  src="/images/tsinghua.jpg"
                  alt="Tsinghua University, Shenzhen International Graduate School (SIGS)"
                  fill
                  className="object-contain"
                />
              </div>
              <div className="flex items-center gap-1.5 text-base font-bold text-slate-900 group-hover:text-[#3124eb] transition-colors">
                <span>Tsinghua University (SIGS)</span>
                <ExternalLink className="h-4 w-4 text-slate-400 group-hover:text-[#3124eb]" />
              </div>
              <p className="mt-1 text-xs font-semibold text-[#3124eb]">
                Co-organizer • China
              </p>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
