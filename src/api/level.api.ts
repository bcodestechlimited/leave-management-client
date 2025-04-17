import axiosInstance from "@/lib/axios.config";
import { Params } from "@/types/params.types";
import { AxiosError } from "axios";

export const addLevel = async (payload: any) => {
  console.log(payload);

  try {
    const response = await axiosInstance.post(`/level`, payload);
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data?.message || "Failed to add level");
    }
    throw error;
  }
};

export const getLevels = async (params: Params) => {
  console.log(params);

  try {
    const response = await axiosInstance.get(`/level`, { params });

    console.log(response?.data?.data);

    return response.data?.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data?.message || "Failed to get levels");
    }
    throw error;
  }
};

export const editLevel = async (payload: { _id: string; name: string }) => {
  console.log(payload);

  try {
    const response = await axiosInstance.put(`/level/${payload._id}`, payload);
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(
        error.response?.data?.message || "Failed to update level"
      );
    }
    throw error;
  }
};

export const updateEmployeeDetailsByTenant = async (payload: any) => {
  console.log(payload);

  try {
    const response = await axiosInstance.delete(`/level/${payload.levelId}`);
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(
        error.response?.data?.message || "Failed to delete level"
      );
    }
    throw error;
  }
};
