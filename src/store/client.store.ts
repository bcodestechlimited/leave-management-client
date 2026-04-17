// stores/useClientStore.ts
import { create } from "zustand";

interface ClientStore {
  clientId: string;
  setClientId: (id: string) => void;
}

export const useClientStore = create<ClientStore>((set) => ({
  clientId: localStorage.getItem("client-id") || "",
  setClientId: (id) => {
    localStorage.setItem("client-id", id);
    set({ clientId: id });
  },
}));
