import { logout } from "@/api/auth.api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useLogout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: logout,
    onSuccess: () => {
      if (typeof window !== "undefined") {
        document.cookie =
          "isLoggedIn=; path=/; max-age=0; expires=Thu, 01 Jan 1970 00:00:00 GMT";
        window.location.href = "/login";
      }
      queryClient.clear();
    },
  });
};