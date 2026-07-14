import { ParsedResume } from "../types/ai.types.js";
import { containsKeyword } from "../utils/containsKeywords.js";

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
}

const calculateKeywordScore = (
  resumeSkills: string[],
  jobDescription: string,
): KeywordScore => {
  const matched = resumeSkills.map((skill) =>
    containsKeyword(jobDescription, skill),
  );

  const jdKeywords = COMMON_KEYWORDS.filter((keyword) =>
    containsKeyword(jobDescription, keyword),
  );
  const missingKeywords = jdKeywords.filter(
    (keyword) =>
      !resumeSkills.some(
        (skill) => skill.toLowerCase() === keyword.toLowerCase().trim(),
      ),
  );

  const score = Math.min(matched.length * 2, 30);

  return { score, missingKeywords };
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

const calculateEducationScore = (
  education: ParsedResume["education"],
): number => {
  const count = education.length;
  if (count >= 2) return 15;
  if (count >= 1) return 10;

  return 0;
};

const buildRelevancePrompt = (
  items: string,
  jobDescription: string,
  type: "experience" | "projects",
): string =>
  `
You are an ATS relevance scorer. Score how relevant the candidate's ${type} is to the job description below, from 0-30.

Job Description:
${jobDescription}

Candidate ${type}:
${items}

Scoring rules:
- 25-30: Directly relevant tech stack + domain, strong match
- 15-24: Partial overlap in skills/domain
- 5-14: Weak/tangential relevance
- 0-4: Not relevant

Respond ONLY with valid JSON, no markdown, no preamble:
{"score": number, "reasoning": "one sentence"}
`.trim();
