import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { formatDate, getEmployeeFullName } from "@/lib/utils";
import { Leave } from "@/types/leave.types";
import { useState } from "react";
import { Employee } from "@/types/employee.types";

interface LeaveActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { status: "approved" | "rejected"; reason: string }) => void;
  isSubmitting: boolean;
  leaveRequest?: Leave;
}

export default function LeaveRequestActionModal({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting,
  leaveRequest,
}: LeaveActionModalProps) {
  const [actionStatus, setActionStatus] = useState<
    "approved" | "rejected" | ""
  >("");

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      status: "" as "approved" | "rejected",
      reason: "",
    },
  });

  const status = watch("status");

  const onSubmitForm = (data: { reason: string }) => {
    console.log(data);

    if (actionStatus) {
      onSubmit({ status: actionStatus, reason: data.reason });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Leave Request Action</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-4">
          <div>
            <p className="text-sm font-medium mb-2">
              <strong> Employee: </strong>
              {getEmployeeFullName(leaveRequest?.employee as Employee)}
            </p>
            <p className="text-sm font-medium mb-2">
              <strong> Line Manager: </strong>
              {getEmployeeFullName(leaveRequest?.lineManager as Employee)}
            </p>
            <p className="text-sm font-medium mb-2">
              <strong>Duration: </strong> {leaveRequest?.duration} Days
            </p>
            <p className="text-sm">
              <span className=" font-semibold">Time Frame: </span>
              {formatDate(leaveRequest?.startDate || "")} -{" "}
              {formatDate(leaveRequest?.resumptionDate || "")}
            </p>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold">Reason</label>
            <Textarea
              {...register("reason", { required: "Reason is required" })}
              placeholder={`Enter reason for ${status || "action"}...`}
              className="min-h-[100px]"
            />
            {errors.reason && (
              <p className="text-red-500 text-sm mt-1">
                {errors.reason?.message}
              </p>
            )}
          </div>

          <div className="flex gap-2 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="destructive"
              disabled={isSubmitting}
              onClick={() => setActionStatus("rejected")}
            >
              Reject
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              onClick={() => setActionStatus("approved")}
            >
              Approve
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
