import { AxiosError } from "axios";
import axiosInstance from "../lib/axios.config";
import { ApplyLeaveFormData } from "@/types/leave.types";
import { Params } from "@/types/params.types";

// Leave Requests
export const getAllLeaves = async (params: Params) => {
  try {
    const response = await axiosInstance.get("/leave/leave-request", {
      params,
    });
    return response.data?.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch leaves"
      );
    }
    throw error;
  }
};

export const getLeaveDetail = async (leaveId: string | undefined) => {
  if (!leaveId) {
    throw new Error("Something went wrong");
  }

  try {
    const response = await axiosInstance.get(`/leave/leave-request/${leaveId}`);
    console.log({ data: response.data });

    return response.data?.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch leaves"
      );
    }
    throw error;
  }
};

export const getEmployeeLeaves = async (params: Params) => {
  try {
    const response = await axiosInstance.get("/leave/leave-request/employee", {
      params,
    });
    return response.data?.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch leaves"
      );
    }
    throw error;
  }
};

export const applyForLeave = async (data: ApplyLeaveFormData) => {
  try {
    const response = await axiosInstance.post("/leave/leave-request", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(
        error.response?.data?.message || "Failed to apply for leave"
      );
    }
    throw error;
  }
};

export const fetchManagerLeaveRequest = async () => {
  try {
    const response = await axiosInstance.get("/leave/leave-request/manager");
    return response.data?.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch leave requests"
      );
    }
    throw error;
  }
};

export const updateLeaveRequest = async ({
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
      `/leave/leave-request/${leaveId}`,
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

//LeaveTypes
export const getLeaveTypes = async (params: Params) => {
  try {
    const response = await axiosInstance.get(`/leave/leave-type`, {
      params,
    });
    const data = response?.data?.data;
    return data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch leave types"
      );
    }
    throw error;
  }
};

export const addLeaveType = async (payload: any) => {
  try {
    const response = await axiosInstance.post(`/leave/leave-type`, payload);
    const leaveType = response?.data?.data;
    return leaveType;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(
        error.response?.data?.message || "Failed to add leave type"
      );
    }
    throw error;
  }
};

export const editLeaveType = async (updatedLeaveType: any) => {
  console.log(updatedLeaveType);

  try {
    const response = await axiosInstance.put(
      `/leave/leave-type/${updatedLeaveType._id}`,
      updatedLeaveType
    );
    const leaveType = response?.data?.data?.leaveType;
    return leaveType;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch leave balance"
      );
    }
    throw error;
  }
};

// Analytics
export const getLeaveRequestAnalytics = async (params: { year?: string }) => {
  try {
    const response = await axiosInstance.get(`/analytics/leave-requests`, {
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

export const getMonthlyLeaveReport = async (params: {
  startDate?: string;
  endDate?: string;
}) => {
  try {
    const response = await axiosInstance.get<Blob>(`/tenant/leave-report`, {
      params,
      responseType: "blob",
    });
    return response.data;
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
