export interface ProjectsItem {
  _id: string;
  user: string;
  title: string;
  summary: string;
  techStack: string[];
  bulletPoints: string[];
  rawData: string;
  createdAt?: string;
  updatedAt?: string;
}
