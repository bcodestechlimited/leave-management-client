import { getEmployeeForAdmin } from "@/api/employee.api";
import { IEmployee } from "@/types/employee.types";
import { useQuery } from "@tanstack/react-query";

export function useAdminEmployee(clientId: string, employeeId: string) {
  return useQuery<{ employee: IEmployee }, Error>({
    queryKey: ["admin-employee", employeeId, clientId],
    queryFn: () => getEmployeeForAdmin(employeeId),
    enabled: !!clientId && !!employeeId,
  });
}
