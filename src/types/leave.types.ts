export interface LeaveState {
  leaves: Record<string, any>[];
  leaveTypes: Record<string, any>[];
  leaveBalance: Record<string, any>[];
  isFetching: boolean;
  isSubmitting: boolean;
  actions: {
    getLeaveBalance: () => Promise<void>;
  };
}

export interface LeaveSetFunction {
  (
    state: Partial<LeaveState> | ((state: LeaveState) => Partial<LeaveState>)
  ): void;
}

export interface ApplyLeaveFormData {
  leaveTypeId: string;
  startDate: Date | string;
  resumptionDate: Date | string;
  duration: number;
  reason: string;
}

export interface Leave {
  _id: string;
  employee: {
    _id: string;
    name: string;
    email: string;
  };
  lineManager: {
    _id: string;
    name: string;
    email: string;
  };
  leaveType: {
    _id: string;
    name: string;
  };
  approvalCount: number;
  status: string;
  duration: string;
  startDate: string;
  resumptionDate: string;
  reason: string;
  rejectionReason: string;
}

export interface EmployeeLeaveBalance {
  leaveTypeId: string;
  balance: {
    leaveTypeDetails: {
      _id: string;
      name: string;
      defaultBalance: number;
    };
    balance: number;
  };
}
