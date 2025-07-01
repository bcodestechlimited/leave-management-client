import { useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getLeaveDetail } from "@/api/leave.api";
import { formatDate, getEmployeeFullName, getStatusClasses } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Leave } from "@/types/leave.types";
import { toast } from "sonner";
import { Loader } from "@/components/loader";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { updateClientLeaveRequest } from "@/api/client.api";

export default function ClientLeaveDetail() {
  const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [reason, setReason] = useState("");

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
    mutationFn: updateClientLeaveRequest,
    onSuccess: () => {
      toast.success("Leave request updated successfully");
      queryClient.invalidateQueries({ queryKey: ["leaveDetails"] });
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
      <h1 className="text-2xl font-semibold">Leave Details</h1>
      <div className="flex flex-col gap-1 mt-5">
        <p>
          <strong>Employee Name:</strong>{" "}
          {leaveRequest?.employee
            ? getEmployeeFullName(leaveRequest?.employee)
            : "N/A"}
        </p>
        <p>
          <strong>Line Manager Name:</strong>{" "}
          {leaveRequest?.lineManager
            ? getEmployeeFullName(leaveRequest?.lineManager)
            : "N/A"}
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

        <p className="capitalize">
          <strong>Status:</strong>
          <span
            className={`px-2 py-1 font-semibold rounded-lg ${getStatusClasses(
              leaveRequest?.status
            )}`}
          >
            {leaveRequest?.status}
          </span>
        </p>
        {leaveRequest?.status.toLowerCase() === "pending" &&
          leaveRequest.approvalCount > 0 && (
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
      <Dialog
        open={isApproveModalOpen}
        onOpenChange={(open) => {
          setIsApproveModalOpen(open);
          if (!open) setReason("");
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Approve Leave Request</DialogTitle>
            <DialogDescription>
              Are you sure you want to approve this leave request?
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Textarea
              placeholder="Optional reason or comments"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
          </div>
          <DialogFooter className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setIsApproveModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              className="bg-green-700"
              onClick={handleApprove}
              disabled={leaveActionMutation.isPending}
            >
              {leaveActionMutation.isPending ? "Processing..." : "Approve"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reject Modal */}
      <Dialog
        open={isRejectModalOpen}
        onOpenChange={(open) => {
          setIsRejectModalOpen(open);
          if (!open) setReason("");
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Leave Request</DialogTitle>
            <DialogDescription>
              Please provide a reason for rejecting this leave request.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Textarea
              placeholder="Reason for rejection (required)"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              required
            />
          </div>
          <DialogFooter className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setIsRejectModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              className="bg-red-700"
              onClick={handleReject}
              disabled={leaveActionMutation.isPending || !reason.trim()}
            >
              {leaveActionMutation.isPending ? "Processing..." : "Reject"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
