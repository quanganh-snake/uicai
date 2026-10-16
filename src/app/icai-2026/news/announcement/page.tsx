import { NewsArticle } from "@/components/news/NewsArticle";

export default function AnnouncementPage() {
  return (
    <NewsArticle slug="announcement">
      <p className="text-justify">
        Following consultations with the co-organizing institutions and the Scientific
        Committee, the Organizing Committee is pleased to announce the official change of
        the conference name as follows:
      </p>
      <p className="text-justify">
        <b>New official{"\u00a0"} name: </b>
        <i>
          The Second International Conference on AI: AI-Native for Universities and
          Industry
        </i>
      </p>
      <p className="text-justify">
        <b>Abbreviation:</b> ICAI-2026
      </p>
      <p className="text-justify">
        The new name more accurately reflects the shift from using AI as a collection of
        standalone support tools toward an AI-native approach, in which AI becomes a core
        capability across education, research, university governance, business
        operations, and product development.
      </p>
      <p className="text-justify">
        It also aligns more closely with the conference’s academic and professional
        focus, particularly its discussions on the adoption and integration of AI in
        universities and industry. At the same time, the new name highlights the
        conference’s role in strengthening collaboration among universities, research
        institutions, and industry partners.
      </p>
      <p className="text-justify">
        Please note that this change applies only to the conference name. The conference
        topics, important dates, proceedings publication arrangements, submission
        requirements, and all other previously announced information remain unchanged.
      </p>
      <p className="text-justify">
        Authors, speakers, partners, and participants are kindly invited to use the new
        official name and abbreviation in future communications and materials.
      </p>
    </NewsArticle>
  );
}
