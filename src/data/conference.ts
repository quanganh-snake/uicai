export interface Milestone {
  id: string;
  step: string;
  title: string;
  homeTitle?: string;
  date: string;
  badge: string;
}

export interface Speaker {
  id: string;
  name: string;
  role: string;
  avatar: string;
  affiliation: string[];
  isKeynote?: boolean;
}

export interface NewsItem {
  slug: string;
  title: string;
  date: string;
  isoDate: string;
  excerpt: string;
}

export interface TrackTopic {
  title: string;
  description?: string;
  topics?: string[];
}

export const CONFERENCE_INFO = {
  name: "The 2nd International Conference on AI: AI-Native for Universities and Industry",
  shortName: "ICAI-2027",
  formerName: "ICAI-FAI 2027",
  badgeSubtitle: "AI-Native for Universities",
  editionBadge: "2nd International Conference",
  tagline:
    "Connecting research breakthroughs with responsible, real-world impact.",
  date: "April 23, 2027",
  venue: "Hanoi, Vietnam",
  publication: "Conference proceedings with ISBN",
  forumType: "Research, education, business and industry",
  cmtUrl: "https://cmt3.research.microsoft.com/ICAIFAI2026/",
  contactEmail: "AIESI2027@uneti.edu.vn",
  webmasterEmail: "AIESI2027@uneti.edu.vn",
  websiteUrl: "https://aiesi2027.uneti.edu.vn/",
  phone: "(+84) 24 3862 1504",
  officialWebsite: "uneti.edu.vn",
  description:
    "The International Conference on Artificial Intelligence, Engineering and Sustainable Innovation (AIESI 2027) is co-organized by the University of Economics - Technology for Industries (UNETI), in collaboration with National Economics University (NEU) and Óbuda University (Hungary). The conference provides a prestigious international forum for researchers, scholars, practitioners, policymakers, and industry experts to present and discuss recent advances, emerging trends, interdisciplinary applications, and sustainable solutions across Artificial Intelligence, Advanced Engineering, Green Technologies, and the Digital Economy.",
};

export const MILESTONES: Milestone[] = [
  {
    id: "cfp",
    step: "00",
    title: "Call for Papers Announcement",
    date: "November 01, 2026",
    badge: "other",
  },
  {
    id: "submission",
    step: "01",
    title: "Full Paper Submission Deadline",
    homeTitle: "Full Paper Submission Deadline",
    date: "December 30, 2026",
    badge: "submission",
  },
  {
    id: "acceptance",
    step: "02",
    title: "Notification of Acceptance",
    homeTitle: "Acceptance Notification",
    date: "February 28, 2027",
    badge: "notification",
  },
  {
    id: "camera-ready",
    step: "03",
    title: "Camera-Ready Submission",
    homeTitle: "Camera-Ready Submission",
    date: "March 30, 2027",
    badge: "camera-ready",
  },
  {
    id: "conference-day",
    step: "04",
    title: "Conference Date",
    date: "April 23, 2027",
    badge: "conference",
  },
];

export const SPEAKERS: Speaker[] = [
  {
    id: "rochet",
    name: "Prof. André-Louis Rochet",
    role: "Speaker 01",
    avatar: "/images/keynote_stage/rochet.jpg",
    affiliation: ["Directeur Innovation, Co-Fondateur TW3 Partners, France"],
    isKeynote: true,
  },
  {
    id: "GCKIM",
    name: "Dr. Gyeng Chul Kim (GCKIM)",
    role: "Speaker 02",
    avatar: "/images/keynote_stage/gyeng_chul_kim.jpg",
    affiliation: [
      "CEO VINA Enesol, Former KAIST Professor, Expert in South Korean Industrial Policy",
    ],
    isKeynote: true,
  },
  {
    id: "tran-thi-hong-lien",
    name: "Assoc. Prof. Dr. Tran Thi Hong Lien",
    role: "Speaker 03",
    avatar: "/images/keynote_stage/tran_thi_hong_lien.jpg",
    affiliation: [
      "University of Economics and Law, Vietnam National University Ho Chi Minh City (VNU-HCM)",
    ],
    isKeynote: true,
  },
  {
    id: "tran-tho-dat",
    name: "Prof. Trần Thọ Đạt",
    role: "Speaker 04",
    avatar: "/images/tran-tho-dat.webp",
    affiliation: [
      "Chairman of Academic Board - National Economics University",
      "Chairman of Academic Board - CMC University; Chairman of AIESI 2027 Advisory Board",
    ],
    isKeynote: true,
  },
  {
    id: "banh-tien-long",
    name: "Prof. Dr. Banh Tien Long",
    role: "Speaker 05",
    avatar: "/images/keynote_stage/banh_tien_long.jpg",
    affiliation: [
      "President, The Vietnam Association for Science and Technology Editors, Vietnam",
    ],
    isKeynote: true,
  },
];

