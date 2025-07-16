import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getAllEmployees } from "@/api/employee.api";
import SearchInput from "@/components/search-input";
import EditEmployeeModal from "./modals/edit-employee-modal";
import { EllipsisVertical } from "lucide-react";
import DataTable from "@/components/table";
import { formatDate } from "@/lib/utils";
import { updateEmployeeDetailsByTenant } from "@/api/tenant.api";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Employee } from "@/types/employee.types";

export default function Employee() {
  const [searchParams] = useSearchParams();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [employeeToEdit, setEmployeeToEdit] = useState<Employee | null>(null);

  const page = parseInt(searchParams.get("page") || "1", 10);
  const search = searchParams.get("search") || "";

  const queryClient = useQueryClient();

  // Fetch employees using useQuery
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["getAllEmployees", page, search],
    queryFn: () => {
      return getAllEmployees({ page, limit: 10, search });
    },
  });

  const handleEditClick = (employee: Employee) => {
    setEmployeeToEdit(employee);
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setEmployeeToEdit(null);
    setIsEditModalOpen(false);
  };

  // Mutation for updating employee details
  const { mutateAsync: updateEmployee, isPending: isUpdatingEmployee } =
    useMutation({
      mutationFn: updateEmployeeDetailsByTenant,
      onSuccess: () => {
        toast.success("Employee updated successfully");
        queryClient.invalidateQueries({ queryKey: ["getAllEmployees"] });
      },
      onError: (error: Error) => {
        toast.success("Something went wrong");
        console.error("Failed to update admin status:", error);
      },
    });

  const columns = [
    {
      header: "First Name",
      render: (row: any) => row?.firstname || "N/A",
    },
    {
      header: "Middle Name",
      render: (row: any) => row?.middlename || "N/A",
    },
    {
      header: "Surname",
      render: (row: any) => row?.surname || "N/A",
    },
    {
      header: "Email",
      render: (row: any) => row?.email || "N/A",
    },
    {
      header: "Gender",
      render: (row: any) => (
        <span className="capitalize">{row?.gender || "N/A"}</span>
      ),
    },
    {
      header: "Level",
      render: (row: any) => (row?.levelId ? row?.levelId?.name : "N/A"),
    },
    {
      header: "Joined",
      render: (row: any) => formatDate(row?.createdAt) || "N/A",
    },
    {
      header: "Action",
      render: (row: any) => (
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="p-2 text-gray-600 hover:bg-gray-200 rounded-full outline-none"
              aria-label="Open actions"
            >
              <EllipsisVertical />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-fit">
            <DropdownMenuItem
              className=" cursor-pointer hover:bg-gray-200"
              onClick={() => handleEditClick(row)}
            >
              Update
            </DropdownMenuItem>

            <DropdownMenuItem
              className=" cursor-pointer"
              onClick={() => {
                return null;
                updateEmployee({
                  _id: row?._id,
                  isAdmin: !row?.isAdmin,
                });
              }}
              disabled={isUpdatingEmployee}
            >
              {row?.isAdmin ? "Revoke Admin" : "Make Admin"}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Employees</h1>
        <div className="flex items-center gap-4">
          <SearchInput />
        </div>
      </div>
      <div className="overflow-x-auto">
        {isError ? (
          <div className="p-4 text-center text-red-500">
            Error: {error ? error.message : null}
          </div>
        ) : null}
        <DataTable
          columns={columns}
          data={data?.employees || []}
          isLoading={isLoading}
          noDataMessage="No employees found."
          pagination={data?.pagination}
        />
      </div>

      {isEditModalOpen && employeeToEdit && (
        <EditEmployeeModal
          isOpen={isEditModalOpen}
          onClose={closeEditModal}
          employee={employeeToEdit}
        />
      )}
    </div>
  );
}
