import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { formatDate, getStatusClasses } from "@/lib/utils";
import { useState } from "react";
import { toast } from "sonner";
import LeaveRequestActionModal from "./modals/leave-request-action-modal";
import LeaveRequestDetailModal from "./modals/leave-request-detail-modal";
import { fetchManagerLeaveRequest, updateLeaveRequest } from "@/api/leave.api";
import { Leave } from "@/types/leave.types";
import { Link } from "react-router-dom";
import { Eye } from "lucide-react";
import DataTable from "@/components/table";

export default function EmployeeLeaveRequests() {
  const [selectedLeave, setSelectedLeave] = useState<Leave | null>(null);
  const [isActionModalOpen, setIsActionModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["lineManagerLeaves"],
    queryFn: fetchManagerLeaveRequest,
  });

  const columns = [
    {
      header: "Name",
      render: (row: any) => row.employee?.name || row.employee?.email || "N/A",
    },
    {
      header: "Line Manager",
      accessor: "lineManager.name",
      render: (row: any) =>
        row.lineManager?.name || row.lineManager?.email || "N/A",
    },
    {
      header: "Start Date",
      render: (row: any) => {
        return <span>{formatDate(row.startDate)}</span>;
      },
    },
    {
      header: "Resumption Date",
      render: (row: any) => {
        return <span>{formatDate(row.resumptionDate)}</span>;
      },
    },
    {
      header: "Status",
      render: (row: any) => (
        <span className={`capitalize p-2 ${getStatusClasses(row.status)}`}>
          {row.status}
        </span>
      ),
    },
    {
      header: "Action",
      render: (row: any) => (
        <div className="flex gap-2">
          <Link to={`/dashboard/employee/leave/leave-request/${row._id}`}>
            <Eye />
          </Link>
        </div>
      ),
    },
  ];

  const leaveActionMutation = useMutation({
    mutationFn: updateLeaveRequest,
    onSuccess: () => {
      toast.success("Leave request updated successfully");
      setIsActionModalOpen(false);
      queryClient.invalidateQueries({ queryKey: ["lineManagerLeaves"] });
    },
    onError: (error) => {
      if (error instanceof Error) {
        return toast.error(error.message);
      }
      toast.error("Failed to update leave request");
    },
  });

  const handleAction = async (data: {
    status: "approved" | "rejected";
    reason: string;
  }) => {
    if (!selectedLeave) return;

    leaveActionMutation.mutate({
      leaveId: selectedLeave._id,
      status: data.status,
      reason: data.reason,
    });
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-lg font-semibold">Line Manager Leave Requests</h1>
      </div>

      <DataTable
        columns={columns}
        data={data?.leaveRequests || []}
        isLoading={isLoading}
        noDataMessage="No leaves found."
        pagination={data?.pagination}
      />

      {selectedLeave && (
        <LeaveRequestActionModal
          isOpen={isActionModalOpen}
          onClose={() => {
            setIsActionModalOpen(false);
            setSelectedLeave(null);
          }}
          onSubmit={handleAction}
          isSubmitting={leaveActionMutation.isPending}
          leaveRequest={selectedLeave}
        />
      )}

      <LeaveRequestDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false);
          setSelectedLeave(null);
        }}
        leaveRequest={selectedLeave}
      />
    </div>
  );
}
