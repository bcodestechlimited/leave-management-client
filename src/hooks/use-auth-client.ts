import { authService } from "@/api/auth.api";
import { useQuery } from "@tanstack/react-query";

export const useAuthClient = () => {
  return useQuery({
    queryKey: ["auth-client"],
    queryFn: () => authService.getAuthClient(),
    retry: false,
  });
};
