export interface AddProjectBody {
  title: string;
  rawData: string;
  techStack: string[];
}

export interface FormattedProjectAI {
  summary: string;
  bulletPoints: string[];
}
