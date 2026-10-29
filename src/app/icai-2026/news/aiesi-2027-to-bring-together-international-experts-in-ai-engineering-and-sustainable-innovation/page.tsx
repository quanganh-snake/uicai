import { NewsArticle } from "@/components/news/NewsArticle";

const KEYNOTES = [
  {
    speaker: "Prof. André-Louis Rochet",
    title:
      "Global Trends in AI Governance, Ethics, and Interdisciplinary Applications for Sustainable Development",
  },
  {
    speaker: "Dr. Gyeng Chul Kim",
    title:
      "Building High-Tech, Semiconductor & AI Ecosystems: Lessons from South Korea’s Industrial Policy for Vietnam",
  },
  {
    speaker: "Assoc. Prof. Dr. Tran Thi Hong Lien",
    title:
      "Corporate Governance and Business Model Innovation in the AI Era: Strategic Imperatives for Vietnamese Enterprises",
  },
] as const;

const CONTACT_EMAIL = "AIESI2027@uneti.edu.vn";

export default function Aiesi2027InternationalExpertsPage() {
  return (
    <NewsArticle slug="aiesi-2027-to-bring-together-international-experts-in-ai-engineering-and-sustainable-innovation">
      <p>
        Scheduled for April 23, 2027, at the University of Economics – Technology for
        Industries (UNETI), Hanoi, Vietnam, the conference will address research
        developments and emerging applications in Artificial Intelligence, advanced
        engineering, green technologies, and the digital economy.
      </p>

      <h2>Conference Programme</h2>
      <p>
        The draft conference programme features keynote presentations, a plenary panel
        discussion, and afternoon parallel sessions.
      </p>
      <p>
        Three keynote presentations are currently included in the draft plenary
        programme:
      </p>
      {KEYNOTES.map(({ speaker, title }) => (
        <section key={speaker}>
          <h3>{speaker}</h3>
          <p>{title}</p>
        </section>
      ))}

      <h2>Plenary Panel Discussion</h2>
      <p>The draft programme also includes a panel discussion entitled:</p>
      <p>
        <strong>
          Bridging AI Innovation, High-Tech Industry, and Business Transformation for
          Sustainable Growth
        </strong>
      </p>
      <p>
        <strong>Moderator:</strong> Prof. Tran Tho Dat
      </p>
      <p>
        The discussion will address interdisciplinary connections among Artificial
        Intelligence, high-tech industries, energy policy, and business transformation.
      </p>
      <p>The conference programme remains subject to confirmation.</p>

      <h2>Conference Information</h2>
      <ul>
        <li>
          <strong>Date:</strong> April 23, 2027
        </li>
        <li>
          <strong>Venue:</strong> University of Economics – Technology for Industries
          (UNETI), Hanoi, Vietnam
        </li>
        <li>
          <strong>Contact:</strong>{" "}
          <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
        </li>
      </ul>
    </NewsArticle>
  );
}
