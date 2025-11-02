import { authService } from "@/api/auth.api";
import { useQuery } from "@tanstack/react-query";

export const useAuthEmployee = () => {
  return useQuery({
    queryKey: ["auth-employee"],
    queryFn: () => authService.getAuthEmployee(),
    retry: false,
  });
};
