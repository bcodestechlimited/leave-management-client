export interface IUser {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  avatar: string;
  phoneNumber: string;
  document: { type: string; url: string }[] | null;
  roles: string[];
  isVerified: boolean;
  isActive: boolean;
}

export interface IAdminUser {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  avatar: string;
  phoneNumber: string;
  document: { type: string; url: string }[] | null;
  roles: string[];
  isVerified: boolean;
  isActive: boolean;
}

export interface IEmployeeUser {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  avatar: string;
  phoneNumber: string;
  document: { type: string; url: string }[] | null;
  roles: string[];
  isVerified: boolean;
  isActive: boolean;
}
