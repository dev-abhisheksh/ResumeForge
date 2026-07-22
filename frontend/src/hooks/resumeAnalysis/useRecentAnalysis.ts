import { getRecentAnalyses } from "@/api/resumeAnalysis.api";
import { AnalysisResultData } from "@/types/analysis.types";
import { useQuery } from "@tanstack/react-query";

export const useRecentAnalysis = () => {
  return useQuery<AnalysisResultData[]>({
    queryKey: ["recent-analysis"],
    queryFn: async (): Promise<AnalysisResultData[]> => {
      const response = await getRecentAnalyses();
      return (
        response.data?.analyses || response.data?.data || response.data || []
      );
    },
  });
};
