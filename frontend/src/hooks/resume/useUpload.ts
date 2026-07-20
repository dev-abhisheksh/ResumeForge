import { uploadMaterial } from "@/api/resume.api";
import { QueryClient, useMutation } from "@tanstack/react-query";

export const useUpload = () => {
  const queryClient = new QueryClient();
  return useMutation({
    mutationFn: uploadMaterial,

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["resumes"] });
    },
  });
};
