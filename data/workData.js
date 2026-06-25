// Work slides data — dynamically built from resume projects and experience
import { resumeData } from "./resumeData";

const githubLink = resumeData.personal.github;

// Combine projects and experience to fill the 4 thumbnail slots on the Work page
const displayItems = [
  ...resumeData.projects,
  ...resumeData.experience.map((exp) => ({
    title: `${exp.title} — ${exp.company.trim()}`,
    link: githubLink,
  })),
];

export const workSlides = {
  slides: [
    {
      images: displayItems.slice(0, 4).map((item, idx) => ({
        title: item.title,
        path: `/thumb${idx + 1}.png`,
        link: item.link || githubLink,
      })),
    },
  ],
};
