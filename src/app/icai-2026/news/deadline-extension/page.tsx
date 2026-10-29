import { NewsArticle } from "@/components/news/NewsArticle";

const KEY_DATES = [
  { label: "New Submission Deadline:", date: "October 31, 2026" },
  { label: "Notification of Acceptance:", date: "November 10, 2026" },
  { label: "Camera-ready Submission:", date: "November 20, 2026" },
];

const PORTAL_URL = "https://icai.cmcu.edu.vn/icai-2026";

function Emoji({ children }: { children: string }) {
  return <span style={{ fontFamily: '"Segoe UI Emoji", sans-serif' }}>{children}</span>;
}

export default function DeadlineExtensionPage() {
  return (
    <NewsArticle slug="deadline-extension">
      <p>
        We are pleased to inform you that the submission deadline for{" "}
        <b>
          the Second International Conference on AI: AI-Native for Universities and
          Industry (ICAI-2026){" "}
        </b>
        has been extended to
        <b>
          {" "}
          <span className="text-[red]">October 31, 2026</span>
        </b>
        .
      </p>
      <p>
        This extension provides authors with additional time to complete and polish their
        manuscripts for submission. We warmly invite researchers, academics, and
        professionals to submit their papers and join us for this exciting event, which
        will take place on <b>April 23, 2027 </b>in <b>Hanoi, Vietnam</b>.
      </p>
      {KEY_DATES.map(({ label, date }) => (
        <p key={label}>
          <Emoji>📄</Emoji> <b>{label}</b>{" "}
          <b>
            <span className="text-[red]">{date}</span>
          </b>
        </p>
      ))}
      <p>
        <Emoji>🔗</Emoji> <b>Submission Guidelines &amp; Portal:</b>{" "}
        <a href={PORTAL_URL} target="_blank" rel="noopener noreferrer">
          {PORTAL_URL}
        </a>
      </p>
      <p>We look forward to your valuable contributions!</p>
      <p>
        <b>Organizing Committee – ICAI-2027</b>
      </p>
    </NewsArticle>
  );
}
