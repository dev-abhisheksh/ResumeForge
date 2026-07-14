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
