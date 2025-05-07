import { EmployeeLeaveBalance } from "./leave.types";

export interface Employee {
  _id: string;
  name: string;
  firstname: string;
  middlename: string;
  surname: string;
  gender: string;
  email: string;
  avatar: string;
  jobRole: string;
  isOnLeave: boolean;
  isAdmin: boolean;
  accountType: "lineManager" | "employee";
  tenantId: {
    name: string;
    logo: string;
    color: string;
  };
  lineManager: Employee;
  reliever: Employee;
  levelId: {
    _id: string;
    name: string;
  };
  documents: [
    {
      _id: string;
      url: string;
      fileType: string;
    }
  ];
  leaveBalances: EmployeeLeaveBalance[];
}

export interface UpdateEmployee {
  name: string | null;
  email: string;
  lineManager: string | null;
  isOnLeave: boolean;
  reliever: string | null;
  file: File | null;
  avatar: File | null;
}

export interface EmployeeState {
  employee: Employee | null;
  actions: {
    setAuthEmployee: (employee: Employee | null) => Promise<void>;
    getAuthEmployee: () => Promise<void>;
  };
}

export interface EmployeeSetFunction {
  (
    state:
      | Partial<EmployeeState>
      | ((state: EmployeeState) => Partial<EmployeeState>)
  ): void;
}
