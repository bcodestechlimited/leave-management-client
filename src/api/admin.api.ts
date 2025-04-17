import axiosInstance from "@/lib/axios.config";
import { Params } from "@/types/params.types";
import { CreateTenant } from "@/types/tenant.types";
import { AxiosError } from "axios";

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
