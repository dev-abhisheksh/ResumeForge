import { API } from "@/lib/axios";

export interface AnalyzePayload {
  jobDescription: string;
  company?: string;
  role?: string;
}

export const analyzeWithAi = ({
  data,
  resumeId,
}: {
  data: AnalyzePayload;
  resumeId: string;
}) => API.post(`/resume-analysis/analyze/${resumeId}`, data);

export const getRecentAnalyses = () => API.get("/resume-analysis/recent");
