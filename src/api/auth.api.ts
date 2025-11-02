import axiosInstance from "@/lib/axios.config";
import { handleAxiosError } from "@/lib/utils";
import { useAdminStore } from "@/store/use-admin-store";

class AuthService {
  adminSignIn = async (payload: any) => {
    try {
      const response = await axiosInstance.post(`/admin/auth/login`, payload);

      // console.log({ response });

      const token = response?.data?.data?.token;
      const admin = response?.data?.data?.admin;

      localStorage.setItem("token", token);
      useAdminStore.getState().actions.setAdmin(admin);

      return response.data?.data;
    } catch (error) {
      handleAxiosError(error, "Failed to sign in");
    }
  };
  getAdmin = async () => {
    try {
      const response = await axiosInstance.get(`/auth`);

      // console.log({ response });

      const admin = response.data?.data?.user;
      useAdminStore.getState().actions.setAdmin(admin);
      return admin;
    } catch (error) {
      handleAxiosError(error, "Failed to get user");
    }
  };
}

export const authService = new AuthService();
