import { Fragment } from "react";
import { NewsArticle } from "@/components/news/NewsArticle";
import { CONFERENCE_INFO } from "@/data/conference";

const TOPIC_GROUPS = [
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
    title: "AI in Industry",
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
    title: "AI for Education",
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
];

export default function CallForPapersPage() {
  return (
    <NewsArticle slug="call-for-papers-icai-fai-2026">
      <p>
        <strong>Theme:</strong> Frontier AI
      </p>
      <p>{CONFERENCE_INFO.description}</p>
      <h2>Themes / Parallel Sessions and Research Topics</h2>
      {TOPIC_GROUPS.map((group) => (
        <Fragment key={group.title}>
          <h3>{group.title}</h3>
          <ul>
            {group.topics.map((topic) => (
              <li key={topic}>{topic}</li>
            ))}
          </ul>
        </Fragment>
      ))}
      <p>Join us in exploring the frontiers of AI in research, education, business and industry.</p>
    </NewsArticle>
  );
}
