import { getCurrentUser } from "@/api/auth.api";
import { useQuery } from "@tanstack/react-query";

export const useCurrentUser = () => {
  return useQuery({
    queryKey: ["current-user"],
    queryFn: getCurrentUser,
    staleTime: 5 * 60 * 1000, // Don't refetch for 5 min
    retry: false, // Let axios interceptor handle 401 refresh
  });
};

