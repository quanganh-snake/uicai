export interface Milestone {
  id: string;
  step: string;
  title: string;
  date: string;
  badge?: string;
  description?: string;
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
  excerpt: string;
  content: string;
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
    title: "Full paper submission",
    date: "October 31, 2026",
    badge: "submission",
    description: "Extended submission deadline for complete paper manuscripts",
  },
  {
    id: "acceptance",
    step: "02",
    title: "Acceptance notification",
    date: "November 10, 2026",
    badge: "notification",
    description: "Formal decision notification sent to corresponding authors",
  },
  {
    id: "camera-ready",
    step: "03",
    title: "Camera-ready deadline",
    date: "November 20, 2026",
    badge: "camera-ready",
    description: "Final formatted paper and author registration",
  },
  {
    id: "conference-day",
    step: "04",
    title: "Conference Date",
    date: "December 3, 2026",
    badge: "conference",
    description: "Main plenary and parallel breakout sessions in Hanoi, Vietnam",
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
      "Digital Economy, Digital and Green Growth",
      "Digital & AI Transformation in Organizations",
      "AI Applications across Industries: Healthcare, Manufacturing, Agriculture, Education, etc.",
      "Digital Trade & E-commerce, E-Logistics, E-Payment, E-Infrastructure, etc.",
      "AI-Driven Enterprise: Leadership, Change Management, Operation Management, HRM, Risk Management, Fintech, Digital Marketing, Digital Sales, etc.",
      "Entrepreneurship and Innovation in the AI Era",
      "Ethics, Governance, and Policy for AI",
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
      "Networking, IC/Chip design",
      "IoT, AIoT devices",
    ],
  },
  {
    title: "Special Session: AI for Education",
    description:
      "The AI for Education Special Session will feature invited talks on the applications of AI in higher education, with contributions from Tsinghua University, Steinbeis University – Schools of Next Practices, and CMC University. The session will discuss how AI can support teaching, learning, assessment, academic administration, student support, and the transformation of universities in the AI era.",
    topics: [
      "AI-enhanced teaching, learning and assessment",
      "Intelligent tutoring systems and personalized learning",
      "Generative AI and learning analytics in higher education",
      "AI for curriculum design, academic administration and student support",
      "Digital learning platforms, MOOCs and adaptive learning environments",
      "Ethics, governance, privacy and responsible use of AI in education",
      "Case Studies, Deployment Models, Benchmarks and Challenges of AI Adoption in Education",
    ],
  },
  {
    title: "Special Session: AI for Industry",
    topics: [
      "AI for Smart Manufacturing and Industrial Automation",
      "AI for Predictive Maintenance, Fault Diagnosis and Quality Inspection",
      "AI for Industrial Robotics and Autonomous Systems",
      "AI for Logistics, Supply Chain and Warehouse Optimization",
      "AI for Energy Systems, Smart Grids and Green Industry",
      "AI for Digital Twins, Industrial IoT and Cyber-Physical Systems",
      "AI for Finance, Banking, Insurance and Enterprise Operations",
      "AI for Smart Cities, Transportation, Agriculture and Public Services",
      "AI Agents and Workflow Automation for Industrial and Enterprise Applications",
      "Case Studies, Deployment Models, Benchmarks and Challenges of AI Adoption in Industry",
    ],
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
  },
];

export const TEMPLATES = [
  {
    name: "Microsoft Word Template",
    desc: "Recommended for authors who prefer preparing manuscripts in Microsoft Word.",
    url: "https://cmcuni-my.sharepoint.com/:w:/g/personal/nvthai_cmcu_edu_vn/IQDclvFel4yVQoNQPwwY3fhkAUQjZak7O9acNDxqhdST3TI?e=c3GgwJ",
    fileType: "DOCX",
  },
  {
    name: "LaTeX Template",
    desc: "Recommended for authors who are familiar with LaTeX and wish to prepare high-quality conference papers.",
    url: "https://cmcuni-my.sharepoint.com/:u:/g/personal/nvthai_cmcu_edu_vn/IQA8I4l8F6DkRqaLw1T2TnO2ARTq8mHK7GbOsdM697hmt6E?e=tge8Oa",
    fileType: "ZIP / TeX",
    extra: {
      name: "IEEEtranBST2",
      url: "https://cmcuni-my.sharepoint.com/:u:/g/personal/nvthai_cmcu_edu_vn/IQBz3cwF4h2kTopd7TRn79yVAWsHlkiO4-AWF7Eu0zUg0YY?e=knp1yR",
    },
  },
  {
    name: "Overleaf Template",
    desc: "Recommended for authors who wish to write collaboratively online using a LaTeX-based template.",
    url: "https://www.overleaf.com/latex/templates/ieee-conference-template/grfzhhncsfqn",
    fileType: "Online / Overleaf",
  },
];

