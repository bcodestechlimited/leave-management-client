import { IClient } from "./client.interface";

export interface IEmployee {
  clientId: IClient;
  staffId: string | null;
  firstname: string;
  middlename: string;
  surname: string;
  gender: "male" | "female";
  accountType: "employee" | "lineManager";
  name?: string;
  username?: string;
  email: string;
  password: string | undefined;
  avatar: string;
  jobRole: string;
  branch: string;
  documents?: {
    _id: string;
    url: string;
    fileType: "image" | "document";
  }[];
  isOnLeave?: boolean;
  isAdmin?: boolean;
  isActive?: boolean;
  isEmailVerified?: boolean;
  lineManager?: IEmployee | null;
  reliever?: IEmployee | null;
  levelId?: string | null;
  atsInfo?: Record<string, any>;

  createdAt?: Date;
  updatedAt?: Date;
}
