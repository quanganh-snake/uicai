import Image from "next/image";

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
    <section className="relative flex min-h-[260px] items-center justify-center overflow-hidden bg-slate-950 px-4 py-14 text-center sm:min-h-[320px] sm:py-16 w-full">
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/banner.png"
          alt="AI-Native for Universities conference banner"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div
          className="absolute inset-0"
          style={{
            backgroundColor: "#044182",
            opacity: 0.72,
            mixBlendMode: "multiply",
          }}
        />
        <div className="absolute inset-0 bg-slate-950/45" />
        <div className="absolute inset-0 opacity-[0.16] [background-image:linear-gradient(rgba(255,255,255,0.22)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.22)_1px,transparent_1px)] [background-size:42px_42px]" />
      </div>

      <div className="relative z-10 max-w-4xl text-center px-4">
        <div className="mb-4 inline-block rounded-full border border-blue-400/30 bg-blue-500/20 px-4 py-1.5 text-xs sm:text-sm font-semibold uppercase tracking-wider text-blue-200 backdrop-blur-md">
          {badge}
        </div>
        <h1 className="text-3xl font-extrabold leading-tight text-white drop-shadow-xl sm:text-4xl md:text-5xl lg:text-6xl">
          {title}
        </h1>
        {description && (
          <p className="mt-4 text-sm sm:text-base text-slate-200 max-w-2xl mx-auto drop-shadow leading-relaxed">
            {description}
          </p>
        )}
      </div>
    </section>
  );
}

