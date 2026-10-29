import Image from "next/image";
import { Building2 } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { SPEAKERS } from "@/data/conference";
import { PartnersSection } from "@/components/home/PartnersSection";

export default function CommitteesPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <PageHeader title="Committees" />

      <section className="px-4 py-12 sm:py-16 lg:py-20">
        <div className="mx-auto w-full min-w-0 max-w-7xl space-y-8">
          <section
            className="w-full overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm"
            style={{ maxWidth: "min(100%, calc(100vw - 2rem))" }}
          >
            <div className="border-b border-slate-800 bg-[linear-gradient(135deg,#0f172a_0%,#1e293b_55%,#0f766e_100%)] p-5 sm:p-6">
              <h2 className="text-2xl font-bold leading-tight text-white sm:text-3xl">
                Keynote Speakers and Organizing Committee
              </h2>
            </div>
            <div className="grid gap-4 bg-slate-50 p-4 sm:grid-cols-2 sm:p-5 xl:grid-cols-3">
              {SPEAKERS.map((member) => (
                <article
                  key={member.id}
                  className="group min-w-0 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:border-cyan-200 hover:shadow-md"
                >
                  <div className="relative aspect-square w-full overflow-hidden bg-slate-900 sm:aspect-[3/4]">
                    <Image
                      src={member.avatar}
                      alt={member.name}
                      width={640}
                      height={480}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                      sizes="(min-width: 640px) 50vw, 100vw"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="[overflow-wrap:anywhere] text-lg font-semibold leading-6 text-slate-950">
                      {member.name}
                    </h3>
                    <ul className="mt-4 space-y-2 text-sm leading-6 text-slate-600">
                      {member.affiliation.map((item) => (
                        <li key={item} className="flex gap-2">
                          <Building2
                            className="mt-0.5 h-4 w-4 shrink-0 text-slate-400"
                            aria-hidden
                          />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </article>
              ))}
            </div>
          </section>
          {/** Host & Co-Organizing Institutions */}
          <section
            className="w-full overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm"
            style={{ maxWidth: "min(100%, calc(100vw - 2rem))" }}
          >
            <div className="border-b border-slate-800 bg-[linear-gradient(135deg,#0f172a_0%,#1e293b_55%,#0f766e_100%)] p-5 sm:p-6">
              <h2 className="text-2xl font-bold leading-tight text-white sm:text-3xl">
                Host & Co-Organizing Institutions
              </h2>
            </div>
            <PartnersSection />
          </section>
          {/** Contact Information */}
          <section
            className="w-full overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm"
            style={{ maxWidth: "min(100%, calc(100vw - 2rem))" }}
          >
            <div className="border-b border-slate-800 bg-[linear-gradient(135deg,#0f172a_0%,#1e293b_55%,#0f766e_100%)] p-5 sm:p-6">
              <h2 className="text-2xl font-bold leading-tight text-white sm:text-3xl">
                Contact Information
              </h2>
            </div>
            <ul className="p-6 space-y-8">
              <li>
                <b>Email:</b> <span><a href='mailto:AIESI2027@uneti.edu.vn'>AIESI2027@uneti.edu.vn</a> | <a href='mailto:web@uneti.edu.vn'>web@uneti.edu.vn</a></span>
              </li>
              <li>
                <b>Peer Review:</b> <span>All submitted papers will undergo a rigorous double-blind peer-review process by the Technical Program Committee.</span>
              </li>
              <li>
                <b>Language:</b> <span>English.</span>
              </li>
            </ul>
          </section>
        </div>
      </section>
    </div>
  );
}
