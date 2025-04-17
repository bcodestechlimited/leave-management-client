import { create } from "zustand";
import { TenantSetFunction, TenantState } from "@/types/tenant.types";

const actions = (set: TenantSetFunction) => ({
  setTenant: async (tenant: any) => {
    set((state: TenantState) => ({
      ...state,
      tenant,
    }));
  },
});

// Create Zustand Store with type checking for state
export const useTenantStore = create<TenantState>((set) => ({
  tenant: null,
  isLoading: false,
  isFetchingTenant: false,
  actions: actions(set),
}));

// Custom hook to access actions from the store
export const useTenantActions = () => useTenantStore((state) => state.actions);
