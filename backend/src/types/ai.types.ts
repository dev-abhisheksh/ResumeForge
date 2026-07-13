export interface ParsedResume {
  personalInfo: {
    name: string;
    email: string;
    phone: string;
    linkedin?: string;
    github?: string;
  };
  summary: string;
  skills: string[];
  education: any[];
  experience: any[];
  projects: any[];
  certifications: string[];
  languages: string[];
}
