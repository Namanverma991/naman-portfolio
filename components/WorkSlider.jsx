import Image from "next/image";
import Link from "next/link";
import { BsArrowRight } from "react-icons/bs";
import useSWR from "swr";
import { workSlides } from "../data/workData";
import { resumeData } from "../data/resumeData";
import { useAnalytics } from "../lib/useAnalytics";

const WorkSlider = () => {
  const { data: dbProjects } = useSWR('/api/content/projects');
  const { data: personal } = useSWR('/api/content/personal');
  const { trackEvent } = useAnalytics();

  const githubLink = personal?.github || resumeData.personal.github;

  const displayItems = dbProjects
    ? dbProjects.map((proj) => ({
        title: proj.title,
        path: proj.image_path || "/thumb1.png",
        link: proj.link || githubLink,
      }))
    : workSlides.slides.flatMap((slide) => slide.images);

  const handleProjectClick = (item) => {
    trackEvent('project_click', { title: item.title, target: 'link' });
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
      {displayItems.map((image, imageI) => (
        <Link
          href={image.link}
          target="_blank"
          rel="noreferrer noopener"
          className="relative rounded-lg overflow-hidden flex items-center justify-center group cursor-pointer aspect-[16/9] w-full border border-white/5 hover:border-accent/40 transition-all duration-300"
          key={imageI}
          onClick={() => handleProjectClick(image)}
        >
          <div className="flex items-center justify-center relative overflow-hidden w-full h-full">
            {/* image */}
            <Image
              src={image.path}
              alt={image.title}
              width={500}
              height={300}
              className="object-cover w-full h-full group-hover:scale-110 transition-all duration-500"
            />

            {/* overlay gradient */}
            <div
              className="absolute inset-0 bg-gradient-to-l from-transparent via-[#e838cc] to-[#4a22bd] opacity-0 group-hover:opacity-85 transition-all duration-700"
              aria-hidden
            />

            {/* title and action */}
            <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 px-4 text-center">
              {/* project name */}
              <div className="text-white font-bold text-sm sm:text-base tracking-wide mb-2 translate-y-4 group-hover:translate-y-0 transition-all duration-300 delay-75">
                {image.title}
              </div>
              {/* view repo link style */}
              <div className="flex items-center gap-x-2 text-[11px] sm:text-xs text-accent font-semibold tracking-[0.2em] translate-y-4 group-hover:translate-y-0 transition-all duration-300 delay-150">
                <span>VIEW REPO</span>
                <BsArrowRight className="text-sm" aria-hidden />
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default WorkSlider;
