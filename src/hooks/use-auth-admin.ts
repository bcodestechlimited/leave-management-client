import { authService } from "@/api/auth.api";
import { useQuery } from "@tanstack/react-query";

export const useAuthAdmin = () => {
  return useQuery({
    queryKey: ["auth-admin"],
    queryFn: () => authService.getAdmin,
    retry: false,
  });
};