export const REGISTRATION_FEES = [
  {
    category: "Regular Researchers (01 author/paper)",
    fee: "VND 2,000,000",
    note: "Covers abstract booklet, conference materials, coffee breaks & lunch during the conference, and gala dinner.",
  },
  {
    category: "Other Participants / Accompanies",
    fee: "To be announced later",
    note: "Covers conference attendance and materials.",
  },
];

export const NEWS_ITEMS: NewsItem[] = [
  {
    slug: "deadline-extension",
    title: "ICAI-2026 Deadline Extension",
    date: "October 1, 2026",
    excerpt: "Extension of Paper Submission Deadline – ICAI-2026 to October 31, 2026.",
    content: "We are pleased to inform you that the submission deadline for the Second International Conference on AI: AI-Native for Universities and Industry (ICAI-2026) has been extended to October 31, 2026.\n\nThis extension provides authors with additional time to complete and polish their manuscripts for submission. We warmly invite researchers, academics, and professionals to submit their papers and join us for this exciting event, which will take place on December 3, 2026 in Hanoi, Vietnam.\n\n• New Submission Deadline: October 31, 2026\n• Notification of Acceptance: November 10, 2026\n• Camera-ready Submission: November 20, 2026\n\nWe look forward to your valuable contributions!\n\nOrganizing Committee – ICAI-2026",
  },
  {
    slug: "announcement",
    title: "Announcement on the Conference Name Change",
    date: "August 11, 2026",
    excerpt: "New official name: The Second International Conference on AI: AI-Native for Universities and Industry. Abbreviation: ICAI-2026",
    content: "Following consultations with the co-organizing institutions and the Scientific Committee, the Organizing Committee is pleased to announce the official change of the conference name as follows:\n\nNew official name: The Second International Conference on AI: AI-Native for Universities and Industry\nAbbreviation: ICAI-2026\n\nThe new name more accurately reflects the shift from using AI as a collection of standalone support tools toward an AI-native approach, in which AI becomes a core capability across education, research, university governance, business operations, and product development.\n\nIt also aligns more closely with the conference’s academic and professional focus, particularly its discussions on the adoption and integration of AI in universities and industry. At the same time, the new name highlights the conference’s role in strengthening collaboration among universities, research institutions, and industry partners.\n\nPlease note that this change applies only to the conference name. The conference topics, important dates, proceedings publication arrangements, submission requirements, and all other previously announced information remain unchanged.\n\nAuthors, speakers, partners, and participants are kindly invited to use the new official name and abbreviation in future communications and materials.",
  },
  {
    slug: "call-for-papers-icai-fai-2026",
    title: "Call for Papers: ICAI-FAI 2026",
    date: "June 1, 2026",
    excerpt: "ICAI-FAI 2026 invites original research papers, review papers and application-oriented studies on Frontier AI.",
    content: "Theme: Frontier AI\n\nICAI-FAI 2026 is the second international conference on Artificial Intelligence in the annual conference series organized by CMC University, in collaboration with Steinbeis University - Schools of Next Practices, Germany, and Tsinghua University, Shenzhen International Graduate School (SIGS), China. The conference provides an international forum for researchers, scholars, practitioners, policymakers and industry experts to present and discuss recent advances, emerging trends, impacts and practical applications of frontier AI.\n\nJoin us in exploring the frontiers of AI in research, education, business and industry.",
  },
];
