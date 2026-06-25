import Link from "next/link";
import useSWR from "swr";
import {
  RiLinkedinLine,
  RiGithubLine,
  RiMailLine,
  RiFileUserLine,
} from "react-icons/ri";
import { resumeData } from "../data/resumeData";

const Socials = () => {
  const { data: personal } = useSWR('/api/content/personal');
  const { data: resume } = useSWR('/api/content/resume');

  const linkedin = personal?.linkedin || resumeData.personal.linkedin;
  const github = personal?.github || resumeData.personal.github;
  const email = personal?.email || resumeData.personal.email;
  const resumePath = resume?.path || '/naman.pdf';

  const socialData = [
    {
      name: "LinkedIn",
      link: linkedin,
      Icon: RiLinkedinLine,
    },
    {
      name: "Github",
      link: github,
      Icon: RiGithubLine,
    },
    {
      name: "Email",
      link: `mailto:${email}`,
      Icon: RiMailLine,
    },
    {
      name: "Resume",
      link: resumePath,
      Icon: RiFileUserLine,
    },
  ];

  return (
    <div className="flex items-center gap-x-5 text-lg">
      {socialData.map((social, i) => (
        <Link
          key={i}
          title={social.name}
          href={social.link}
          target="_blank"
          rel="noreferrer noopener"
          className={`${
            social.name === "Github"
              ? "bg-accent rounded-full p-[5px] hover:text-white"
              : "hover:text-accent"
          } transition-all duration-300`}
        >
          <social.Icon aria-hidden />
          <span className="sr-only">{social.name}</span>
        </Link>
      ))}
    </div>
  );
};

export default Socials;
