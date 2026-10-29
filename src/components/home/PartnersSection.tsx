import Image from "next/image";

interface Partner {
  name: string;
  href: string;
  logo: string;
  role?: string;
}

const HOST_PARTNERS: Partner[] = [
  { name: "University of Economics - Technology for Industries (UNETI), Vietnam", href: "https://uneti.edu.vn/", logo: "/images/LOGO_UNETI.ico" },
];

const COOPERATION_PARTNERS: Partner[] = [
  {
    name: "National Economics University (NEU), Vietnam",
    href: "https://neu.edu.vn/",
    logo: "/images/logo_NEU.png",
    role: "Co-organizer",
  },
  {
    name: "Óbuda University, Hungary",
    href: "https://uni-obuda.hu",
    logo: "/images/logoUHungary.jpeg",
    role: "Co-organizer",
  },
];

function PartnerGroup({
  label,
  title,
  partners,
  background,
  cardWidth,
}: {
  label: string;
  title: string;
  partners: Partner[];
  background: string;
  cardWidth: string;
}) {
  return (
    <section className={`${background} px-4 py-16 sm:px-6 sm:py-20 lg:px-8`}>
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto mb-10 max-w-3xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            {label}
          </p>
          <h2 className="mt-3 text-3xl font-semibold text-slate-950">{title}</h2>
        </div>
        <div className="flex flex-wrap justify-center gap-5">
          {partners.map((partner) => (
            <a
              key={partner.href}
              href={partner.href}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex min-h-56 w-full flex-col items-center justify-center rounded-lg border border-slate-200 bg-white p-6 text-center shadow-sm transition hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md ${cardWidth} lg:w-[calc((100%_-_2.5rem)_/_3)]`}
            >
              <div className="flex h-28 items-center justify-center">
                <Image
                  src={partner.logo}
                  alt={partner.name}
                  width={512}
                  height={192}
                  className="max-h-24 w-auto max-w-64 object-contain"
                />
              </div>
              <h3 className="mt-5 text-center text-lg font-semibold text-slate-950">
                {partner.name}
              </h3>
              {partner.role && (
                <p className="mt-2 text-center text-sm font-medium text-slate-500">
                  {partner.role}
                </p>
              )}
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

export function PartnersSection() {
  return (
    <>
      <PartnerGroup
        label="Host Institutions"
        title="Organized by academic and innovation partners"
        partners={HOST_PARTNERS}
        background="bg-slate-50"
        cardWidth="sm:w-[calc((100%_-_1.25rem)_/_2)]"
      />
      <PartnerGroup
        label="International Cooperation"
        title="In cooperation with"
        partners={COOPERATION_PARTNERS}
        background="bg-white"
        cardWidth="md:w-[calc((100%_-_1.25rem)_/_2)]"
      />
    </>
  );
}
