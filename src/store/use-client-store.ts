import { ClientSetFunction, ClientState } from "@/types/tenant.types";
import { create } from "zustand";

const actions = (set: ClientSetFunction) => ({
  setClient: async (client: any) => {
    set((state: ClientState) => ({
      ...state,
      client,
    }));
  },
});

// Create Zustand Store with type checking for state
export const useClientStore = create<ClientState>((set) => ({
  client: null,
  isLoading: false,
  isFetchingTenant: false,
  actions: actions(set),
}));

// Custom hook to access actions from the store
export const useClientActions = () => useClientStore((state) => state.actions);
