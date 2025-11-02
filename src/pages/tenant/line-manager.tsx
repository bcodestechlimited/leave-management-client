import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { deleteLineManager, getAllLineManagers } from "@/api/employee.api";
import SearchInput from "@/components/search-input";
import EditEmployeeModal from "./modals/edit-employee-modal";
import { EllipsisVertical } from "lucide-react";
import DataTable from "@/components/table";
import { formatDate } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import AddLineManagerModal from "./modals/add-line-manager";
import { toast } from "sonner";
import { IEmployee } from "@/types/employee.types";

export default function LineManagers() {
  const [searchParams] = useSearchParams();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [employeeToEdit, setEmployeeToEdit] = useState<IEmployee | null>(null);
  const [isAddManagerModalOpen, setIsAddManagerModalOpen] = useState(false);

  const [employeeToDelete, setEmployeeToDelete] = useState<IEmployee | null>(
    null
  );

  const page = parseInt(searchParams.get("page") || "1", 10);
  const search = searchParams.get("search") || "";

  const queryClient = useQueryClient();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["getAllLineManagers", page, search],
    queryFn: () => {
      return getAllLineManagers({ page, limit: 10, search });
    },
  });

  const handleEditClick = (employee: IEmployee) => {
    setEmployeeToEdit(employee);
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setEmployeeToEdit(null);
    setIsEditModalOpen(false);
  };

  const closeAddManagerModal = () => {
    setIsAddManagerModalOpen(false);
  };

  const {
    mutateAsync: deleteLineManagerMutation,
    isPending: isDeletingEmployee,
  } = useMutation({
    mutationFn: deleteLineManager,
    onSuccess: () => {
      toast.success("Employee deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["getAllLineManagers"] });
      setEmployeeToDelete(null);
    },
    onError: (error: Error) => {
      toast.error(error.message);
      console.error("Failed to delete employee:", error);
    },
  });

  const confirmDeleteEmployee = async () => {
    if (!employeeToDelete) return;

    await deleteLineManagerMutation({
      _id: employeeToDelete._id,
      isAdmin: employeeToDelete.isAdmin,
    });
  };

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
      render: (row: any) => row.gender || "N/A",
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
              className="cursor-pointer hover:bg-gray-200"
              onClick={() => handleEditClick(row)}
            >
              Update
            </DropdownMenuItem>

            <DropdownMenuItem
              className="cursor-pointer hover:bg-gray-200 hover:text-red-500 text-red-500"
              onClick={() => setEmployeeToDelete(row)}
              disabled={isDeletingEmployee}
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Line Managers</h1>
        <div className="flex items-center gap-4">
          <Button onClick={() => setIsAddManagerModalOpen(true)}>
            Add Line Manager
          </Button>
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
          noDataMessage="No line managers found."
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

      <AddLineManagerModal
        isOpen={isAddManagerModalOpen}
        onClose={closeAddManagerModal}
      />

      {/* Delete Confirmation Modal */}
      {employeeToDelete && (
        <ConfirmationModal
          title="Delete Line Manager"
          description="Are you sure you want to delete this line manager? This action cannot be undone."
          isOpen={!!employeeToDelete}
          onConfirm={confirmDeleteEmployee}
          onCancel={() => setEmployeeToDelete(null)}
          isLoading={isDeletingEmployee}
        />
      )}
    </div>
  );
}

//

interface ConfirmationModalProps {
  isOpen: boolean;
  title: string;
  description: string;
  onConfirm: () => void;
  onCancel: () => void;
  isLoading?: boolean;
}

function ConfirmationModal({
  isOpen,
  title,
  description,
  onConfirm,
  onCancel,
  isLoading,
}: ConfirmationModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onCancel}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex justify-end gap-2 pt-4">
          <Button variant="ghost" onClick={onCancel} disabled={isLoading}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={onConfirm}
            disabled={isLoading}
          >
            {isLoading ? "Deleting..." : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
