import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getAllEmployees } from "@/api/employee.api";
import SearchInput from "@/components/search-input";
import EditEmployeeModal from "./modals/edit-employee-modal";
import { Eye } from "lucide-react";
import DataTable from "@/components/table";
import { formatDate } from "@/lib/utils";
import { updateEmployeeDetailsByTenant } from "@/api/tenant.api";
import { toast } from "sonner";

interface Employee {
  _id: string;
  name: string;
  email: string;
  jobRole: string;
  levelId: {
    _id: string;
    name: string;
  };
  createdAt: string;
  isAdmin: boolean;
}

export default function Employee() {
  const [searchParams] = useSearchParams();
  // const [selectedEmployees, setSelectedEmployees] = useState<string[]>([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false); // Manage modal state
  const [employeeToEdit, setEmployeeToEdit] = useState<Employee | null>(null); // Store employee to edit

  const page = parseInt(searchParams.get("page") || "1", 10);
  const search = searchParams.get("search") || "";
  const queryClient = useQueryClient();

  // Fetch employees using useQuery
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["getAllEmployees", page, search],
    queryFn: () => getAllEmployees({ page, limit: 10, search }),
  });

  const handleEditClick = (employee: Employee) => {
    setEmployeeToEdit(employee);
    setIsEditModalOpen(true); // Open modal when edit button is clicked
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
      header: "Name",
      render: (row: any) => row?.name || "N/A",
    },
    {
      header: "Email",
      render: (row: any) => row?.email || "N/A",
    },
    {
      header: "Role",
      render: (row: any) => row.jobRole || "N/A",
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
        <div className="flex gap-2">
          <Button
            onClick={() => {
              updateEmployee({
                _id: row?._id,
                isAdmin: !row?.isAdmin,
              });
            }}
            disabled={isUpdatingEmployee}
            variant={row?.isAdmin ? "destructive" : "default"}
            size="sm"
          >
            {row?.isAdmin ? "Revoke Admin" : "Make Admin"}
          </Button>
          <Button
            onClick={() => handleEditClick(row)}
            variant="outline"
            size="sm"
          >
            Update
          </Button>
          <Button variant="outline" size="sm">
            <Link to={`/dashboard/tenant/employee/${row?._id}`}>
              <Eye />
            </Link>
          </Button>
        </div>
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
          onClose={() => setIsEditModalOpen(false)}
          employee={employeeToEdit}
        />
      )}
    </div>
  );
}
