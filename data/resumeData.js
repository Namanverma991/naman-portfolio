// Centralized resume data — Single source of truth for all components
// All personal, professional, and academic data is consumed from this file.

export const resumeData = {
  personal: {
    name: "Naman Verma",
    firstName: "Naman",
    lastName: "Verma",
    title: "Data Science & Analytics",
    email: "nnamanvverma@gmail.com",
    phone: "+91 7534800987",
    linkedin: "https://www.linkedin.com/in/naman12verma/",
    github: "https://github.com/Namanverma991",
    portfolio: "",
    location: "India",
    summary:
      `Engineering Intelligent Solutions Through AI & Software Development
      I am a Python Developer at WalkingTree Technologies passionate about AI, Machine Learning, and software engineering. I build scalable backend systems and intelligent applications using Python, LLMs, and cloud technologies.`,
    heroHeadingLine1: "Turning Data Into",
    heroHeadingAccent: "Actionable Insights",
    heroSubtitle: "I am a Python Developer at WalkingTree Technologies with a strong passion for Artificial Intelligence, Machine Learning, and modern software engineering.",
  },

  experience: [
    {
      title: "Python developer",
      company: "WalkingTree technologies ",
      type: "On-site",
      period: "February 2026 – Present",
      bullets: [
        "Currently working on Python based web application with django framework",
        "Using LLM for building an AI based system which can answer user queries",
        "Building an AI based tool using FastAPI and deployment of the same using Jenkins",
      ],
    },
    {
      title: "Data Science & Analytics Intern",
      company: "UBER Co-certified by AIMERZ",
      type: "Remote",
      period: "August 2025 – September 2025",
      bullets: [
        "Analyzed Uber NYC taxi dataset to identify key factors (distance, time, day) influencing fare amounts.",
        "Performed data cleaning, feature engineering (Haversine distance, datetime features), and exploratory data analysis.",
      ],
    },
    {
      title: "Data Analytics Intern",
      company: "AICTE & EduSkills — AWS Academy",
      type: "Virtual Internship",
      period: "January 2025 – March 2025",
      bullets: [
        "Completed a 10-week virtual internship focused on Data Engineering fundamentals and tools using AWS Academy curriculum.",
        "Gained hands-on knowledge in data pipelines, cloud infrastructure, ETL processes, and data transformation techniques.",
      ],
    },
  ],

  projects: [
    {
      title: "Biomedical Image Segmentation",
      subtitle: "Deep Learning",
      period: "January 2026 – March 2025",
      link: "https://github.com/Namanverma991/breast-cancer-ai",
      bullets: [
        "Performed data preprocessing, augmentation, and normalization to improve model performance.",
        "Evaluated model using metrics such as Dice Coefficient, IoU (Intersection over Union), and accuracy.",
        "Developed a deep learning model to identify and segment regions of interest (e.g., tumors/organs) from medical images.",
      ],
    },
    {
      title: "Playbook Sentinel",
      subtitle: "Machine Learning",
      period: "April 2026 – May 2026",
      link: "https://github.com/Namanverma991",
      bullets: [
        "Performed data preprocessing, augmentation, and normalization to improve model performance.",
        "Evaluated model using metrics such as Dice Coefficient, IoU (Intersection over Union), and accuracy.",
        "Developed a deep learning model to identify and segment regions of interest (e.g., tumors/organs) from medical images.",
      ],
    },
    {
      title: "Voice GPT",
      subtitle: "AI Virtual Assistant",
      period: "February 2026 – March 2026",
      link: "https://github.com/Namanverma991/VoiceGPT",
      bullets: [
        "Developed a real-time AI virtual assistant using Python, SpeechRecognition, and TTS libraries",
        "Integrated OpenAI API to provide natural language understanding and response generation capabilities",
        "Added features such as web browsing, math calculations, and file operations using Python libraries",
      ],
    },
  ],

  skills: {
    languages: ["Python", "MySQL", "JavaScript", "HTML", "CSS", "Node.js"],
    libraries: [
      "Pandas",
      "NumPy",
      "Matplotlib",
      "FastAPI",
      "ReactJs",
      "ExpressJs",
      "MongoDB",
    ],
    tools: ["Git", "GitHub", "Power BI", "Tableau", "Data Tools", "Jenskins"],
    softSkills: [
      "Excellent Communication",
      "Problem Solving",
      "Team Management",
      "Decision Making",
    ],
  },

  education: [
    {
      institution: "Hindustan College of Science and Technology (Affiliated by AKTU)",
      degree: "BTech in Computer Science (Data Science)",
      gpa: "CGPA: 7.2",
      period: "September 2022 – August 2026",
    },
    {
      institution: "University Model School (C.B.S.E.)",
      degree: "XII — Science Stream (PCM)",
      gpa: "Percentage: 70%",
      period: "April 2021 – March 2022",
    },
    {
      institution: "St. Mark's Public School (C.B.S.E.)",
      degree: "X",
      gpa: "Percentage: 80%",
      period: "April 2019 – March 2020",
    },
  ],

  certifications: [
    {
      title: "Data Structures in Python",
      issuer: "Aimerz",
      date: "August 2025",
    },
    {
      title: "Data Science and Gen AI",
      issuer: "Aimerz",
      date: "August 2025",
    },
    {
      title: "Data Analytics",
      issuer: "Deloitte",
      date: "March 2025",
    },
    {
      title: "AWS Academy Data Engineering",
      issuer: "AWS Academy",
      date: "February 2025",
    },
    {
      title: "Python for Beginners",
      issuer: "Udemy",
      date: "May 2024",
    },
    {
      title: "Python for Data Science",
      issuer: "IBM",
      date: "March 2024",
    },
  ],

  // Computed stats used by CountUp and other summary displays
  stats: {
    currently:"Working at WalkingTree technologies",
    yearsExperience: 1,
    projects: "10+",
    certifications: "10+",
    hackathons: 1,
    internships: 2,
  },
};
