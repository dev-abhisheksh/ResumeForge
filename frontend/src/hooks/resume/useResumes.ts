import { resumes } from "@/api/resume.api";
import { useQuery } from "@tanstack/react-query";

export const useResume = () => {
  return useQuery({
    queryKey: ["resumes"],
    queryFn: resumes,
  });
};
