import { CONFERENCE_INFO } from "@/data/conference";

export function PublicationSection() {
  return (
    <section className="bg-slate-950 px-4 py-14 text-white sm:px-6 sm:py-16 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-8 md:grid-cols-[minmax(0,1fr)_minmax(18rem,24rem)] md:items-center">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-200">
            Publication
          </p>
          <h2 className="mt-3 text-3xl font-semibold leading-tight sm:text-4xl">
            Conference Proceedings with ISBN
          </h2>
          <p className="mt-5 max-w-3xl text-base leading-7 text-slate-300">
            All submitted papers will undergo a double-blind peer-review process by the Technical Program Committee. Accepted and presented papers will be published in the official conference proceedings with an ISBN by a reputable publisher.
          </p>
        </div>
        <div className="rounded-lg border border-white/10 bg-white p-6 text-slate-950 shadow-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
            Proceedings Published By
          </p>
          <h3 className="mt-3 text-2xl font-semibold leading-tight">
            {CONFERENCE_INFO.publication}
          </h3>
        </div>
      </div>
    </section>
  );
}
