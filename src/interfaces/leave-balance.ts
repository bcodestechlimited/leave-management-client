export default interface ILeaveBalance {
  _id: string;
  balance: number;
  leaveType: {
    _id: string;
    name: string;
    defaultBalance: number;
  };
}
