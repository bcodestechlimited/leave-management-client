import { useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getLeaveDetail } from "@/api/leave.api";
import { formatDate, getEmployeeFullName, getStatusClasses } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Leave } from "@/types/leave.types";
import { toast } from "sonner";
import { Loader } from "@/components/loader";
import { updateLeaveRequestForAdmin } from "@/api/admin.api";
import { ApproveLeaveModal } from "./_modals/approve-leave-modal";
import { RejectLeaveModal } from "./_modals/reject-leave-modal";
import { EditLeaveModal } from "./_modals/edit-leave-modal";

export default function AdminLeaveDetail() {
  const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [reason, setReason] = useState("");

  const { leaveId } = useParams<{ leaveId: string }>();

  const queryClient = useQueryClient();

  const {
    data: leaveRequest,
    error,
    isLoading,
    isError,
  } = useQuery<Leave, Error>({
    queryKey: ["admin-leave-detail", leaveId],
    queryFn: () => getLeaveDetail(leaveId ? leaveId : ""),
    enabled: !!leaveId,
  });

  const leaveActionMutation = useMutation({
    mutationFn: updateLeaveRequestForAdmin,
    onSuccess: () => {
      toast.success("Leave request updated successfully");
      queryClient.invalidateQueries({ queryKey: ["admin-leave-detail"] });
      setIsApproveModalOpen(false);
      setIsRejectModalOpen(false);
      setReason("");
    },
    onError: (error) => {
      if (error instanceof Error) {
        return toast.error(error.message);
      }
      toast.error("Failed to update leave request");
    },
  });

  const handleApprove = () => {
    if (!leaveRequest?._id) return;
    leaveActionMutation.mutateAsync({
      leaveId: leaveRequest._id,
      status: "approved",
      reason: reason || "Leave approved",
    });
  };

  const handleReject = () => {
    if (!leaveRequest?._id) return;
    if (!reason.trim()) {
      toast.error("Please provide a reason for rejection");
      return;
    }
    leaveActionMutation.mutateAsync({
      leaveId: leaveRequest._id,
      status: "rejected",
      reason: reason,
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
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Leave Details</h1>
        <Button
          onClick={() => {
            setIsEditModalOpen(true);
          }}
          className="px-6 font-medium"
        >
          Edit
        </Button>
      </div>
      <div className="flex flex-col gap-1 mt-5">
        <p>
          <strong>Employee Name:</strong>{" "}
          {leaveRequest?.employee
            ? getEmployeeFullName(leaveRequest?.employee)
            : "N/A"}
        </p>
        <p>
          <strong>Employee Email:</strong>{" "}
          {leaveRequest?.employee ? leaveRequest?.employee.email : "N/A"}
        </p>
        <p>
          <strong>Line Manager Name:</strong>{" "}
          {leaveRequest?.lineManager
            ? getEmployeeFullName(leaveRequest?.lineManager)
            : "N/A"}
        </p>
        <p>
          <strong>Line Manager Email:</strong>{" "}
          {leaveRequest?.lineManager ? leaveRequest?.lineManager.email : "N/A"}
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
          <strong>Approval Count:</strong> {leaveRequest?.approvalCount}
        </p>
        <p className="capitalize">
          <strong>Status:</strong>
          <span
            className={`px-2 py-1 font-semibold rounded-lg ${getStatusClasses(
              leaveRequest?.status,
            )}`}
          >
            {leaveRequest?.status}
          </span>
        </p>

        {leaveRequest?.document &&
          leaveRequest?.leaveType?.name?.toLowerCase().includes("sick") && (
            <p>
              <strong>Document: </strong>
              <a
                href={leaveRequest?.document}
                target="_blank"
                rel="noreferrer"
                className="text-primary underline"
              >
                Click here to view
              </a>
            </p>
          )}

        {leaveRequest?.status !== "approved" && (
          <div className="flex gap-4 py-6">
            <Button
              className="bg-green-700"
              onClick={() => setIsApproveModalOpen(true)}
            >
              Approve
            </Button>
            <Button
              className="bg-red-700"
              onClick={() => setIsRejectModalOpen(true)}
            >
              Reject
            </Button>
          </div>
        )}
      </div>

      {/* Approve Modal */}
      <ApproveLeaveModal
        open={isApproveModalOpen}
        onOpenChange={(open) => {
          setIsApproveModalOpen(open);
          if (!open) setReason("");
        }}
        reason={reason}
        setReason={setReason}
        onApprove={handleApprove}
        isLoading={leaveActionMutation.isPending}
      />

      {/* Reject Modal */}
      <RejectLeaveModal
        open={isRejectModalOpen}
        onOpenChange={(open) => {
          setIsRejectModalOpen(open);
          if (!open) setReason("");
        }}
        reason={reason}
        setReason={setReason}
        onReject={handleReject}
        isLoading={leaveActionMutation.isPending}
      />

      {/* Edit Modal */}
      <EditLeaveModal
        open={isEditModalOpen}
        onOpenChange={(open) => setIsEditModalOpen(open)}
        leaveId={leaveRequest?._id || ""}
        initialStartDate={leaveRequest?.startDate || ""}
        initialDuration={Number(leaveRequest?.duration) || 0}
      />
    </div>
  );
}
