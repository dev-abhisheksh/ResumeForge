import { uploadMaterial } from "@/api/resume.api";
import {  useMutation, useQueryClient } from "@tanstack/react-query";

export const useUpload = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: uploadMaterial,

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["resumes"] });
    },
  });
};
