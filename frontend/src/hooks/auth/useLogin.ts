import { login } from "@/api/auth.api";
import { resetAuthState } from "@/lib/axios";
import { useMutation } from "@tanstack/react-query";

export const useLogin = () => {
  return useMutation({
    mutationFn: login,
    onSuccess: (res) => {
      resetAuthState();
      if (typeof window !== "undefined") {
        document.cookie =
          "isLoggedIn=true; path=/; max-age=604800; SameSite=Lax";
      }
      console.log("SUCCESS", res.data);
    },
    onError: (err) => console.log("ERROR", err),
  });
};

