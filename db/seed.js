const Database = require('better-sqlite3');
const bcrypt = require('bcryptjs');
const path = require('path');
const fs = require('fs');

const dbPath = path.join(__dirname, '../data/portfolio.db');
const dbDir = path.dirname(dbPath);
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}
const db = new Database(dbPath);

// Run the schema setup
const schemaPath = path.join(__dirname, 'schema.sql');
const schema = fs.readFileSync(schemaPath, 'utf8');
db.exec(schema);

// Check if database is already seeded
const userCount = db.prepare('SELECT COUNT(*) as count FROM admin_users').get().count;
if (userCount === 0) {
  // Admin credentials from env or defaults
const email = process.env.ADMIN_EMAIL || 'nnamanvverma@gmail.com';
const password = process.env.ADMIN_PASSWORD || 'changeme123';

console.log('Seeding database...');

// 1. Seed Admin User
const salt = bcrypt.genSaltSync(10);
const hashedPassword = bcrypt.hashSync(password, salt);

db.prepare(`
  INSERT OR IGNORE INTO admin_users (email, password)
  VALUES (?, ?)
`).run(email, hashedPassword);

console.log('Seeding admin user:', email);

// 2. Seed Personal Info
const personalData = {
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
  summary: "Engineering Intelligent Solutions Through AI & Software Development\nI am a Python Developer at WalkingTree Technologies passionate about AI, Machine Learning, and software engineering. I build scalable backend systems and intelligent applications using Python, LLMs, and cloud technologies.",
  heroHeadingLine1: "Turning Data Into",
  heroHeadingAccent: "Actionable Insights",
  heroSubtitle: "I am a Python Developer at WalkingTree Technologies with a strong passion for Artificial Intelligence, Machine Learning, and modern software engineering."
};

const insertPersonalInfo = db.prepare(`
  INSERT OR REPLACE INTO personal_info (key, value)
  VALUES (?, ?)
`);

for (const [key, val] of Object.entries(personalData)) {
  insertPersonalInfo.run(key, val);
}

// 3. Seed Experience
const experienceData = [
  {
    title: "Python developer",
    company: "WalkingTree technologies ",
    type: "On-site",
    period: "February 2026 – Present",
    bullets: JSON.stringify([
      "Currently working on Python based web application with django framework",
      "Using LLM for building an AI based system which can answer user queries",
      "Building an AI based tool using FastAPI and deployment of the same using Jenkins"
    ]),
    position_order: 0
  },
  {
    title: "Data Science & Analytics Intern",
    company: "UBER Co-certified by AIMERZ",
    type: "Remote",
    period: "August 2025 – September 2025",
    bullets: JSON.stringify([
      "Analyzed Uber NYC taxi dataset to identify key factors (distance, time, day) influencing fare amounts.",
      "Performed data cleaning, feature engineering (Haversine distance, datetime features), and exploratory data analysis."
    ]),
    position_order: 1
  },
  {
    title: "Data Analytics Intern",
    company: "AICTE & EduSkills — AWS Academy",
    type: "Virtual Internship",
    period: "January 2025 – March 2025",
    bullets: JSON.stringify([
      "Completed a 10-week virtual internship focused on Data Engineering fundamentals and tools using AWS Academy curriculum.",
      "Gained hands-on knowledge in data pipelines, cloud infrastructure, ETL processes, and data transformation techniques."
    ]),
    position_order: 2
  }
];

// Clear and seed experience
db.prepare('DELETE FROM experience').run();
const insertExperience = db.prepare(`
  INSERT INTO experience (title, company, type, period, bullets, position_order)
  VALUES (?, ?, ?, ?, ?, ?)
`);
experienceData.forEach((exp) => {
  insertExperience.run(exp.title, exp.company, exp.type, exp.period, exp.bullets, exp.position_order);
});

// 4. Seed Projects
const projectsData = [
  {
    title: "Biomedical Image Segmentation",
    subtitle: "Deep Learning",
    description: "Performed data preprocessing, augmentation, and normalization to improve model performance. Evaluated model using metrics such as Dice Coefficient, IoU (Intersection over Union), and accuracy. Developed a deep learning model to identify and segment regions of interest (e.g., tumors/organs) from medical images.",
    technologies: JSON.stringify(["Python", "TensorFlow", "Keras", "OpenCV", "Deep Learning"]),
    link: "https://github.com/Namanverma991/breast-cancer-ai",
    image_path: "/thumb1.png",
    featured: 1,
    position_order: 0
  },
  {
    title: "Playbook Sentinel",
    subtitle: "Machine Learning",
    description: "Performed data preprocessing, augmentation, and normalization to improve model performance. Evaluated model using metrics such as Dice Coefficient, IoU (Intersection over Union), and accuracy. Developed a deep learning model to identify and segment regions of interest (e.g., tumors/organs) from medical images.",
    technologies: JSON.stringify(["Python", "Scikit-Learn", "Machine Learning", "Data Preprocessing"]),
    link: "https://github.com/Namanverma991",
    image_path: "/thumb2.png",
    featured: 1,
    position_order: 1
  },
  {
    title: "Voice GPT",
    subtitle: "AI Virtual Assistant",
    description: "Developed a real-time AI virtual assistant using Python, SpeechRecognition, and TTS libraries. Integrated OpenAI API to provide natural language understanding and response generation capabilities. Added features such as web browsing, math calculations, and file operations using Python libraries.",
    technologies: JSON.stringify(["Python", "OpenAI API", "SpeechRecognition", "FastAPI"]),
    link: "https://github.com/Namanverma991/VoiceGPT",
    image_path: "/thumb3.png",
    featured: 1,
    position_order: 2
  }
];

db.prepare('DELETE FROM projects').run();
const insertProject = db.prepare(`
  INSERT INTO projects (title, subtitle, description, technologies, link, image_path, featured, position_order)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?)
`);
projectsData.forEach((proj) => {
  insertProject.run(proj.title, proj.subtitle, proj.description, proj.technologies, proj.link, proj.image_path, proj.featured, proj.position_order);
});

// 5. Seed Skills
const skillsData = {
  languages: ["Python", "MySQL", "JavaScript", "HTML", "CSS", "Node.js"],
  libraries: ["Pandas", "NumPy", "Matplotlib", "FastAPI", "ReactJs", "ExpressJs", "MongoDB"],
  tools: ["Git", "GitHub", "Power BI", "Tableau", "Data Tools", "Jenkins"],
  softSkills: ["Excellent Communication", "Problem Solving", "Team Management", "Decision Making"]
};

db.prepare('DELETE FROM skills').run();
const insertSkill = db.prepare(`
  INSERT INTO skills (category, items, position_order)
  VALUES (?, ?, ?)
`);
let skillOrder = 0;
for (const [cat, items] of Object.entries(skillsData)) {
  insertSkill.run(cat, JSON.stringify(items), skillOrder++);
}

// 6. Seed Education
const educationData = [
  {
    institution: "Hindustan College of Science and Technology (Affiliated by AKTU)",
    degree: "BTech in Computer Science (Data Science)",
    gpa: "CGPA: 7.2",
    period: "September 2022 – August 2026",
    position_order: 0
  },
  {
    institution: "University Model School (C.B.S.E.)",
    degree: "XII — Science Stream (PCM)",
    gpa: "Percentage: 70%",
    period: "April 2021 – March 2022",
    position_order: 1
  },
  {
    institution: "St. Mark's Public School (C.B.S.E.)",
    degree: "X",
    gpa: "Percentage: 80%",
    period: "April 2019 – March 2020",
    position_order: 2
  }
];

db.prepare('DELETE FROM education').run();
const insertEducation = db.prepare(`
  INSERT INTO education (institution, degree, gpa, period, position_order)
  VALUES (?, ?, ?, ?, ?)
`);
educationData.forEach((edu) => {
  insertEducation.run(edu.institution, edu.degree, edu.gpa, edu.period, edu.position_order);
});

// 7. Seed Certifications
const certificationsData = [
  { title: "Data Structures in Python", issuer: "Aimerz", date: "August 2025", position_order: 0 },
  { title: "Data Science and Gen AI", issuer: "Aimerz", date: "August 2025", position_order: 1 },
  { title: "Data Analytics", issuer: "Deloitte", date: "March 2025", position_order: 2 },
  { title: "AWS Academy Data Engineering", issuer: "AWS Academy", date: "February 2025", position_order: 3 },
  { title: "Python for Beginners", issuer: "Udemy", date: "May 2024", position_order: 4 },
  { title: "Python for Data Science", issuer: "IBM", date: "March 2024", position_order: 5 }
];

db.prepare('DELETE FROM certifications').run();
const insertCert = db.prepare(`
  INSERT INTO certifications (title, issuer, date, position_order)
  VALUES (?, ?, ?, ?)
`);
certificationsData.forEach((cert) => {
  insertCert.run(cert.title, cert.issuer, cert.date, cert.position_order);
});

// 8. Seed Services
const servicesData = [
  { icon: "RxBarChart", title: "Data Analysis", description: "Transforming raw data into meaningful insights using Python, Pandas, NumPy, and SQL to drive data-informed decisions.", position_order: 0 },
  { icon: "RxRocket", title: "Machine Learning", description: "Building and evaluating predictive models using regression, classification, and deep learning techniques.", position_order: 1 },
  { icon: "RxDashboard", title: "Data Visualization", description: "Creating interactive dashboards and reports with Power BI and Tableau to communicate insights effectively.", position_order: 2 },
  { icon: "RxDesktop", title: "Web Development", description: "Developing full-stack web applications using React, Node.js, Express, and MongoDB with modern UI/UX.", position_order: 3 },
  { icon: "RxLightningBolt", title: "Data Engineering", description: "Designing data pipelines, ETL processes, and cloud infrastructure using AWS to enable scalable data solutions.", position_order: 4 }
];

db.prepare('DELETE FROM services').run();
const insertService = db.prepare(`
  INSERT INTO services (icon, title, description, position_order)
  VALUES (?, ?, ?, ?)
`);
servicesData.forEach((svc) => {
  insertService.run(svc.icon, svc.title, svc.description, svc.position_order);
});

// 9. Seed Stats
const statsData = {
  currently: "Working at WalkingTree technologies",
  yearsExperience: "1",
  projects: "10+",
  certifications: "10+",
  hackathons: "1",
  internships: "2"
};

const insertStat = db.prepare(`
  INSERT OR REPLACE INTO stats (key, value)
  VALUES (?, ?)
`);
for (const [key, val] of Object.entries(statsData)) {
  insertStat.run(key, val);
}

// 10. Seed Settings
const settingsData = {
  siteTitle: "Naman Verma | Portfolio",
  metaDescription: "Naman Verma is a Data Science and Analytics student, Python Developer at WalkingTree Technologies.",
  metaKeywords: "data science, python, machine learning, deep learning, react, nextjs, portfolio",
  accentColor: "#f13024",
  gaTrackingId: ""
};

const insertSetting = db.prepare(`
  INSERT OR REPLACE INTO settings (key, value)
  VALUES (?, ?)
`);
for (const [key, val] of Object.entries(settingsData)) {
  insertSetting.run(key, val);
}

  console.log('Seeding completed successfully.');
} else {
  console.log('Database already seeded. Skipping seeding.');
}
