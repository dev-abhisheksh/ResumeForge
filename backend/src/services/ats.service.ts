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

const calculateKeywordScore = (
  resumeSkills: string[],
  jobDescription: string,
): KeywordResult => {
  const jdWords = jobDescription.toLowerCase().split(/\W+/).filter(Boolean);

  const uniqueJDWords = [...new Set(jdWords)];

  const matched = resumeSkills.filter((skill) =>
    uniqueJDWords.includes(skill.toLowerCase()),
  );

  const missingKeywords = uniqueJDWords.filter(
    (word) => !resumeSkills.some((skill) => skill.toLowerCase() === word),
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
