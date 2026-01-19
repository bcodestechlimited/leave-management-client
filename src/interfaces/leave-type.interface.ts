import { IClient } from "./client.interface";

export default interface ILeaveType {
  clientId: IClient | string;
  name: string;
  levelId: string;
  defaultBalance: number;
  isActive: boolean;
}
