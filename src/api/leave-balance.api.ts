import axiosInstance from "@/lib/axios.config";
import { handleAxiosError } from "@/lib/utils";

class LeaveBalanceService {
  getLeaveBalances = async () => {
    try {
      const response = await axiosInstance.get(`/leave-balance`);

      const leaveBalances = response?.data?.data?.leaveBalances;

      return leaveBalances;
    } catch (error) {
      handleAxiosError(error, "Failed to sign in");
    }
  };
}

export const leaveBalanceService = new LeaveBalanceService();
