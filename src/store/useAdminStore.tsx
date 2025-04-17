import { create } from "zustand";
import { toast } from "sonner";
import axiosInstance from "@/lib/axios.config";
import { isAxiosError } from "axios";
import { NavigateFunction } from "react-router-dom";

interface AdminState {
  admin: any;
  tenants: any[];
  isFetchingAdmin: boolean;
  isLoading: boolean;
  isSubmitting: boolean;
  pagination: {
    totalCount: number;
    totalPages: number;
    currentPage: number;
    perPage: number;
  };
  actions: {
    loginAdmin: (
      data: Record<string, any>,
      onSuccess?: () => void
    ) => Promise<void>;
    getAdmin: (
      navigate: NavigateFunction,
      onSuccess?: () => void
    ) => Promise<void>;
    logout: (navigate: NavigateFunction, onSuccess?: () => void) => void;
    getTenants: (params: {
      page?: number | string;
      limit?: number | string;
      [key: string]: any;
    }) => Promise<void>;
    addTenant: (
      tenantData: Record<string, any>,
      onSuccess?: () => void
    ) => Promise<void>;
    setAdmin: (data: Record<string, any>) => Promise<void>;
  };
}

interface SetFunction {
  (
    state: Partial<AdminState> | ((state: AdminState) => Partial<AdminState>)
  ): void;
}

const actions = (set: SetFunction) => ({
  loginAdmin: async (data: Record<string, any>, onSuccess?: () => void) => {
    set({ isSubmitting: true });
    try {
      const response = await axiosInstance.post(`/admin/auth/login`, data);
      const token = response?.data?.data?.token;
      const admin = response?.data?.data?.admin;

      localStorage.setItem("token", token);

      set((state: AdminState) => ({
        ...state,
        admin,
        isSubmitting: false,
      }));

      toast.success(`Login successful`);
      if (onSuccess) {
        onSuccess();
      }
    } catch (error: unknown) {
      console.log(error);
      set({ isSubmitting: false });
      if (isAxiosError(error)) {
        toast.error(error.response?.data?.message || "Failed to log in ");
      } else {
        toast.error("Failed to log in");
      }
    }
  },
  getAdmin: async (navigate: NavigateFunction, onSuccess?: () => void) => {
    set({ isFetchingAdmin: true });
    try {
      const response = await axiosInstance.get(`/admin/auth`);
      const admin = response?.data?.data?.user;

      console.log("Admin Details:", admin);

      set((state: AdminState) => ({
        ...state,
        admin,
        isFetchingAdmin: false,
      }));

      if (onSuccess) {
        onSuccess();
      }
    } catch (error: unknown) {
      console.log(error);
      set({ admin: null, isFetchingAdmin: false });
      navigate(`/admin/login`);
    } finally {
      set({ isFetchingAdmin: false });
    }
  },
  setAdmin: async (data: Record<string, any>) => {
    set((state: AdminState) => ({
      ...state,
      admin: data,
    }));
  },
  logout: (navigate: NavigateFunction, onSuccess?: () => void) => {
    localStorage.removeItem("token");

    set((state: AdminState) => ({
      ...state,
      admin: null,
    }));

    navigate(`/admin/login`);
    toast.success("Logged out successfully");

    if (onSuccess) {
      onSuccess();
    }
  },
  getTenants: async (
    params: {
      page?: number | string;
      limit?: number | string;
      [key: string]: any;
    } = {}
  ) => {
    set({ isLoading: true });
    try {
      const response = await axiosInstance.get(`/admin/tenant/`, { params });
      const tenants = response?.data?.data?.tenants;

      console.log("Tenant Details:", tenants);

      set((state: AdminState) => ({
        ...state,
        tenants,
        isLoading: false,
      }));
    } catch (error: unknown) {
      console.log(error);
      set({ isLoading: false });
      if (isAxiosError(error)) {
        toast.error(error.response?.data?.message || "Failed to fetch tenants");
      } else {
        toast.error("Failed to fetch tenants");
      }
    } finally {
      set({ isLoading: false });
    }
  },
  addTenant: async (
    tenantData: Record<string, any>,
    onSuccess?: () => void
  ) => {
    set({ isSubmitting: true });
    try {
      await axiosInstance.post(`/admin/tenant`, tenantData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      set((state: AdminState) => ({
        ...state,
        isSubmitting: false,
      }));

      toast.success("Tenant added successfully");
      if (onSuccess) {
        onSuccess();
      }
    } catch (error: unknown) {
      console.log(error);
      set({ isSubmitting: false });
      if (isAxiosError(error)) {
        toast.error(error.response?.data?.message || "Failed to add tenant");
      } else {
        toast.error("Failed to add tenant");
      }
    }
  },
});

// Create Zustand Store with type checking for state
export const useAdminStore = create<AdminState>((set) => ({
  admin: {},
  tenants: [],
  isFetchingAdmin: false,
  isSubmitting: false,
  isLoading: false,
  pagination: {
    totalCount: 0,
    totalPages: 0,
    currentPage: 0,
    perPage: 0,
  },
  actions: actions(set),
}));

// Custom hook to access actions from the store
export const useAdminActions = () => useAdminStore((state) => state.actions);
