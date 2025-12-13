import { useState } from "react";
import { Button } from "@/components/ui/button";
import { EllipsisVertical, PlusCircle } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { editLeaveType, getLeaveTypes } from "@/api/leave.api";
import { useSearchParams } from "react-router-dom";
import DataTable from "@/components/table";
import EditLeaveTypeModal from "./_modals/edit-leave-type-modal";
import AddLeaveTypeModal from "./_modals/add-leave-type-modal";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import SwitchTenants from "../_components/switch-tenants";

interface LeaveType {
  _id: string;
  name: string;
  defaultBalance: number;
  levelId: string;
}

interface DetailedLeaveType extends Omit<LeaveType, "levelId"> {
  levelId: {
    _id: string;
    name: string;
  };
}

export default function AdminLeaveTypes() {
  const [clientId, setClientId] = useState<string>(
    () => localStorage.getItem("client-id") || ""
  );
  const [searchParams] = useSearchParams();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedLeaveType, setSelectedLeaveType] =
    useState<DetailedLeaveType | null>(null);

  const page = parseInt(searchParams.get("page") || "1", 10);
  const search = searchParams.get("search") || "";

  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["leaveTypes", { page, limit: 10, search, clientId }],
    queryFn: () => getLeaveTypes({ page, limit: 10, search }),
  });

  console.log({ data });

  const openAddModal = () => setIsAddModalOpen(true);
  const closeAddModal = () => setIsAddModalOpen(false);

  const openEditModal = (leaveType: DetailedLeaveType) => {
    setSelectedLeaveType(leaveType);
    setIsEditModalOpen(true);
  };
  const closeEditModal = () => {
    setSelectedLeaveType(null);
    setIsEditModalOpen(false);
  };

  const editMutation = useMutation({
    mutationFn: editLeaveType,
    onSuccess: () => {
      toast.success("Leave Type updated successfully");
      queryClient.invalidateQueries({ queryKey: ["leaveTypes"] });
    },
    onError: (error) => {
      toast.error("Something went wrong");
      console.error("Failed to update leave type", error);
    },
  });

  const handleToggle = async (payload: { _id: string; isActive: boolean }) => {
    await editMutation.mutateAsync(payload);
  };

  const columns = [
    {
      header: "Leave Name",
      render: (row: any) => (
        <span className="capitalize">{row?.name || "N/A"}</span>
      ),
    },
    {
      header: "Balance",
      render: (row: any) => `${row?.defaultBalance} days` || "N/A",
    },
    {
      header: "In",
      render: (row: any) => (
        <span className=" capitalize">
          {row?.levelId ? row?.levelId?.name : "N/A"}
        </span>
      ),
    },
    {
      header: "Active",
      render: (row: any) => {
        const className = row?.isActive
          ? "text-green-500 bg-green-100 px-3 py-1 rounded-full"
          : "text-red-500";
        return (
          <span className={cn("capitalize", className)}>
            {row?.isActive ? "Active" : "Inactive"}
          </span>
        );
      },
    },
    {
      header: "Action",
      render: (row: any) => {
        const className = !row?.isActive
          ? "text-green-500 hover:bg-green-200"
          : "text-red-500 hover:bg-red-200";
        return (
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
                onClick={() => openEditModal(row)}
              >
                Edit
              </DropdownMenuItem>

              <DropdownMenuItem
                className={cn(`cursor-pointer`, className)}
                onClick={() => {
                  handleToggle({
                    _id: row?._id,
                    isActive: !row?.isActive,
                  });
                }}
              >
                {row?.isActive ? "Deactivate" : "Activate"}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];
  return (
    <div>
      <SwitchTenants clientId={clientId} setClientId={setClientId} />

      <div className="py-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-lg font-semibold">Leave Types</h1>
          <Button onClick={openAddModal}>
            <PlusCircle size={16} className="mr-2" />
            Add Leave Type
          </Button>
        </div>

        <DataTable
          columns={columns}
          data={data?.leaveTypes || []}
          isLoading={isLoading}
          noDataMessage="No leave type found."
          pagination={data?.pagination}
        />

        <AddLeaveTypeModal isOpen={isAddModalOpen} onClose={closeAddModal} />

        {selectedLeaveType && (
          <EditLeaveTypeModal
            isOpen={isEditModalOpen}
            onClose={closeEditModal}
            leaveType={selectedLeaveType}
          />
        )}
      </div>
    </div>
  );
}
