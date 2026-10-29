import { Building2, CircleCheck, Landmark, Network } from "lucide-react";
import { CONFERENCE_INFO } from "@/data/conference";

const SCOPE_GROUPS = [
  {
    // title: "Themes / Parallel Sessions and Research Topics",
    title: "Themes / Research Tracks",
    icon: Building2,
    items: [
      "Artificial Intelligence, Information Technology, Electronics and Telecommunications",
      "Mechanical Engineering, Mechatronics, Robotics, Automation and Smart Manufacturing",
      "Advanced Materials, Energy, Green Technologies and Sustainable Development",
      "Digital Economy, Business Management, Education and Innovation"
    ],
  },
  {
    title: "Special Sessions",
    icon: Network,
    items: ["AI for Education", "AI for Industry"],
  },
  {
    title: "Special Activity",
    icon: Landmark,
    items: ["AI Technology Exhibition"],
  },
];

export function ScopeSection() {
  return (
    <section
      id="conference-objectives"
      className="scroll-mt-20 bg-white px-4 py-16 sm:scroll-mt-24 sm:px-6 sm:py-20 lg:px-8"
    >
      <div className="mx-auto max-w-7xl">
        <div className="max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            Scientific Scope
          </p>
          <h2 className="mt-3 text-3xl font-semibold leading-tight text-slate-950 sm:text-4xl">
            Conference objectives and research tracks
          </h2>
          <p className="mt-5 text-base leading-8 text-slate-600">
            {CONFERENCE_INFO.description}
          </p>
        </div>

        <div className="mt-10 grid gap-5 lg:grid-cols-2">
          {SCOPE_GROUPS.map(({ title, icon: Icon, items }) => (
            <div
              key={title}
              className="rounded-lg border border-slate-200 bg-slate-50 p-6"
            >
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-md bg-white text-slate-800 shadow-sm">
                  <Icon className="h-5 w-5" aria-hidden />
                </div>
                <h3 className="text-lg font-semibold text-slate-950">{title}</h3>
              </div>
              <ul className="grid gap-3 sm:grid-cols-2">
                {items.map((item) => (
                  <li key={item} className="flex gap-3 text-sm leading-6 text-slate-700">
                    <CircleCheck
                      className="mt-0.5 h-4 w-4 shrink-0 text-teal-600"
                      aria-hidden
                    />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
