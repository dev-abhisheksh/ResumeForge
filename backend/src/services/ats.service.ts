import { ParsedResume } from "../types/ai.types.js";

interface ATSResult {
  overallScore: number;
  keywordScore: number;
  skillsScore: number;
  experienceScore: number;
  educationScore: number;
  projectScore: number;
  missingKeywords: string[];
}

export const calculateATS = (
  resume: ParsedResume,
  jobDescription: string,
): ATSResult => {
  const keywordResult = calculateKeywordScore(resume.skills, jobDescription);

  const skillsScore = calculateSkillsScore(resume.skills);

  const experienceScore = calculateExperienceScore(resume.experience);

  const educationScore = calculateEducationScore(resume.education);

  const projectScore = calculateProjectScore(resume.projects);

  const overallScore =
    keywordResult.score +
    skillsScore +
    experienceScore +
    educationScore +
    projectScore;

  return {
    overallScore,
    keywordScore: keywordResult.score,
    skillsScore,
    experienceScore,
    educationScore,
    projectScore,
    missingKeywords: keywordResult.missingKeywords,
  };
};

interface KeywordResult {
  score: number;
  missingKeywords: string[];
}

const COMMON_KEYWORDS = [
  // Languages
  "javascript", "typescript", "python", "java", "c++", "c#", "ruby", "go", "golang", "rust", "php", "swift", "kotlin", "scala", "r", "sql", "nosql", "html", "css", "sass", "less", "bash", "shell",
  
  // Frontend
  "react", "angular", "vue", "svelte", "next.js", "nuxt", "gatsby", "redux", "mobx", "tailwind", "bootstrap", "webpack", "vite", "html5", "css3", "jquery", "flutter", "react native", "electron",
  
  // Backend & Databases
  "node.js", "nodejs", "express", "nestjs", "django", "flask", "spring boot", "laravel", "rails", "asp.net", ".net", "graphql", "rest api", "mongodb", "postgresql", "mysql", "redis", "elasticsearch", "sqlite", "mariadb", "oracle", "firebase", "supabase", "dynamodb", "cassandra",
  
  // DevOps & Cloud
  "aws", "amazon web services", "azure", "gcp", "google cloud", "docker", "kubernetes", "k8s", "terraform", "ansible", "jenkins", "github actions", "gitlab ci", "circleci", "ci/cd", "nginx", "apache", "linux", "unix", "cloud computing", "serverless",
  
  // Methodologies & Tools
  "git", "github", "gitlab", "bitbucket", "jira", "confluence", "trello", "slack", "agile", "scrum", "kanban", "waterfall", "sdlc", "testing", "unit testing", "integration testing", "jest", "cypress", "mocha", "chai", "selenium",
  
  // Concepts & Domains
  "microservices", "restful", "api development", "mvc", "oop", "functional programming", "data structures", "algorithms", "system design", "ui/ux", "web design", "responsive design", "accessibility", "seo", "security", "cryptography", "blockchain",
  
  // AI, Data & ML
  "machine learning", "deep learning", "artificial intelligence", "ai", "data science", "data analysis", "big data", "hadoop", "spark", "pandas", "numpy", "tensorflow", "pytorch", "keras", "scikit-learn", "nlp", "computer vision", "llm", "prompt engineering",
  
  // Soft Skills & Business
  "project management", "product management", "leadership", "communication", "teamwork", "collaboration", "problem solving", "critical thinking", "time management", "agile management", "customer support", "sales", "marketing"
];

const containsKeyword = (text: string, keyword: string): boolean => {
  const kw = keyword.toLowerCase().trim();
  const txt = text.toLowerCase();
  
  if (!kw) return false;
  
  const escaped = kw.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
  const isAlphanumeric = /^[a-z0-9\s]+$/i.test(kw);
  
  if (isAlphanumeric) {
    const regex = new RegExp(`\\b${escaped}\\b`, 'i');
    return regex.test(txt);
  } else {
    const regex = new RegExp(`(?:^|[^a-z0-9])${escaped}(?:$|[^a-z0-9])`, 'i');
    return regex.test(txt);
  }
};

const calculateKeywordScore = (
  resumeSkills: string[],
  jobDescription: string,
): KeywordResult => {
  const matched = resumeSkills.filter((skill) =>
    containsKeyword(jobDescription, skill)
  );

  const jdKeywords = COMMON_KEYWORDS.filter((keyword) =>
    containsKeyword(jobDescription, keyword)
  );

  const missingKeywords = jdKeywords.filter(
    (keyword) =>
      !resumeSkills.some(
        (skill) =>
          skill.toLowerCase().trim() === keyword.toLowerCase().trim() ||
          skill.toLowerCase().includes(keyword.toLowerCase()),
      ),
  );

  const score = Math.min(matched.length * 2, 30);

  return {
    score,
    missingKeywords,
  };
};

const calculateSkillsScore = (resumeSkills: string[]): number => {
  const uniqueSkills = new Set(
    resumeSkills.map((skill) => skill.toLowerCase().trim()),
  );

  if (uniqueSkills.size >= 15) return 20;
  if (uniqueSkills.size >= 10) return 15;
  if (uniqueSkills.size >= 5) return 10;

  return 5;
};

const calculateExperienceScore = (
  experience: ParsedResume["experience"],
): number => {
  const count = experience.length;

  if (count >= 5) return 20;
  if (count >= 3) return 15;
  if (count >= 1) return 10;

  return 0;
};

const calculateEducationScore = (
  education: ParsedResume["education"],
): number => {
  const count = education.length;

  if (count >= 2) return 15;
  if (count >= 1) return 10;

  return 0;
};

const calculateProjectScore = (projects: ParsedResume["projects"]): number => {
  const count = projects.length;

  if (count >= 4) return 15;
  if (count >= 2) return 10;
  if (count >= 1) return 5;

  return 0;
};
