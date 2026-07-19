import { login } from "@/api/auth.api";
import { useMutation } from "@tanstack/react-query";

export const useLogin = () => {
  return useMutation({
    mutationFn: login,
    onSuccess: (res) => console.log("SUCCESS",res.data),
    onError: (err) => console.log("ERROR",err),
  });
};
