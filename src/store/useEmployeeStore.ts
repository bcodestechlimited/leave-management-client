import { create } from "zustand";
import {
  Employee,
  EmployeeSetFunction,
  EmployeeState,
} from "@/types/employee.types";
import { getLoggedInEmployee } from "@/api/employee.api";

const actions = (set: EmployeeSetFunction) => ({
  setAuthEmployee: async (employee: Employee | null) => {
    set((state: EmployeeState) => ({
      ...state,
      employee,
    }));
  },
  getAuthEmployee: async () => {
    try {
      const { employee, leaveBalances } = await getLoggedInEmployee(
        actions(set).setAuthEmployee
      );
      set((state: EmployeeState) => ({
        ...state,
        employee: { ...employee, leaveBalances },
      }));
    } catch (error: unknown) {
      console.log(error);
    }
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
