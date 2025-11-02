import { create } from "zustand";
import { IEmployee } from "@/types/employee.types";

export interface EmployeeState {
  employee: IEmployee | null;
  actions: {
    setEmployee: (employee: IEmployee | null) => Promise<void>;
  };
}

export interface EmployeeSetFunction {
  (
    state:
      | Partial<EmployeeState>
      | ((state: EmployeeState) => Partial<EmployeeState>)
  ): void;
}

const actions = (set: EmployeeSetFunction) => ({
  setEmployee: async (employee: IEmployee | null) => {
    set((state: EmployeeState) => ({
      ...state,
      employee,
    }));
  },
});

// Create Zustand Store with type checking for state
export const useEmployeeStore = create<EmployeeState>((set) => ({
  employee: null,
  actions: actions(set),
}));

// Custom hook to access actions from the store
export const useEmployeeActions = () =>
  useEmployeeStore((state) => state.actions);
