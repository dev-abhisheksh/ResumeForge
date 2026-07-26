import { registerUser } from "@/api/auth.api";
import { resetAuthState } from "@/lib/axios";
import { useMutation } from "@tanstack/react-query";

export const useRegister = () => {
  return useMutation({
    mutationFn: registerUser,
    onSuccess: () => {
      resetAuthState();
      if (typeof window !== "undefined") {
        document.cookie =
          "isLoggedIn=true; path=/; max-age=604800; SameSite=Lax";
      }
    },
  });
};
