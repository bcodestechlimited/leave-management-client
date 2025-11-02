import { EmployeeLeaveBalance } from "./leave.types";

export interface IEmployee {
  _id: string;
  staffId: string;
  name: string;
  firstname: string;
  middlename: string;
  surname: string;
  gender: string;
  email: string;
  avatar: string;
  jobRole: string;
  branch: string;
  isOnLeave: boolean;
  isAdmin: boolean;
  accountType: "lineManager" | "employee";
  clientId: {
    name: string;
    logo: string;
    color: string;
  };
  lineManager: IEmployee;
  reliever: IEmployee;
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
  firstname: string;
  middlename: string;
  surname: string;
  email: string;
  lineManager: string | null;
  isOnLeave: boolean;
  reliever: string | null;
  file: File | null;
  avatar: File | null;
}
