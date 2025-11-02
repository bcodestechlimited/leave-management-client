import { IAdminUser } from "@/interfaces/user.interface";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface AuthCredentials {
  email: string;
  password: string;
}

export interface AdminState {
  admin: IAdminUser | null;
  authCredentials: AuthCredentials | null;
  actions: {
    setAdmin: (admin: IAdminUser | null) => Promise<void>;
    setAuthCredentials: (creds: AuthCredentials | null) => void;
  };
}

const actions = (
  set: (
    state: Partial<AdminState> | ((state: AdminState) => Partial<AdminState>)
  ) => void
) => ({
  setAdmin: async (admin: IAdminUser | null) => {
    set({ admin });
  },
  setAuthCredentials: (creds: AuthCredentials | null) => {
    set({ authCredentials: creds });
  },
});

// Create Zustand Store with type checking for state
// export const useAuthStore = create<AdminState>((set) => ({
//   admin: null,
//   actions: actions(set),
// }));

export const useAdminStore = create<AdminState>()(
  persist(
    (set) => ({
      admin: null,
      authCredentials: null,
      actions: actions(set),
    }),
    {
      name: "auth-store",
      // storage: sessionStorage, // 💡 safer than localStorage
      storage: createJSONStorage(() => sessionStorage), // (optional) by default, 'localStorage' is used
      partialize: (state) => ({
        authCredentials: state.authCredentials, // only store credentials (if needed)
      }),
    }
  )
);

export const useAdminActions = () => {
  const { actions } = useAdminStore();
  return actions;
};
