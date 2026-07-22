export interface AnalysisResultData {
  _id?: string;
  atsScore?: number;
  overallScore?: number;
  keywordScore?: number;
  skillsScore?: number;
  experienceScore?: number;
  educationScore?: number;
  projectScore?: number;
  matchedKeywords?: string[];
  missingKeywords?: string[];
  suggestions?: string[];
  recommendations?: string[];
  experienceReasoning?: string;
  projectReasoning?: string;
  guide?: string;
  jobDescription?: string;
  company?: string;
  role?: string;
  createdAt?: string;
  resume?: any;
  result?: any;
  [key: string]: any;
}

export interface AnalysisWorkspaceProps {
  preselectedResumeId?: string;
}
