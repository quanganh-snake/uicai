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
  shortName: "ICAI-2026",
  formerName: "ICAI-FAI 2026",
  badgeSubtitle: "AI-Native for Universities",
  editionBadge: "2nd International Conference",
  tagline: "Connecting research breakthroughs with responsible, real-world impact.",
  date: "December 3, 2026",
  venue: "Hanoi, Vietnam",
  publication: "Conference proceedings with ISBN",
  forumType: "Research, education, business and industry",
  cmtUrl: "https://cmt3.research.microsoft.com/ICAIFAI2026/",
  contactEmail: "icai@cmcu.edu.vn",
  webmasterEmail: "du@cmcu.edu.vn",
  websiteUrl: "https://icai.cmcu.edu.vn/",
  description:
    "ICAI-FAI 2026 is the second international conference on Artificial Intelligence in the annual conference series organized by CMC University, in collaboration with Steinbeis University - Schools of Next Practices, Germany, and Tsinghua University, Shenzhen International Graduate School (SIGS), China. The conference provides an international forum for researchers, scholars, practitioners, policymakers and industry experts to present and discuss recent advances, emerging trends, impacts and practical applications of frontier AI.",
};

export const MILESTONES: Milestone[] = [
  {
    id: "cfp",
    step: "00",
    title: "Call for Papers",
    date: "July 1, 2026",
    badge: "other",
  },
  {
    id: "submission",
    step: "01",
    title: "Full Paper Submission",
    homeTitle: "Full paper submission",
    date: "October 31, 2026",
    badge: "submission",
  },
  {
    id: "acceptance",
    step: "02",
    title: "Notification of Acceptance",
    homeTitle: "Acceptance notification",
    date: "November 10, 2026",
    badge: "notification",
  },
  {
    id: "camera-ready",
    step: "03",
    title: "Camera-ready Submission",
    homeTitle: "Camera-ready deadline",
    date: "November 20, 2026",
    badge: "camera-ready",
  },
  {
    id: "conference-day",
    step: "04",
    title: "Conference Date",
    date: "December 3, 2026",
    badge: "conference",
  },
];

export const SPEAKERS: Speaker[] = [
  {
    id: "mario-vaupel",
    name: "Prof. Mario Vaupel",
    role: "Speaker 01",
    avatar: "/images/mario-vaupel.png",
    affiliation: ["CEO, Founder of Steinbeis University - Schools of next Practices, Germany"],
    isKeynote: true,
  },
  {
    id: "chun-yuan",
    name: "Prof. Chun Yuan",
    role: "Speaker 02",
    avatar: "/images/chun-yuan.jpg",
    affiliation: ["Professor at Tsinghua Shenzhen International Graduate School"],
    isKeynote: true,
  },
  {
    id: "tran-tho-dat",
    name: "Prof. Trần Thọ Đạt",
    role: "Keynote Speakers and Organizing Committee",
    avatar: "/images/tran-tho-dat.webp",
    affiliation: [
      "Chairman of University's Academic Board, National Economics University",
      "Chairman of Council of Science and Trainning, CMC University",
    ],
  },
  {
    id: "nguyen-trung-chinh",
    name: "Mr. Nguyễn Trung Chính",
    role: "Keynote Speakers and Organizing Committee",
    avatar: "/images/nguyen-trung-chinh.jpg",
    affiliation: [
      "Chairman of CMC Corporation",
      "Chairman of University Council, CMC University",
    ],
  },
  {
    id: "dang-minh-tuan",
    name: "Dr. Đặng Minh Tuấn",
    role: "Keynote Speakers and Organizing Committee",
    avatar: "/images/dang-minh-tuan.png",
    affiliation: [
      "Senior Vice President of CMC Corporation",
      "President of CMC Applied Technology institute",
    ],
  },
  {
    id: "nguyen-thanh-tung",
    name: "Assoc. Prof. Nguyễn Thanh Tùng",
    role: "Keynote Speakers and Organizing Committee",
    avatar: "/images/nguyen-thanh-tung.jpg",
    affiliation: [
      "Executive Vice President of CMC Corpporation",
      "President of CMC University",
    ],
  },
];

export const RESEARCH_TRACKS: TrackTopic[] = [
  {
    title: "Economics & Business Administration",
    topics: [
      "Global Trends and Future of AI",
      "Digital Economy; Digital and Green Growth",
      "Digital & AI Transformation in Organizations",
      "AI Applications across Industries: Healthcare; Manufacturing; Agriculture; Education; etc.",
      "Digital Trade & E-commerce; E-Logistics; E-Payment; E-Infrastructure; etc.",
      "AI-Driven Enterprise: Leadership; Change Management; Operation Management; HRM; Risk Management; Fintech; Digital Marketing; Digital Sales; etc.",
      "Entrepreneurship and Innovation in the AI Era",
      "Ethics; Governance; and Policy for AI",
    ],
  },
  {
    title: "Information Technology and Communications",
    topics: [
      "Deep Learning and Neural Networks",
      "Machine Learning and Data Mining",
      "Data Science",
      "AI Applications",
      "Natural Language Processing",
    ],
  },
  {
    title: "Microelectronics and Telecommunications",
    topics: [
      "Microelectronics and Telecommunications",
      "Networking; IC/Chip design",
      "IoT; AIoT devices",
    ],
  },
  {
    title: "Special Session: AI for Education",
    description:
      "The AI for Education Special Session will feature invited talks on the applications of AI in higher education, with contributions from Tsinghua University, Steinbeis University – Schools of Next Practices, and CMC University. The session will discuss how AI can support teaching, learning, assessment, academic administration, student support, and the transformation of universities in the AI era.",
  },
  {
    title: "Special Activity: AI Technology Exhibition",
    description:
      "The exhibition will showcase practical AI technologies and real-world applications across industry, education, business management, information technology, microelectronics, and telecommunications, connecting researchers, enterprises, practitioners, and policymakers.",
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
    slug: "announcement",
    title: "Announcement on the Conference Name Change",
    date: "August 11, 2026",
    isoDate: "2026-08-11",
    excerpt:
      "New official name: The Second International Conference on AI: AI-Native for Universities and Industry Abbreviation: ICAI-2026",
  },
  {
    slug: "call-for-papers-icai-fai-2026",
    title: "Call for Papers: ICAI-FAI 2026",
    date: "June 1, 2026",
    isoDate: "2026-06-01",
    excerpt:
      "ICAI-FAI 2026 invites original research papers, review papers and application-oriented studies on Frontier AI.",
  },
  {
    slug: "deadline-extension",
    title: "ICAI-2026 Deadline Extension",
    date: "October 1, 2026",
    isoDate: "2026-10-01",
    excerpt: "Extension of Paper Submission Deadline – ICAI-2026",
  },
];

export function getNewsItem(slug: string): NewsItem {
  const item = NEWS_ITEMS.find((news) => news.slug === slug);
  if (!item) throw new Error(`Unknown news item: ${slug}`);
  return item;
}
