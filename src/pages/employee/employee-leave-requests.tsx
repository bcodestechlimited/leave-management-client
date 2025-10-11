import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { formatDate, getStatusClasses } from "@/lib/utils";
import { useState } from "react";
import { toast } from "sonner";
import LeaveRequestActionModal from "./modals/leave-request-action-modal";
import LeaveRequestDetailModal from "./modals/leave-request-detail-modal";
import { fetchManagerLeaveRequest, updateLeaveRequest } from "@/api/leave.api";
import { Leave } from "@/types/leave.types";
import { Link, useSearchParams } from "react-router-dom";
import { Eye } from "lucide-react";
import DataTable from "@/components/table";
import SearchInput from "@/components/search-input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const options = [
  {
    value: "all",
    label: "All",
  },
  {
    value: "pending",
    label: "Pending",
  },
  {
    value: "approved",
    label: "Approved",
  },
  {
    value: "rejected",
    label: "Rejected",
  },
];

export default function EmployeeLeaveRequests() {
  const [selectedLeave, setSelectedLeave] = useState<Leave | null>(null);
  const [isActionModalOpen, setIsActionModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  const [searchParams, setSearchParams] = useSearchParams();

  const page = parseInt(searchParams.get("page") || "1", 10);
  const search = searchParams.get("search") || "";
  const limit = parseInt(searchParams.get("limit") || "10", 10);
  const status = searchParams.get("status") || "all";

  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["lineManagerLeaves", { page, limit, search, status }],
    queryFn: () => fetchManagerLeaveRequest({ page, limit, search, status }),
  });

  const columns = [
    {
      header: "Employee",
      render: (row: any) => row?.employee?.firstname || "N/A",
    },
    {
      header: "Line Manager",
      render: (row: any) => row?.lineManager?.firstname || "N/A",
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

  const handleStatusChange = async (newStatus: string) => {
    setSearchParams((prev: URLSearchParams) => {
      const params = new URLSearchParams(prev);
      if (newStatus === "all") {
        params.delete("status");
      } else {
        params.set("status", newStatus);
      }
      params.set("page", "1");
      return params;
    });
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-lg font-semibold">Line Manager Leave Requests</h1>
      </div>

      <div className="flex gap-4 items-center justify-end pb-4">
        <SearchInput />
        <Select value={status} onValueChange={handleStatusChange}>
          <SelectTrigger className="w-fit flex gap-2">
            <SelectValue placeholder={"Status"} />
          </SelectTrigger>
          <SelectContent>
            {options.map((option) => (
              <SelectItem
                className="cursor-pointer"
                key={option.value}
                value={option.value}
              >
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <DataTable
        columns={columns}
        data={data?.leaveRequests || []}
        isLoading={isLoading}
        noDataMessage="No leave requests found."
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
