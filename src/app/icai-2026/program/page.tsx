import { PageHeader } from "@/components/layout/PageHeader";

const PROGRAM_DAYS = [
  {
    id: 1,
    title: "Plenary Session (Morning - April 23, 2027)",
    items: [
      {
        time: "08:00 - 08:30",
        content: "Registration & Welcome Coffee",
        speaker: "Organizing Committee (UNETI & NEU)",
      },
      {
        time: "08:30 - 08:50",
        content: "Opening Ceremony & Group Photo",
        speaker: "University Leadership & MC",
      },
      {
        time: "08:50 - 09:20",
        content: `Keynote 1: "Global Trends in AI Governance, Ethics, and Interdisciplinary Applications for Sustainable Development"`,
        speaker: "Prof. André-Louis Rochet (Directeur Innovation, Co-Fondateur TW3 Partners, France)",
      },
      {
        time: "09:20 - 09:50",
        content: `Keynote 2: "Building High-Tech, Semiconductor & AI Ecosystems: Lessons from South Korea's Industrial Policy for Vietnam"`,
        speaker: "Dr. Gyeng Chul Kim (GCKIM) (CEO VINA Enesol, Former KAIST Professor)",
      },
      {
        time: "09:50 - 10:20",
        content: `Keynote 3: "Corporate Governance and Business Model Innovation in the AI Era: Strategic Imperatives for Vietnamese Enterprises"`,
        speaker: "Assoc. Prof. Dr. Tran Thi Hong Lien (University of Economics and Law, VNU-HCM)",
      },
      {
        time: "10:20 - 10:35",
        content: "Tea Break & Networking",
        speaker: "All Delegates & Guests",
      },
      {
        time: "10:35 - 11:45",
        content: `Panel Discussion: "Bridging AI Innovation, High-Tech Industry, and Business Transformation for Sustainable Growth"`,
        speaker: "Moderator: Prof. Tran Tho Dat (NEU) - Panelists: Keynote Speakers & Industry Experts",
      },
      {
        time: "11:45 - 12:00",
        content: "Plenary Wrap-up & Guidance for Afternoon Parallel Sessions",
        speaker: "Academic Committee & Organizing Team",
      },
    ],
  },
];

const PARALLEL_TRACKS = [
  {
    id: 1,
    title: "Parallel Sessions (Afternoon - April 23, 2027)",
    items: [
      "Artificial Intelligence, Information Technology, Electronics and Telecommunications.",
      "Mechanical Engineering, Mechatronics, Robotics, Automation and Smart Manufacturing.",
      "Advanced Materials, Energy, Green Technologies and Sustainable Development.",
      "Digital Economy, Business Management, Education and Innovation."
    ]
  }
]
export default function ProgramPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <PageHeader title="Program" />

      <section className="px-4 py-12 sm:py-16 lg:py-20">
        <div className="mx-auto w-full min-w-0 max-w-5xl space-y-12">
          <div className="space-y-8">
            {PROGRAM_DAYS.map((day) => (
              <section key={day.id}>
                <h2 className="mb-4 text-2xl font-bold text-slate-900">{day.title}</h2>
                <div className="space-y-3">
                  {day.items.map((item) => (
                    <div
                      key={item.content}
                      className="grid grid-cols-1 gap-4 rounded-lg border border-slate-900 bg-white p-5 shadow-sm md:grid-cols-[180px_1fr]"
                    >
                      <div className="font-semibold text-blue-600">{item.time}</div>
                      <div>
                        <h3 className="text-lg font-bold text-slate-900">{item.content}</h3>
                        <p className="mt-3 text-slate-600">{item.speaker}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            ))}
          </div>
          <div className="space-y-8">
            {PARALLEL_TRACKS.map((track) => (
              <section key={track.id}>
                <h2 className="mb-4 text-2xl font-bold text-slate-900">{track.title}</h2>
                <div className="space-y-3">
                  {track.items.map((item, index) => (
                    <div
                      key={item}
                      className="grid grid-cols-1 gap-4 rounded-lg border border-slate-900 bg-white p-5 shadow-sm md:grid-cols-[180px_1fr]"
                    >
                      <div className="font-semibold text-blue-600">Track {index + 1}</div>
                      <div>
                        <h3 className="text-lg font-bold text-slate-900">{item}</h3>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
