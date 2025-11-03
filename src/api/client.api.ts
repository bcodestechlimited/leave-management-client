import { AxiosError } from "axios";
import axiosInstance from "../lib/axios.config";

// Leave Requests
export const updateClientLeaveRequest = async (payload: {
  leaveId: string;
  status: string;
  reason: string;
}) => {
  console.log({ payload });

  try {
    const response = await axiosInstance.put(
      `/leave/${payload.leaveId}/client`,
      {
        status: payload.status,
        reason: payload.reason,
      }
    );
    return response.data?.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      console.log(error?.response?.data);
      throw new Error(
        error.response?.data?.message || "Failed to update leave by client"
      );
    }
    throw error;
  }
};