export const RESEARCH_TRACKS: TrackTopic[] = [
  {
    title:
      "Artificial Intelligence, Information Technology, Electronics and Telecommunications",
    topics: [
      "Artificial Intelligence",
      "Information Technology",
      "Electronics and Telecommunications",
    ],
  },
  {
    title:
      "Mechanical Engineering, Mechatronics, Robotics, Automation and Smart Manufacturing",
    topics: [
      "Mechanical Engineering",
      "Mechatronics and Robotics",
      "Automation",
      "Smart Manufacturing",
    ],
  },
  {
    title:
      "Advanced Materials, Energy, Green Technologies and Sustainable Development",
    topics: [
      "Advanced Materials",
      "Energy",
      "Green Technologies",
      "Sustainable Development",
    ],
  },
  {
    title: "Digital Economy, Business Management, Education and Innovation",
    topics: [
      "Digital Economy",
      "Business Management",
      "Education",
      "Innovation",
    ],
  },
  {
    title:
      "Plenary Session: Artificial Intelligence, High-Tech Industry and Business Transformation",
    description: `<p>The plenary session will feature keynote presentations addressing global trends in AI governance and ethics, high-tech and semiconductor ecosystems, and corporate governance and business model innovation in the AI era.</p>
    <p>The session will bring together perspectives on Artificial Intelligence, industrial development, business transformation, and sustainable growth.</p>
        `,
  },
  {
    title:
      "Panel Discussion: Bridging AI Innovation, High-Tech Industry, and Business Transformation for Sustainable Growth",
    description: `
      <p>The panel discussion will bring together experts from academia, industry, and policy-making to explore the intersection of AI innovation, high-tech industry development, and business transformation. The discussion will focus on strategies for leveraging AI to drive sustainable growth, enhance competitiveness, and address societal challenges.</p>
      <p><b>Moderator:</b> Prof. Tran Tho Dat</p>
      <p><b>Panelists:</b> Three keynote speakers and invited industry representatives and experts.
</p>
    `,
  },
];

export const JOURNALS = [
  {
    name: "Journal of Economics and Development - JED",
    indexing: "Scopus",
  },
  {
    name: "Journal of Asian Business and Economic Studies - JABES",
    indexing: "WoS and Scopus",
  },
  {
    name: "Journal of Computer Science and Cybernetics - VJS",
    indexing: "1.25 point in State Professorship Council index",
    note: "and other internationally recognized journals",
  },
];

export const TEMPLATES = [
  {
    name: "Microsoft Word Template",
    desc: "Recommended for authors who prefer preparing manuscripts in Microsoft Word",
    url: "https://cmcuni-my.sharepoint.com/:w:/g/personal/nvthai_cmcu_edu_vn/IQDclvFel4yVQoNQPwwY3fhkAUQjZak7O9acNDxqhdST3TI?e=c3GgwJ",
    linkLabel: "Conference-template-a4",
  },
  {
    name: "LaTeX Template",
    desc: "Recommended for authors who are familiar with LaTeX and wish to prepare high-quality conference papers",
    url: "https://cmcuni-my.sharepoint.com/:u:/g/personal/nvthai_cmcu_edu_vn/IQA8I4l8F6DkRqaLw1T2TnO2ARTq8mHK7GbOsdM697hmt6E?e=tge8Oa",
    linkLabel: "conference-latex-template",
    extra: {
      name: "IEEEtranBST2",
      url: "https://cmcuni-my.sharepoint.com/:u:/g/personal/nvthai_cmcu_edu_vn/IQBz3cwF4h2kTopd7TRn79yVAWsHlkiO4-AWF7Eu0zUg0YY?e=knp1yR",
    },
  },
  {
    name: "Overleaf Template",
    desc: "Recommended for authors who wish to write collaboratively online using a LaTeX-based template",
    url: "https://www.overleaf.com/latex/templates/ieee-conference-template/grfzhhncsfqn",
    linkLabel: "Overleaf",
  },
] as const;

export const REGISTRATION_FEES = [
  { category: "Regular Researchers (01 author/paper)", fee: "VND 2,000,000" },
  { category: "Other Participants/Accompanies", fee: "To be announced later" },
];

export const NEWS_ITEMS: NewsItem[] = [
  {
    slug: "call-for-papers-aiesi-2027",
    title: "Call for Papers: AIESI 2027",
    date: "November 1, 2026",
    isoDate: "2026-11-01",
    excerpt:
      "The International Conference on Artificial Intelligence, Engineering and Sustainable Innovation – AIESI 2027 invites researchers, scholars, practitioners, educators, policymakers, and industry professionals to submit their research contributions.",
  },
  {
    slug: "aiesi-2027-to-bring-together-international-experts-in-ai-engineering-and-sustainable-innovation",
    title:
      "AIESI 2027 to Bring Together International Experts in AI, Engineering and Sustainable Innovation",
    date: "April 23, 2027",
    isoDate: "2027-04-23",
    excerpt:
      "The International Conference on Artificial Intelligence, Engineering and Sustainable Innovation – AIESI 2027 will bring together researchers, scholars, practitioners, educators, policymakers, and industry experts for scholarly exchange, professional networking, and interdisciplinary discussions.",
  },
];

export function getNewsItem(slug: string): NewsItem {
  const item = NEWS_ITEMS.find((news) => news.slug === slug);
  if (!item) throw new Error(`Unknown news item: ${slug}`);
  return item;
}
