import { API } from "@/lib/axios";

export const analyzeWithAi = ({
  data,
  resumeId,
}: {
  data: FormData;
  resumeId: string;
}) => API.post(`/resume-analysis/analyze/${resumeId}`, data);

export const getRecentAnalyses = () => API.get("/resume-analysis/recent");
