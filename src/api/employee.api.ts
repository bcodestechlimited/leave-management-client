import { AxiosError } from "axios";
import axiosInstance from "../lib/axios.config";
import { UpdateEmployee } from "@/types/employee.types";
import { Params } from "@/types/params.types";

export const getAllEmployees = async (params: Params) => {
  try {
    const response = await axiosInstance.get(`/employee`, { params });
    const employees = response?.data?.data?.employees;
    const pagination = response?.data?.pagination;

    return { employees, pagination };
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch employees"
      );
    }
    throw error;
  }
};

export const getEmployeeDetails = async (employeeId: string | undefined) => {
  try {
    const response = await axiosInstance.get(`/tenant/employee/${employeeId}`);
    const employee = response?.data?.data?.employee;
    const leaveBalances = response?.data?.data?.leaveBalances;
    return { employee, leaveBalances };
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch employee"
      );
    }
    throw error;
  }
};

export const acceptInvite = async (payload: {
  tenantId: string;
  token: string;
}) => {
  try {
    localStorage.setItem("tenant-id", payload.tenantId);
    const response = await axiosInstance.put(
      `/employee/invite?token=${payload.token}`
    );

    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(
        error.response?.data?.message ||
          "Failed to accept invite. Please try again."
      );
    }
    throw error;
  }
};

export const updateEmployeeDetails = async (payload: any) => {
  console.log(payload);

  try {
    const response = await axiosInstance.put(
      `/employee/admin/employee/${payload.employeeId}`,
      payload
    );
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(
        error.response?.data?.message || "Failed to update employee"
      );
    }
    throw error;
  }
};

// Auth Actions
export const employeeSignUp = async (payload: {
  email: string | undefined;
  password: string | undefined;
  tenantId: string | undefined;
  token: string | undefined;
}) => {
  try {
    const response = await axiosInstance.post(`/employee/auth/signin`, payload);

    const token = response?.data?.data?.token;
    const tenantId = response?.data?.data?.employee?.tenantId;
    // const employee = response?.data?.data?.employee;

    localStorage.setItem("token", token);
    localStorage.setItem("tenant-id", tenantId);

    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data?.message || "Failed to log in");
    }
    throw error;
  }
};

export const employeeSignIn = async (payload: {
  email: string;
  password: string;
}) => {
  try {
    const response = await axiosInstance.post(`/employee/auth/signin`, payload);

    const token = response?.data?.data?.token;
    const tenantId = response?.data?.data?.employee?.tenantId;
    // const employee = response?.data?.data?.employee;

    localStorage.setItem("token", token);
    localStorage.setItem("tenant-id", tenantId);

    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data?.message || "Failed to log in");
    }
    throw error;
  }
};

export const getLoggedInEmployee = async (
  updateEmployee: (employee: any) => void
) => {
  try {
    const response = await axiosInstance.get(`/employee/auth`);
    // const employee = response?.data?.data?.employee;
    // updateEmployee(employee);

    const employee = response?.data?.data?.employee;
    const leaveBalances = response?.data?.data?.leaveBalances;
    updateEmployee({ ...employee, leaveBalances });
    return employee;
  } catch (error) {
    throw error;
  }
};

export const updateEmployeeProfileAPI = async (
  data: Partial<UpdateEmployee>
) => {
  try {
    console.log(data);

    const response = await axiosInstance.put(`/employee/auth`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    const { employee, leaveBalances } = response?.data?.data;
    return { employee, leaveBalances };
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(
        error.response?.data?.message || "Failed to update profile"
      );
    }
    throw error;
  }
};

export const forgotPasswordRequest = async (payload: { email: string }) => {
  console.log(payload);

  try {
    const response = await axiosInstance.post(
      `/employee/auth/forgot-password`,
      payload
    );
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(
        error.response?.data?.message || "Failed to send to send request"
      );
    }
    throw error;
  }
};

export const resetPassword = async (payload: {
  token: string;
  password: string;
}) => {
  console.log(payload);

  try {
    const response = await axiosInstance.post(
      `/employee/auth/reset-password`,
      payload
    );

    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(
        error.response?.data?.message || "Failed to reset password"
      );
    }
    throw error;
  }
};
