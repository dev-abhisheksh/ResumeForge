import { API } from "@/lib/axios";

export interface AnalyzePayload {
  jobDescription: string;
  company?: string;
  role?: string;
  includeRecommendations?: boolean;
}

export const analyzeWithAi = ({
  data,
  resumeId,
}: {
  data: AnalyzePayload;
  resumeId: string;
}) => API.post(`/resume-analysis/analyze/${resumeId}`, data);

export const tailorResumeApi = ({
  resumeId,
  jobDescription,
}: {
  resumeId: string;
  jobDescription: string;
}) => API.post(`/resume-analysis/tailor/${resumeId}`, { jobDescription });

export const getRecentAnalyses = () => API.get("/resume-analysis/recent");

export const getDashboardStats = () => API.get("/resume-analysis/dashboard-stats");
