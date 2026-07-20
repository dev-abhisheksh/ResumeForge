import { uploadMaterial } from "@/api/resume.api";
import { useMutation } from "@tanstack/react-query";

export const useUpload = () => {
  return useMutation({
    mutationFn: uploadMaterial,
  });
};
