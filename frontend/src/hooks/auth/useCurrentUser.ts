import { getCurrentUser } from "@/api/auth.api";
import { useQuery } from "@tanstack/react-query";

export const useCurrentUser = () => {
  return useQuery({
    queryKey: ["current-user"],
    queryFn: getCurrentUser,
  });
};
