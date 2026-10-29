import { NewsArticle } from "@/components/news/NewsArticle";

const RESEARCH_TRACKS = [
  "Artificial Intelligence, Information Technology, Electronics and Telecommunications.",
  "Mechanical Engineering, Mechatronics, Robotics, Automation and Smart Manufacturing.",
  "Advanced Materials, Energy, Green Technologies and Sustainable Development.",
  "Digital Economy, Business Management, Education and Innovation.",
] as const;

const IMPORTANT_DATES = [
  { milestone: "Call for Papers Announcement", date: "November 1, 2026" },
  { milestone: "Full Paper Submission Deadline", date: "December 30, 2026" },
  { milestone: "Notification of Acceptance", date: "February 28, 2027" },
  { milestone: "Camera-Ready Submission Deadline", date: "March 30, 2027" },
  { milestone: "Conference Date", date: "April 23, 2027" },
] as const;

const SUBMISSION_EMAIL = "AIESI2027@uneti.edu.vn";

export default function CallForPapersAiesi2027Page() {
  return (
    <NewsArticle slug="call-for-papers-aiesi-2027">
      <p>
        <strong>Scheduled Announcement Date:</strong> November 1, 2026
      </p>
      <p>
        AIESI 2027 will be held on April 23, 2027, at the University of Economics –
        Technology for Industries (UNETI), Hanoi, Vietnam, with the participation of
        National Economics University (NEU) and Óbuda University, Hungary as the
        institutions identified in the conference Call for Papers.
      </p>

      <h2>Conference Theme</h2>
      <p>
        <strong>Artificial Intelligence, Engineering and Sustainable Innovation</strong>
      </p>
      <p>
        The conference provides an international forum for presenting and discussing
        recent advances, emerging trends, interdisciplinary applications, and sustainable
        solutions across Artificial Intelligence, advanced engineering, green
        technologies, and the digital economy.
      </p>

      <h2>Research Tracks</h2>
      <p>AIESI 2027 welcomes submissions in the following areas:</p>
      <ul>
        {RESEARCH_TRACKS.map((track) => (
          <li key={track}>{track}</li>
        ))}
      </ul>
      <p>
        Authors are invited to submit original, unpublished research papers, review
        papers, and application-oriented studies.
      </p>

      <h2>Important Dates</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse">
          <thead>
            <tr>
              <th scope="col">Milestone</th>
              <th scope="col">Date</th>
            </tr>
          </thead>
          <tbody>
            {IMPORTANT_DATES.map(({ milestone, date }) => (
              <tr key={milestone}>
                <td>{milestone}</td>
                <td>{date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2>Submission Information</h2>
      <ul>
        <li>
          <strong>Conference Language:</strong> English
        </li>
        <li>
          <strong>Submission Method:</strong> Email
        </li>
        <li>
          <strong>Submission Email:</strong>{" "}
          <a href={`mailto:${SUBMISSION_EMAIL}`}>{SUBMISSION_EMAIL}</a>
        </li>
      </ul>
      <p>All submissions will be peer-reviewed.</p>
      <p>
        Selected papers will be published in the conference proceedings with an ISBN.
      </p>
      <p>
        We look forward to receiving your valuable contributions and welcoming you to
        AIESI 2027 in Hanoi, Vietnam!
      </p>
    </NewsArticle>
  );
}
