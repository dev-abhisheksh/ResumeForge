import { ParsedResume } from "../types/ai.types.js";
import { containsKeyword } from "../utils/containsKeywords.js";
import { normalizeKeyword } from "../utils/normalizeKeywords.js";
import { caculateExperienceRelevance } from "./experience.service.js";

import { calculateProjectRelevance } from "./project.service.js";

const COMMON_KEYWORDS = [
  // Languages
  "javascript",
  "typescript",
  "python",
  "java",
  "c++",
  "c#",
  "ruby",
  "go",
  "golang",
  "rust",
  "php",
  "swift",
  "kotlin",
  "scala",
  "r",
  "sql",
  "nosql",
  "html",
  "css",
  "sass",
  "less",
  "bash",
  "shell",

  // Frontend
  "react",
  "angular",
  "vue",
  "svelte",
  "next.js",
  "nuxt",
  "gatsby",
  "redux",
  "mobx",
  "tailwind",
  "bootstrap",
  "webpack",
  "vite",
  "html5",
  "css3",
  "jquery",
  "flutter",
  "react native",
  "electron",

  // Backend & Databases
  "node.js",
  "nodejs",
  "express",
  "nestjs",
  "django",
  "flask",
  "spring boot",
  "laravel",
  "rails",
  "asp.net",
  ".net",
  "graphql",
  "rest api",
  "mongodb",
  "postgresql",
  "mysql",
  "redis",
  "elasticsearch",
  "sqlite",
  "mariadb",
  "oracle",
  "firebase",
  "supabase",
  "dynamodb",
  "cassandra",

  // DevOps & Cloud
  "aws",
  "amazon web services",
  "azure",
  "gcp",
  "google cloud",
  "docker",
  "kubernetes",
  "k8s",
  "terraform",
  "ansible",
  "jenkins",
  "github actions",
  "gitlab ci",
  "circleci",
  "ci/cd",
  "nginx",
  "apache",
  "linux",
  "unix",
  "cloud computing",
  "serverless",

  // Methodologies & Tools
  "git",
  "github",
  "gitlab",
  "bitbucket",
  "jira",
  "confluence",
  "trello",
  "slack",
  "agile",
  "scrum",
  "kanban",
  "waterfall",
  "sdlc",
  "testing",
  "unit testing",
  "integration testing",
  "jest",
  "cypress",
  "mocha",
  "chai",
  "selenium",

  // Concepts & Domains
  "microservices",
  "restful",
  "api development",
  "mvc",
  "oop",
  "functional programming",
  "data structures",
  "algorithms",
  "system design",
  "ui/ux",
  "web design",
  "responsive design",
  "accessibility",
  "seo",
  "security",
  "cryptography",
  "blockchain",

  // AI, Data & ML
  "machine learning",
  "deep learning",
  "artificial intelligence",
  "ai",
  "data science",
  "data analysis",
  "big data",
  "hadoop",
  "spark",
  "pandas",
  "numpy",
  "tensorflow",
  "pytorch",
  "keras",
  "scikit-learn",
  "nlp",
  "computer vision",
  "llm",
  "prompt engineering",

  // Soft Skills & Business
  "project management",
  "product management",
  "leadership",
  "communication",
  "teamwork",
  "collaboration",
  "problem solving",
  "critical thinking",
  "time management",
  "agile management",
  "customer support",
  "sales",
  "marketing",
];

interface KeywordScore {
  score: number;
  missingKeywords: string[];
  matchedKeywords: string[];
}

interface ATSResult {
  overallScore: number;
  keywordScore: number;
  skillsScore: number;
  experienceScore: number;
  educationScore: number;
  projectScore: number;
  matchedKeywords: string[];
  missingKeywords: string[];
  experienceReasoning: string;
  projectReasoning: string;
}

const calculateKeywordScore = (
  resumeSkills: string[],
  jobDescription: string,
): KeywordScore => {
  const normalizedResumeSkills = resumeSkills.map(normalizeKeyword);

  const matched = normalizedResumeSkills.filter((skill) =>
    containsKeyword(jobDescription, skill),
  );

  const jdKeywords = COMMON_KEYWORDS.filter((keyword) =>
    containsKeyword(jobDescription, keyword),
  );

  const missingKeywords = jdKeywords.filter(
    (keyword) =>
      !normalizedResumeSkills.some(
        (skill) => skill.toLowerCase().trim() === keyword.toLowerCase().trim(),
      ),
  );

  const score =
    jdKeywords.length === 0
      ? 0
      : Math.min(Math.round((matched.length / jdKeywords.length) * 30), 30);

  return { score, missingKeywords, matchedKeywords: matched };
};

const calculateSkillsScore = (normalizedResumeSkills: string[]): number => {
  const uniqueSkills = new Set(
    normalizedResumeSkills.map((skill) => skill.toLowerCase().trim()),
  );

  if (uniqueSkills.size >= 15) return 20;
  if (uniqueSkills.size >= 10) return 15;
  if (uniqueSkills.size >= 5) return 10;
  return 5;
};

const calculateEducationScore = (
  education: ParsedResume["education"],
): number => {
  const count = education.length;
  if (count >= 2) return 15;
  if (count >= 1) return 10;
  return 0;
};

/**
 * Combines rule-based scores (keyword, skills, education) with
 * AI-scored relevance (experience, projects) into one ATS result.
 * Async because experience/project scoring calls Gemini.
 */
export const calculateATS = async (
  resume: ParsedResume,
  jobDescription: string,
): Promise<ATSResult> => {
  const normalizedResumeSkills = resume.skills.map(normalizeKeyword);

  const keywordResult = calculateKeywordScore(
    normalizedResumeSkills,
    jobDescription,
  );

  const skillsScore = calculateSkillsScore(normalizedResumeSkills);
  const educationScore = calculateEducationScore(resume.education);

  const [experienceRelevance, projectRelevance] = await Promise.all([
    caculateExperienceRelevance(resume.experience, jobDescription),
    calculateProjectRelevance(resume.projects, jobDescription),
  ]);

  const experienceScore = Math.max(0, Math.min(experienceRelevance.score, 30));

  const projectScore = Math.max(0, Math.min(projectRelevance.score, 30));

  const rawTotal =
    keywordResult.score +
    skillsScore +
    experienceScore +
    educationScore +
    projectScore;

  // Max possible = 30 + 20 + 30 + 15 + 30 = 125, normalize to /100
  const overallScore = Math.round((rawTotal / 125) * 100);

  return {
    overallScore,
    keywordScore: keywordResult.score,
    skillsScore,
    experienceScore,
    projectScore,
    educationScore,
    matchedKeywords: keywordResult.matchedKeywords,
    missingKeywords: keywordResult.missingKeywords,
    experienceReasoning: experienceRelevance.reasoning,
    projectReasoning: projectRelevance.reasoning,
  };
};
