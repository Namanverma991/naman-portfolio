// About page data — built from resumeData
import {
  FaCss3,
  FaHtml5,
  FaJs,
  FaReact,
  FaNodeJs,
  FaPython,
  FaDatabase,
  FaGitAlt,
} from "react-icons/fa";
import {
  SiMongodb,
  SiPowerbi,
  SiTableau,
  SiNumpy,
  SiPandas,
  SiExpress,
} from "react-icons/si";

import { resumeData } from "./resumeData";

export const aboutData = [
  {
    title: "skills",
    info: [
      {
        title: "Languages & Frameworks",
        icons: [
          FaPython,
          FaJs,
          FaHtml5,
          FaCss3,
          FaNodeJs,
          FaReact,
          FaDatabase,
        ],
      },
      {
        title: "Libraries & Databases",
        icons: [SiPandas, SiNumpy, SiExpress, SiMongodb],
      },
      {
        title: "Tools & Platforms",
        icons: [FaGitAlt, SiPowerbi, SiTableau],
      },
    ],
  },
  {
    title: "certifications",
    info: resumeData.certifications.map((cert) => ({
      title: `${cert.title} — ${cert.issuer}`,
      stage: cert.date,
    })),
  },
  {
    title: "experience",
    info: resumeData.experience.map((exp) => ({
      title: `${exp.title} — ${exp.company}`,
      stage: exp.period,
    })),
  },
  {
    title: "credentials",
    info: resumeData.education.map((edu) => ({
      title: `${edu.degree} — ${edu.institution}`,
      stage: edu.period,
    })),
  },
];
