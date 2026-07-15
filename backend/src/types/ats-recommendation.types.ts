export interface ATSRecommendation {
  summary: string;

  strengths: string[];
  weaknesses: string[];

  missingSkills: string[];
  missingKeywords: string[];

  resumeImprovements: string[];
  projectImprovements: string[];
  experienceImprovements: string[];

  skillsToLearn: string[];

  interviewPreparation: string[];

  overallRecommendation: string;
}
