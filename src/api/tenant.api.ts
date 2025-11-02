import axiosInstance from "@/lib/axios.config";
import { useClientStore } from "@/store/use-client-store";
import { Params } from "@/types/params.types";
import { UpdateClient } from "@/types/tenant.types";
import { AxiosError } from "axios";
import { NavigateFunction } from "react-router-dom";

export const updateEmployeeDetailsByTenant = async (payload: any) => {
  console.log(payload);

  try {
    const response = await axiosInstance.put(
      `/tenant/employee/${payload._id}`,
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

export const deleteEmployeeByTenant = async (employeeId: string) => {
  try {
    const response = await axiosInstance.delete(
      `/tenant/employee/${employeeId}`
    );
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(
        error.response?.data?.message || "Failed to delete employee"
      );
    }
    throw error;
  }
};

//Invites
export const fetchAllInvites = async (params: Params) => {
  try {
    const response = await axiosInstance.get(`/link`, { params });

    console.log({ response });

    const links = response.data?.data?.links;
    const pagination = response.data?.data?.pagination;

    return { links, pagination };
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch invite links"
      );
    }
    throw error;
  }
};

export const sendInviteLink = async (payload: any) => {
  try {
    const response = await axiosInstance.post(`/employee/invite`, payload);

    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(
        error.response?.data?.message || "Failed to send invite link"
      );
    }
    throw error;
  }
};

export const bulkInvite = async (payload: any) => {
  try {
    const response = await axiosInstance.post(
      `/employee/bulk-invite`,
      payload,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
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

//Auth Actions
export const clientLogin = async (payload: any) => {
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
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data?.message || "Client ID Incorrect");
    }
    throw error;
  }
};

export const updateClientProfile = async (payload: UpdateClient) => {
  console.log(payload);

  try {
    const response = await axiosInstance.put(`/client/auth`, payload, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data?.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(
        error.response?.data?.message || "Failed to update client profile"
      );
    }
    throw error;
  }
};

export const getAuthTenant = async (
  navigate: NavigateFunction,
  updateTenant: (tenant: any) => void
) => {
  try {
    const response = await axiosInstance.get(`/tenant/auth`);
    const tenant = response.data?.data?.tenant;
    updateTenant(tenant);
    return response.data?.data;
  } catch (error) {
    navigate("/client/login");
    throw error;
  }
};

export const tenantSendPasswordResetLink = async (payload: {
  email: string;
}) => {
  console.log(payload);

  try {
    const response = await axiosInstance.post(
      `/tenant/auth/forgot-password`,
      payload
    );
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(
        error.response?.data?.message || "Failed to send password reset link"
      );
    }
    throw error;
  }
};

export const tenantResetPassword = async (payload: {
  token: string;
  password: string;
}) => {
  console.log(payload);

  try {
    const response = await axiosInstance.post(
      `/tenant/auth/reset-password`,
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

//Public
export const validateClientId = async (payload: { clientId: string }) => {
  try {
    const response = await axiosInstance.get(`/client/${payload.clientId}`);
    return response.data?.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data?.message || "Client ID Incorrect");
    }
    throw error;
  }
};
