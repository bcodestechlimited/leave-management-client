import { useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getLeaveDetail, updateLeaveRequest } from "@/api/leave.api";
import { formatDate, getStatusClasses } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Leave } from "@/types/leave.types";
import LeaveRequestActionModal from "./modals/leave-request-action-modal";
import { toast } from "sonner";
import { Loader } from "@/components/loader";
import { useEmployeeStore } from "@/store/useEmployeeStore";

export default function EmployeeLeaveDetail() {
  const [isActionModalOpen, setIsActionModalOpen] = useState(false);
  const { employee } = useEmployeeStore();

  const { leaveId } = useParams<{ leaveId: string }>();

  const queryClient = useQueryClient();

  const {
    data: leaveRequest,
    error,
    isLoading,
    isError,
  } = useQuery<Leave, Error>({
    queryKey: ["leaveDetails", leaveId],
    queryFn: () => getLeaveDetail(leaveId ? leaveId : ""),
    enabled: !!leaveId,
  });

  const leaveActionMutation = useMutation({
    mutationFn: updateLeaveRequest,
    onSuccess: () => {
      toast.success("Leave request updated successfully");
      queryClient.invalidateQueries({ queryKey: ["leaveDetails"] });
      setIsActionModalOpen(false);
    },
    onError: (error) => {
      if (error instanceof Error) {
        return toast.error(error.message);
      }
      toast.error("Failed to update leave request");
    },
  });

  const handleAction = async (payload: {
    status: "approved" | "rejected";
    reason: string;
  }) => {
    if (!leaveRequest?._id) return;

    leaveActionMutation.mutate({
      leaveId: leaveRequest._id,
      status: payload.status,
      reason: payload.reason,
    });
  };

  if (isLoading) {
    return <Loader isLoading={isLoading} />;
  }

  if (isError) {
    return <div>Error: {(error as Error).message}</div>;
  }

  return (
    <div className="text-start">
      <h1 className=" text-2xl font-semibold">Leave Details</h1>
      <div className="flex flex-col gap-1 mt-5">
        <p>
          <strong>Employee Name:</strong>{" "}
          {leaveRequest?.employee?.name ||
            leaveRequest?.employee?.email ||
            "N/A"}
        </p>
        <p>
          <strong>Line Manager Name:</strong>{" "}
          {leaveRequest?.lineManager?.name ||
            leaveRequest?.lineManager?.email ||
            "N/A"}
        </p>
        <p className="capitalize">
          <strong>Leave Type:</strong> {leaveRequest?.leaveType?.name}
        </p>
        <p>
          <strong>Start Date:</strong>{" "}
          {formatDate(leaveRequest?.startDate || "")}
        </p>
        <p>
          <strong>Resumption Date:</strong>{" "}
          {formatDate(leaveRequest?.resumptionDate || "")}
        </p>
        <p>
          <strong>Duration:</strong> {leaveRequest?.duration} Days
        </p>
        <p>
          <strong>Approval Count:</strong> {leaveRequest?.approvalCount}{" "}
        </p>
        <p className="capitalize">
          <strong>Status:</strong>{" "}
          <span
            className={` px-2 py-1 font-semibold rounded-lg ${getStatusClasses(
              leaveRequest?.status
            )}`}
          >
            {leaveRequest?.status}
          </span>
        </p>
        {leaveRequest?.status.toLowerCase() === "pending" &&
          leaveRequest.approvalCount === 0 &&
          (leaveRequest.lineManager._id === employee?._id ||
            employee?.isAdmin) && (
            <Button
              size="sm"
              variant="outline"
              className="w-fit my-2"
              onClick={() => {
                setIsActionModalOpen(true);
              }}
            >
              Action
            </Button>
          )}
      </div>

      <LeaveRequestActionModal
        isOpen={isActionModalOpen}
        onClose={() => {
          setIsActionModalOpen(false);
        }}
        onSubmit={handleAction}
        isSubmitting={leaveActionMutation.isPending}
        leaveRequest={leaveRequest}
      />
    </div>
  );
}
