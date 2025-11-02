import axiosInstance from "@/lib/axios.config";
import { handleAxiosError } from "@/lib/utils";
import { useAdminStore } from "@/store/use-admin-store";
import { useClientStore } from "@/store/use-client-store";
import { useEmployeeStore } from "@/store/use-employee-store";

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

  ////////////////////////////////////
  clientLogin = async (payload: any) => {
    console.log(payload);

    try {
      const response = await axiosInstance.post(`/client/auth/signin`, payload);
      const token = response?.data?.data?.token;
      const client = response?.data?.data?.client;

      console.log({ token, client });

      localStorage.setItem("token", token);
      localStorage.setItem("client-id", client._id);

      useClientStore.getState().actions.setClient(client);

      return response.data?.data;
    } catch (error) {
      handleAxiosError(error, "Failed to login");
    }
  };

  getAuthClient = async () => {
    try {
      const response = await axiosInstance.get(`/client/auth`);
      const client = response.data?.data?.client;

      console.log({ client });

      useClientStore.getState().actions.setClient(client);

      return response.data?.data?.client;
    } catch (error) {
      handleAxiosError(error, "Failed to get cliient");
    }
  };

  ////////////////////////////////////
  employeeLogin = async (payload: { email: string; password: string }) => {
    try {
      const response = await axiosInstance.post(
        `/employee/auth/signin`,
        payload
      );

      const token = response?.data?.data?.token;
      const tenantId = response?.data?.data?.employee?.clientId;
      const employee = response?.data?.data?.employee;

      useEmployeeStore.getState().actions.setEmployee(employee);

      localStorage.setItem("token", token);
      localStorage.setItem("client-id", tenantId);

      return response.data;
    } catch (error) {
      handleAxiosError(error, "Failed to login");
    }
  };

  getAuthEmployee = async () => {
    try {
      const response = await axiosInstance.get(`/employee/auth`);
      // const employee = response?.data?.data?.employee;
      // updateEmployee(employee);

      const employee = response?.data?.data?.employee;

      useEmployeeStore.getState().actions.setEmployee(employee);
      // const leaveBalances = response?.data?.data?.leaveBalances;
      return employee;
    } catch (error) {
      handleAxiosError(error, "Failed to login");
    }
  };
}

export const authService = new AuthService();
