import Image from "next/image";

interface PageHeaderProps {
  title: string;
  badge?: string;
}

export function PageHeader({
  title,
  badge = "AI-Native for Universities",
}: PageHeaderProps) {
  return (
    <section className="relative flex min-h-[260px] items-center justify-center overflow-hidden bg-slate-950 px-4 py-14 text-center sm:min-h-[320px] sm:py-16">
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/banner_uneti.png"
          alt="AI-Native for Universities conference banner"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div
          className="absolute inset-0"
          style={{ backgroundColor: "#e9f782", opacity: 0.04 }}
        />
      </div>
      <div className="absolute inset-0 z-0 opacity-[0.16] [background-image:linear-gradient(rgba(255,255,255,0.22)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.22)_1px,transparent_1px)] [background-size:42px_42px]" />

      <div className="relative z-10 max-w-4xl animate-in fade-in slide-in-from-bottom-8 duration-700">
        <div className="mb-5 inline-block max-w-full rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-blue-300 backdrop-blur-md sm:px-4 sm:text-sm sm:tracking-widest">
          {badge}
        </div>
        <h1 className="text-3xl font-extrabold leading-tight text-white drop-shadow-xl sm:text-4xl md:text-6xl">
          {title}
        </h1>
      </div>
    </section>
  );
}
