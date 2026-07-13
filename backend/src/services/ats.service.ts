interface ATSResut {
  overallScore: number;
  keywordScore: number;
  skillsScore: number;
  experienceScore: number;
  educationScore: number;
  projectScore: number;
  missingKeywords: string[];
}

export const calculateATS = (resume: struc)