import { motion } from "framer-motion";
import { useState } from "react";
import CountUp from "react-countup";
import { RiFileUserLine } from "react-icons/ri";
import useSWR from "swr";

import Avatar from "../../components/Avatar";
import Circles from "../../components/Circles";
import { fadeIn } from "../../variants";
import { resumeData } from "../../data/resumeData";

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

const parseStat = (val) => {
  if (typeof val === "number") return { end: val, suffix: "" };
  if (!val) return { end: 0, suffix: "" };
  const num = parseInt(val, 10);
  const suffix = String(val).replace(String(num), "");
  return { end: isNaN(num) ? 0 : num, suffix };
};

const About = () => {
  const [index, setIndex] = useState(0);

  const { data: personal } = useSWR('/api/content/personal');
  const { data: stats } = useSWR('/api/content/stats');
  const { data: dbExperience } = useSWR('/api/content/experience');
  const { data: dbEducation } = useSWR('/api/content/education');
  const { data: dbCertifications } = useSWR('/api/content/certifications');
  const { data: resume } = useSWR('/api/content/resume');

  const expStat = parseStat(stats?.yearsExperience !== undefined ? stats.yearsExperience : resumeData.stats.yearsExperience);
  const internStat = parseStat(stats?.internships !== undefined ? stats.internships : resumeData.stats.internships);
  const projStat = parseStat(stats?.projects !== undefined ? stats.projects : resumeData.stats.projects);
  const certStat = parseStat(stats?.certifications !== undefined ? stats.certifications : resumeData.stats.certifications);
  const hackathonStat = parseStat(stats?.hackathons !== undefined ? stats.hackathons : resumeData.stats.hackathons);
  const currentlyWorking = stats?.currently !== undefined ? stats.currently : resumeData.stats.currently;
  const summary = personal?.summary || resumeData.personal.summary;
  const resumePath = resume?.path || '/naman.pdf';

  const aboutData = [
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
      info: dbCertifications
        ? dbCertifications.map((cert) => ({
            title: `${cert.title} — ${cert.issuer}`,
            stage: cert.date,
          }))
        : resumeData.certifications.map((cert) => ({
            title: `${cert.title} — ${cert.issuer}`,
            stage: cert.date,
          })),
    },
    {
      title: "experience",
      info: dbExperience
        ? dbExperience.map((exp) => ({
            title: `${exp.title} — ${exp.company}`,
            stage: exp.period,
          }))
        : resumeData.experience.map((exp) => ({
            title: `${exp.title} — ${exp.company}`,
            stage: exp.period,
          })),
    },
    {
      title: "credentials",
      info: dbEducation
        ? dbEducation.map((edu) => ({
            title: `${edu.degree} — ${edu.institution}`,
            stage: edu.period,
          }))
        : resumeData.education.map((edu) => ({
            title: `${edu.degree} — ${edu.institution}`,
            stage: edu.period,
          })),
    },
  ];

  return (
    <div className="h-full bg-primary/30 pt-24 xl:pt-28 pb-8 text-center xl:text-left overflow-hidden">
      <Circles />

      {/* avatar img */}
      <motion.div
        variants={fadeIn("right", 0.2)}
        initial="hidden"
        animate="show"
        exit="hidden"
        className="hidden xl:flex absolute bottom-0 -left-[370px]"
      >
        <Avatar />
      </motion.div>

      <div className="container mx-auto h-full flex flex-col xl:flex-row items-center xl:items-center gap-x-6 gap-y-6">
        {/* text */}
        <div className="flex-1 flex flex-col justify-center">
          <motion.h2
            variants={fadeIn("right", 0.2)}
            initial="hidden"
            animate="show"
            exit="hidden"
            className="h2"
          >
            Captivating <span className="text-accent">stories</span> birth
            magnificent designs.
          </motion.h2>

          {/* currently working status badge */}
          {currentlyWorking && (
            <motion.div
              variants={fadeIn("right", 0.35)}
              initial="hidden"
              animate="show"
              className="text-xs xl:text-sm text-accent font-semibold tracking-wider uppercase mb-3 mx-auto xl:mx-0 max-w-[500px] flex items-center gap-x-2 justify-center xl:justify-start"
            >
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-accent"></span>
              </span>
              <span>Currently: {currentlyWorking}</span>
            </motion.div>
          )}

          <motion.p
            variants={fadeIn("right", 0.4)}
            initial="hidden"
            animate="show"
            className="max-w-[500px] mx-auto xl:mx-0 mb-4 px-2 xl:px-0 text-sm xl:text-base whitespace-pre-line"
          >
            {summary}
          </motion.p>

          {/* Resume button */}
          <motion.div
            variants={fadeIn("right", 0.5)}
            initial="hidden"
            animate="show"
            className="mx-auto xl:mx-0 mb-4 xl:mb-6 max-w-[170px]"
          >
            <a
              href={resumePath}
              target="_blank"
              rel="noreferrer noopener"
              className="border border-white/50 px-5 py-2 rounded-full transition-all duration-300 flex items-center justify-center gap-x-2 group hover:border-accent hover:text-accent cursor-pointer text-xs xl:text-sm font-semibold"
            >
              <span>View Resume</span>
              <RiFileUserLine className="text-base group-hover:scale-110 transition-all duration-300" />
            </a>
          </motion.div>

          {/* counters */}
          <motion.div
            variants={fadeIn("right", 0.6)}
            initial="hidden"
            animate="show"
            className="hidden md:flex md:max-w-xl xl:max-w-none mx-auto xl:mx-0 mb-0"
          >
            <div className="flex flex-1 xl:gap-x-4">
              {/* experience */}
              <div className="relative flex-1 after:w-[1px] after:h-full after:bg-white/10 after:absolute after:top-0 after:right-0 pr-2">
                <div className="text-xl xl:text-3xl font-extrabold text-accent mb-1">
                  <CountUp start={0} end={expStat.end} suffix={expStat.suffix} duration={5} />
                </div>
                <div className="text-[10px] uppercase tracking-[1px] leading-tight">
                  Experience
                </div>
              </div>

              {/* clients */}
              <div className="relative flex-1 after:w-[1px] after:h-full after:bg-white/10 after:absolute after:top-0 after:right-0 px-2">
                <div className="text-xl xl:text-3xl font-extrabold text-accent mb-1">
                  <CountUp start={0} end={internStat.end} suffix={internStat.suffix} duration={5} />
                </div>
                <div className="text-[10px] uppercase tracking-[1px] leading-tight">
                  Internships
                </div>
              </div>

              {/* projects */}
              <div className="relative flex-1 after:w-[1px] after:h-full after:bg-white/10 after:absolute after:top-0 after:right-0 px-2">
                <div className="text-xl xl:text-3xl font-extrabold text-accent mb-1">
                  <CountUp start={0} end={projStat.end} suffix={projStat.suffix} duration={5} />
                </div>
                <div className="text-[10px] uppercase tracking-[1px] leading-tight">
                  Projects
                </div>
              </div>

              {/* awards */}
              <div className="relative flex-1 after:w-[1px] after:h-full after:bg-white/10 after:absolute after:top-0 after:right-0 px-2">
                <div className="text-xl xl:text-3xl font-extrabold text-accent mb-1">
                  <CountUp start={0} end={certStat.end} suffix={certStat.suffix} duration={5} />
                </div>
                <div className="text-[10px] uppercase tracking-[1px] leading-tight">
                  Certificates
                </div>
              </div>

              {/* hackathons */}
              <div className="relative flex-1 pl-2">
                <div className="text-xl xl:text-3xl font-extrabold text-accent mb-1">
                  <CountUp start={0} end={hackathonStat.end} suffix={hackathonStat.suffix} duration={5} />
                </div>
                <div className="text-[10px] uppercase tracking-[1px] leading-tight">
                  Hackathons
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* info */}
        <motion.div
          variants={fadeIn("left", 0.4)}
          initial="hidden"
          animate="show"
          exit="hidden"
          className="flex flex-col w-full xl:max-w-[48%] h-[340px]"
        >
          <div className="flex gap-x-4 xl:gap-x-8 mx-auto xl:mx-0 mb-4">
            {aboutData.map((item, itemI) => (
              <div
                key={itemI}
                className={`${
                  index === itemI &&
                  "text-accent after:w-[100%] after:bg-accent after:transition-all after:duration-300"
                } cursor-pointer capitalize xl:text-lg relative after:w-8 after:h-[2px] after:bg-white after:absolute after:-bottom-1 after:left-0`}
                onClick={() => setIndex(itemI)}
              >
                {item.title}
              </div>
            ))}
          </div>

          <div className="py-2 xl:py-4 flex flex-col gap-y-2 xl:gap-y-3 items-center xl:items-start overflow-y-auto scrollbar-none">
            {aboutData[index].info.map((item, itemI) => (
              <div
                key={itemI}
                className="flex flex-col md:flex-row max-w-max gap-x-2 items-center text-center text-white/60 text-sm xl:text-base py-1"
              >
                {/* title */}
                <div className="font-light mb-1 md:mb-0 text-left">{item.title}</div>
                {item.stage && <div className="hidden md:flex">-</div>}
                {item.stage && <div className="text-accent/80 font-normal">{item.stage}</div>}

                <div className="flex gap-x-4 mt-2 md:mt-0">
                  {/* icons */}
                  {item.icons?.map((Icon, iconI) => (
                    <div key={iconI} className="text-xl xl:text-2xl text-white hover:text-accent transition-colors duration-200">
                      <Icon />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default About;
