import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import axiosInstance from "./axios.config";
import { Employee } from "@/types/employee.types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateString: string) {
  // Helper function to get the ordinal suffix
  function getOrdinalSuffix(day: number) {
    if (day > 3 && day < 21) return "th";
    switch (day % 10) {
      case 1:
        return "st";
      case 2:
        return "nd";
      case 3:
        return "rd";
      default:
        return "th";
    }
  }

  // Create a Date object from the ISO 8601 string
  const date = new Date(dateString);

  const day = date.getUTCDate();
  const monthName = date.toLocaleString("en-US", { month: "long" });
  const year = date.getUTCFullYear();
  const dayWithSuffix = `${day}${getOrdinalSuffix(day)}`;

  return `${dayWithSuffix} ${monthName} ${year}`;
}

export const handleFetchLevels = async (search: string) => {
  try {
    const response = await axiosInstance.get(
      `/level?search=${encodeURIComponent(search)}&limit=5`
    );

    const levels = response?.data?.data?.levels;

    return levels?.map((item: { _id: string; name: string }) => ({
      value: item._id,
      label: item.name,
    }));
  } catch {
    return [];
  }
};

export const handleFetchEmployees = async (search: string) => {
  try {
    const response = await axiosInstance.get(
      `/employee?search=${encodeURIComponent(
        search
      )}&limit=5&accountType=employee`
    );
    const employees = response?.data?.data?.employees;

    return employees.map((employee: Employee) => {
      const names = [employee.firstname, employee.middlename, employee.surname]
        .filter(Boolean) // remove null/undefined middlename
        .join(" ");

      return {
        value: employee._id,
        label: names || employee.email, // fallback to email if no names
      };
    });
  } catch {
    return [];
  }
};

export const handleFetchLineManagers = async (search: string) => {
  try {
    const response = await axiosInstance.get(
      `/employee?search=${encodeURIComponent(
        search
      )}&limit=5&accountType=lineManager`
    );
    const employees = response?.data?.data?.employees;

    return employees.map((employee: Employee) => {
      const names = [employee.firstname, employee.middlename, employee.surname]
        .filter(Boolean)
        .join(" ");

      return {
        value: employee._id,
        label: names || employee.email,
      };
    });
  } catch {
    return [];
  }
};

export const handleFetchBalances = async (search: string) => {
  try {
    const response = await axiosInstance.get(
      `/leave/balance?search=${encodeURIComponent(search)}&limit=5`
    );

    const leaveBalance = response?.data?.data?.leaveBalance;

    return leaveBalance?.map(
      (item: {
        leaveTypeId: string;
        balance: string;
        leaveTypeDetails: { name: string };
      }) => ({
        value: item.leaveTypeId,
        label: `${item.leaveTypeDetails.name} - ${item.balance} days left`,
      })
    );
  } catch {
    return [];
  }
};

export function getStatusClasses(status: string | undefined | null) {
  if (typeof status === "undefined" || !status) {
    return "bg-gray-100 text-gray-800";
  }

  switch (status.toLowerCase()) {
    case "approved":
      return "bg-green-100 text-green-800";
    case "accepted":
      return "bg-green-100 text-green-800";
    case "pending":
      return "bg-yellow-100 text-yellow-800";
    case "rejected":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
}

export function capitalizeWords(str: string): string {
  return str
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export const getEmployeeFullName = (employee: Employee) => {
  if (!employee) return "N/A";
  const { firstname, middlename, surname } = employee;
  return [firstname, middlename, surname].filter(Boolean).join(" ");
};
