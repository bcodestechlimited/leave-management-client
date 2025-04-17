import { useState } from "react";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import AddLeaveTypeModal from "./modals/add-leave-type-modal";
import EditLeaveTypeModal from "./modals/edit-leave-type-modal";
import { useQuery } from "@tanstack/react-query";
import { getLeaveTypes } from "@/api/leave.api";
import { useSearchParams } from "react-router-dom";
import DataTable from "@/components/table";

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

export default function LeaveTypes() {
  const [searchParams] = useSearchParams();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedLeaveType, setSelectedLeaveType] =
    useState<DetailedLeaveType | null>(null);

  const page = parseInt(searchParams.get("page") || "1", 10);
  const search = searchParams.get("search") || "";

  const { data, isLoading } = useQuery({
    queryKey: ["leaveTypes", { page, limit: 10, search }],
    queryFn: () => getLeaveTypes({ page, limit: 10, search }),
  });

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
      accessor: "levelId",
      render: (row: any) => (
        <span className=" capitalize">
          {row?.levelId ? row?.levelId?.name : "N/A"}
        </span>
      ),
    },
    {
      header: "Action",
      render: (row: any) => (
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => openEditModal(row)}
          >
            Edit
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="p-4">
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
  );
}
