import { tailorResumeApi } from "@/api/resumeAnalysis.api";
import { useMutation } from "@tanstack/react-query";

export const useTailorResume = () => {
  return useMutation({
    mutationFn: ({
      resumeId,
      jobDescription,
    }: {
      resumeId: string;
      jobDescription: string;
    }) => tailorResumeApi({ resumeId, jobDescription }),
  });
};
