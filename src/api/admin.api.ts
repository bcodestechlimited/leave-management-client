import axiosInstance from "@/lib/axios.config";
import { useEmployeeStore } from "@/store/use-employee-store";
import { Params } from "@/types/params.types";
import { CreateClient } from "@/types/tenant.types";
import { AxiosError } from "axios";

export const adminLoginAsEmployee = async (payload: {
  email: string;
  password: string;
}) => {
  try {
    const response = await axiosInstance.post(
      `/admin/auth/login/employee`,
      payload,
    );

    const token = response?.data?.data?.token;
    const clientId = response?.data?.data?.employee?.clientId;
    const employee = response?.data?.data?.employee;

    useEmployeeStore.getState().actions.setEmployee(employee);

    localStorage.setItem("token", token);
    localStorage.setItem("client-id", clientId);

    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data?.message || "Failed to log in");
    }
    throw error;
  }
};

export const getAllClients = async (params: Params) => {
  try {
    const response = await axiosInstance.get(`/admin/client/`, { params });
    const { clients, pagination } = response?.data?.data;

    console.log({ response });

    return { clients, pagination };
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch employees",
      );
    }
    throw error;
  }
};

export const addClient = async (clientData: CreateClient) => {
  console.log(clientData);

  try {
    await axiosInstance.post(`/admin/client`, clientData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data?.message || "Failed to add tenant");
    }
    throw error;
  }
};

export const getLeaveRequestAnalyticsForAdmin = async (params: {
  year?: string;
  clientId?: string;
}) => {
  try {
    const response = await axiosInstance.get(`/admin/leave/analytics`, {
      params,
    });
    const data = response?.data?.data;
    const analytics = response?.data?.data?.analytics;
    return analytics;
    return data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(
        error.response?.data?.message ||
          "Failed to fetch analytics for leave requests",
      );
    }
    throw error;
  }
};

export const getAllLeavesForAdmin = async (params: Params) => {
  try {
    const response = await axiosInstance.get(`/admin/leave`, {
      params,
    });

    console.log({ response });

    const data = response?.data?.data;

    return data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch leaves - admin",
      );
    }
    throw error;
  }
};

export const updateLeaveRequestForAdmin = async ({
  leaveId,
  status,
  reason,
}: {
  leaveId: string;
  status: "approved" | "rejected";
  reason: string;
}) => {
  try {
    const response = await axiosInstance.put(`/admin/leave/${leaveId}`, {
      status,
      reason,
    });
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(
        error.response?.data?.message || "Failed to update leave",
      );
    }
    throw error;
  }
};

export const updateLeaveRequestDate = async (
  leaveId: string,
  payload: {
    startDate: string;
    duration: number;
    resumptionDate: string;
  },
) => {
  try {
    const response = await axiosInstance.put(
      `/admin/leave/${leaveId}/date`,
      payload,
    );
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(
        error.response?.data?.message || "Failed to update leave date",
      );
    }
    throw error;
  }
};
