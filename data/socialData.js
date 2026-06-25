import {
  RiLinkedinLine,
  RiGithubLine,
  RiMailLine,
  RiFileUserLine,
} from "react-icons/ri";

import { resumeData } from "./resumeData";

const { personal } = resumeData;

export const socialData = [
  {
    name: "LinkedIn",
    link: personal.linkedin,
    Icon: RiLinkedinLine,
  },
  {
    name: "Github",
    link: personal.github,
    Icon: RiGithubLine,
  },
  {
    name: "Email",
    link: `mailto:${personal.email}`,
    Icon: RiMailLine,
  },
  {
    name: "Resume",
    link: "/naman.pdf",
    Icon: RiFileUserLine,
  },
];
