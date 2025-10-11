import axiosInstance from "@/lib/axios.config";
import { Params } from "@/types/params.types";
import { CreateTenant } from "@/types/tenant.types";
import { AxiosError } from "axios";

export const adminLoginAsEmployee = async (payload: {
  email: string;
  password: string;
}) => {
  try {
    const response = await axiosInstance.post(
      `/admin/auth/login/employee`,
      payload
    );

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

export const getAllTenants = async (params: Params) => {
  try {
    const response = await axiosInstance.get(`/admin/tenant/`, { params });
    const { tenants, pagination } = response?.data?.data;

    return { tenants, pagination };
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch employees"
      );
    }
    throw error;
  }
};

export const addTenant = async (tenantData: CreateTenant) => {
  console.log(tenantData);

  try {
    await axiosInstance.post(`/admin/tenant`, tenantData, {
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
  tenantId?: string;
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
          "Failed to fetch analytics for leave requests"
      );
    }
    throw error;
  }
};

export const getAllLeavesForAdmin = async (params: Params) => {
  try {
    const response = await axiosInstance.get(`/admin/leave/leave-request`, {
      params,
    });
    const data = response?.data?.data;

    return data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch leaves - admin"
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
    const response = await axiosInstance.put(
      `/admin/leave/leave-request/${leaveId}`,
      {
        status,
        reason,
      }
    );
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(
        error.response?.data?.message || "Failed to update leave"
      );
    }
    throw error;
  }
};
