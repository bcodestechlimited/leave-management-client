// import { useParams } from "react-router-dom";
// import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
// import { getLeaveDetail } from "@/api/leave.api";
// import { formatDate, getEmployeeFullName, getStatusClasses } from "@/lib/utils";
// import { Button } from "@/components/ui/button";
// import { useState } from "react";
// import { Leave } from "@/types/leave.types";
// import { toast } from "sonner";
// import { Loader } from "@/components/loader";
// import { updateLeaveRequestForAdmin } from "@/api/admin.api";
// import { ApproveLeaveModal } from "./_modals/approve-leave-modal";
// import { RejectLeaveModal } from "./_modals/reject-leave-modal";
// import { EditLeaveModal } from "./_modals/edit-leave-modal";
// import { CancelLeaveModal } from "./_modals/cancel-leave-modal";

// type ModalStateEnum = "approve" | "reject" | "edit" | "cancel" | null;

// export default function AdminLeaveDetail() {
//   const [modalState, setModalState] = useState<ModalStateEnum>(null);
//   const [reason, setReason] = useState("");

//   const { leaveId } = useParams<{ leaveId: string }>();

//   const queryClient = useQueryClient();

//   const {
//     data: leaveRequest,
//     error,
//     isLoading,
//     isError,
//   } = useQuery<Leave, Error>({
//     queryKey: ["admin-leave-detail", leaveId],
//     queryFn: () => getLeaveDetail(leaveId ? leaveId : ""),
//     enabled: !!leaveId,
//   });

//   const leaveActionMutation = useMutation({
//     mutationFn: updateLeaveRequestForAdmin,
//     onSuccess: () => {
//       toast.success("Leave request updated successfully");
//       queryClient.invalidateQueries({ queryKey: ["admin-leave-detail"] });
//       setModalState(null);
//       setReason("");
//     },
//     onError: (error) => {
//       if (error instanceof Error) {
//         return toast.error(error.message);
//       }
//       toast.error("Failed to update leave request");
//     },
//   });

//   const cancelLeaveMutation = useMutation({
//     mutationFn: updateLeaveRequestForAdmin,
//     onSuccess: () => {
//       toast.success("Leave request cancelled successfully");
//       queryClient.invalidateQueries({ queryKey: ["admin-leave-detail"] });
//       setModalState(null);
//     },
//     onError: (error) => {
//       if (error instanceof Error) {
//         toast.error(error.message);
//       } else {
//         toast.error("Failed to cancel leave request");
//       }
//     },
//   });

//   const handleApprove = () => {
//     if (!leaveRequest?._id) return;
//     leaveActionMutation.mutateAsync({
//       leaveId: leaveRequest._id,
//       status: "approved",
//       reason: reason || "Leave approved",
//     });
//   };

//   const handleReject = () => {
//     if (!leaveRequest?._id) return;
//     if (!reason.trim()) {
//       toast.error("Please provide a reason for rejection");
//       return;
//     }
//     leaveActionMutation.mutateAsync({
//       leaveId: leaveRequest._id,
//       status: "rejected",
//       reason: reason,
//     });
//   };

//   const handleCancelLeave = () => {
//     if (!leaveRequest?._id) return;

//     cancelLeaveMutation.mutate({
//       leaveId: leaveRequest._id,
//       status: "cancelled",
//       reason: "Leave cancelled by admin",
//     });
//   };

//   const openModal = (modalType: ModalStateEnum) => {
//     setModalState(modalType);
//   };

//   if (isLoading) {
//     return <Loader isLoading={isLoading} />;
//   }

//   if (isError) {
//     return <div>Error: {(error as Error).message}</div>;
//   }

//   return (
//     <div className="text-start">
//       <div className="flex items-center justify-between">
//         <h1 className="text-2xl font-semibold">Leave Details</h1>
//         <div className=" flex items-center gap-2">
//           <Button
//             onClick={() => {
//               openModal("cancel");
//             }}
//             className="px-6 font-medium"
//             disabled={leaveRequest?.status !== "pending"}
//           >
//             Cancel
//           </Button>
//           <Button
//             onClick={() => {
//               openModal("edit");
//             }}
//             className="px-6 font-medium"
//           >
//             Edit
//           </Button>
//         </div>
//       </div>
//       <div className="flex flex-col gap-1 mt-5">
//         <p>
//           <strong>Employee Name:</strong>{" "}
//           {leaveRequest?.employee
//             ? getEmployeeFullName(leaveRequest?.employee)
//             : "N/A"}
//         </p>
//         <p>
//           <strong>Employee Email:</strong>{" "}
//           {leaveRequest?.employee ? leaveRequest?.employee.email : "N/A"}
//         </p>
//         <p>
//           <strong>Line Manager Name:</strong>{" "}
//           {leaveRequest?.lineManager
//             ? getEmployeeFullName(leaveRequest?.lineManager)
//             : "N/A"}
//         </p>
//         <p>
//           <strong>Line Manager Email:</strong>{" "}
//           {leaveRequest?.lineManager ? leaveRequest?.lineManager.email : "N/A"}
//         </p>
//         <p className="capitalize">
//           <strong>Leave Type:</strong> {leaveRequest?.leaveType?.name}
//         </p>
//         <p>
//           <strong>Start Date:</strong>{" "}
//           {formatDate(leaveRequest?.startDate || "")}
//         </p>
//         <p>
//           <strong>Resumption Date:</strong>{" "}
//           {formatDate(leaveRequest?.resumptionDate || "")}
//         </p>
//         <p>
//           <strong>Duration:</strong> {leaveRequest?.duration} Days
//         </p>
//         <p>
//           <strong>Approval Count:</strong> {leaveRequest?.approvalCount}
//         </p>
//         <p className="capitalize">
//           <strong>Status:</strong>
//           <span
//             className={`px-2 py-1 font-semibold rounded-lg ${getStatusClasses(
//               leaveRequest?.status,
//             )}`}
//           >
//             {leaveRequest?.status}
//           </span>
//         </p>

//         {leaveRequest?.document &&
//           leaveRequest?.leaveType?.name?.toLowerCase().includes("sick") && (
//             <p>
//               <strong>Document: </strong>
//               <a
//                 href={leaveRequest?.document}
//                 target="_blank"
//                 rel="noreferrer"
//                 className="text-primary underline"
//               >
//                 Click here to view
//               </a>
//             </p>
//           )}

//         {leaveRequest?.status !== "approved" && (
//           <div className="flex gap-4 py-6">
//             <Button
//               className="bg-green-700"
//               onClick={() => openModal("approve")}
//               disabled={leaveRequest?.status !== "pending"}
//             >
//               Approve
//             </Button>
//             <Button
//               className="bg-red-700"
//               onClick={() => openModal("reject")}
//               disabled={leaveRequest?.status !== "pending"}
//             >
//               Reject
//             </Button>
//           </div>
//         )}
//       </div>

//       {/* Approve Modal */}
//       <ApproveLeaveModal
//         open={modalState === "approve"}
//         onOpenChange={(open) => {
//           if (!open) setReason("");
//           openModal(open ? "approve" : null);
//         }}
//         reason={reason}
//         setReason={setReason}
//         onApprove={handleApprove}
//         isLoading={leaveActionMutation.isPending}
//       />

//       {/* Reject Modal */}
//       <RejectLeaveModal
//         open={modalState === "reject"}
//         onOpenChange={(open) => {
//           if (!open) setReason("");
//           openModal(open ? "reject" : null);
//         }}
//         reason={reason}
//         setReason={setReason}
//         onReject={handleReject}
//         isLoading={leaveActionMutation.isPending}
//       />

//       {/* Edit Modal */}
//       <EditLeaveModal
//         open={modalState === "edit"}
//         onOpenChange={(open) => {
//           if (!open) setReason("");
//           openModal(open ? "edit" : null);
//         }}
//         leaveId={leaveRequest?._id || ""}
//         initialStartDate={leaveRequest?.startDate || ""}
//         initialDuration={Number(leaveRequest?.duration) || 0}
//       />

//       <CancelLeaveModal
//         open={modalState === "cancel"}
//         onOpenChange={(open) => openModal(open ? "cancel" : null)}
//         onCancelLeave={handleCancelLeave}
//         isLoading={cancelLeaveMutation.isPending}
//       />
//     </div>
//   );
// }

// ===========================================================================

// import { useParams } from "react-router-dom";
// import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
// import { getLeaveDetail } from "@/api/leave.api";
// import { formatDate, getEmployeeFullName, getStatusClasses } from "@/lib/utils";
// import { Button } from "@/components/ui/button";
// import { useState } from "react";
// import { Leave } from "@/types/leave.types";
// import { toast } from "sonner";
// import { updateLeaveRequestForAdmin } from "@/api/admin.api";
// import { ApproveLeaveModal } from "./_modals/approve-leave-modal";
// import { RejectLeaveModal } from "./_modals/reject-leave-modal";
// import { EditLeaveModal } from "./_modals/edit-leave-modal";
// import { CancelLeaveModal } from "./_modals/cancel-leave-modal";

// type ModalStateEnum = "approve" | "reject" | "edit" | "cancel" | null;

// export default function AdminLeaveDetail() {
//   const [modalState, setModalState] = useState<ModalStateEnum>(null);
//   const [reason, setReason] = useState("");

//   const { leaveId } = useParams<{ leaveId: string }>();
//   const queryClient = useQueryClient();

//   const {
//     data: leaveRequest,
//     error,
//     isLoading,
//     isError,
//   } = useQuery<Leave, Error>({
//     queryKey: ["admin-leave-detail", leaveId],
//     queryFn: () => getLeaveDetail(leaveId || ""),
//     enabled: !!leaveId,
//   });

//   const mutation = useMutation({
//     mutationFn: updateLeaveRequestForAdmin,
//     onSuccess: () => {
//       toast.success("Leave request updated successfully");
//       queryClient.invalidateQueries({ queryKey: ["admin-leave-detail"] });
//       setModalState(null);
//       setReason("");
//     },
//     onError: (error) => {
//       toast.error(
//         error instanceof Error ? error.message : "Something went wrong",
//       );
//     },
//   });

//   const cancelMutation = useMutation({
//     mutationFn: updateLeaveRequestForAdmin,
//     onSuccess: () => {
//       toast.success("Leave cancelled successfully");
//       queryClient.invalidateQueries({ queryKey: ["admin-leave-detail"] });
//       setModalState(null);
//     },
//     onError: (error) => {
//       toast.error(error instanceof Error ? error.message : "Failed to cancel");
//     },
//   });

//   const handleApprove = () => {
//     if (!leaveRequest?._id) return;
//     mutation.mutate({
//       leaveId: leaveRequest._id,
//       status: "approved",
//       reason: reason || "Approved",
//     });
//   };

//   const handleReject = () => {
//     if (!leaveRequest?._id) return;
//     if (!reason.trim()) return toast.error("Provide a reason");
//     mutation.mutate({
//       leaveId: leaveRequest._id,
//       status: "rejected",
//       reason,
//     });
//   };

//   const handleCancel = () => {
//     if (!leaveRequest?._id) return;
//     cancelMutation.mutate({
//       leaveId: leaveRequest._id,
//       status: "cancelled",
//       reason: "Cancelled by admin",
//     });
//   };

//   if (isLoading) return <LeaveDetailSkeleton />;
//   if (isError) return <LeaveDetailError message={error.message} />;

//   return (
//     <div className="text-start space-y-6">
//       {/* Header */}
//       <div className="flex items-center justify-between">
//         <h1 className="text-2xl font-semibold">Leave Details</h1>

//         <div className="flex gap-2">
//           <Button
//             disabled={leaveRequest?.status !== "pending"}
//             onClick={() => setModalState("cancel")}
//           >
//             Cancel
//           </Button>
//           <Button onClick={() => setModalState("edit")}>Edit</Button>
//         </div>
//       </div>

//       {/* Main Card */}
//       <div className="border rounded-lg p-4 space-y-3 bg-muted/10">
//         <InfoRow
//           label="Employee"
//           value={
//             leaveRequest?.employee && getEmployeeFullName(leaveRequest.employee)
//           }
//         />
//         <InfoRow label="Email" value={leaveRequest?.employee?.email} />
//         <InfoRow
//           label="Line Manager"
//           value={
//             leaveRequest?.lineManager &&
//             getEmployeeFullName(leaveRequest.lineManager)
//           }
//         />
//         <InfoRow label="Leave Type" value={leaveRequest?.leaveType?.name} />
//         <InfoRow
//           label="Start Date"
//           value={formatDate(leaveRequest?.startDate || "")}
//         />
//         <InfoRow
//           label="Resumption Date"
//           value={formatDate(leaveRequest?.resumptionDate || "")}
//         />
//         <InfoRow label="Duration" value={`${leaveRequest?.duration} days`} />

//         <div className="flex items-center gap-2">
//           <span className="font-semibold">Status:</span>
//           <span
//             className={`px-2 py-1 rounded-md text-sm font-medium ${getStatusClasses(
//               leaveRequest?.status,
//             )}`}
//           >
//             {leaveRequest?.status}
//           </span>
//         </div>

//         {leaveRequest?.document &&
//           leaveRequest.leaveType?.name?.toLowerCase().includes("sick") && (
//             <a
//               href={leaveRequest.document}
//               target="_blank"
//               className="text-blue-600 underline"
//             >
//               View Document
//             </a>
//           )}
//       </div>

//       {/* Actions */}
//       {leaveRequest?.status !== "approved" && (
//         <div className="flex gap-3">
//           <Button
//             className="bg-green-600"
//             disabled={leaveRequest?.status !== "pending"}
//             onClick={() => setModalState("approve")}
//           >
//             Approve
//           </Button>
//           <Button
//             className="bg-red-600"
//             disabled={leaveRequest?.status !== "pending"}
//             onClick={() => setModalState("reject")}
//           >
//             Reject
//           </Button>
//         </div>
//       )}

//       {/* Modals */}
//       <ApproveLeaveModal
//         open={modalState === "approve"}
//         onOpenChange={(o) => setModalState(o ? "approve" : null)}
//         reason={reason}
//         setReason={setReason}
//         onApprove={handleApprove}
//         isLoading={mutation.isPending}
//       />

//       <RejectLeaveModal
//         open={modalState === "reject"}
//         onOpenChange={(o) => setModalState(o ? "reject" : null)}
//         reason={reason}
//         setReason={setReason}
//         onReject={handleReject}
//         isLoading={mutation.isPending}
//       />

//       <EditLeaveModal
//         open={modalState === "edit"}
//         onOpenChange={(o) => setModalState(o ? "edit" : null)}
//         leaveId={leaveRequest?._id || ""}
//         initialStartDate={leaveRequest?.startDate || ""}
//         initialDuration={Number(leaveRequest?.duration) || 0}
//       />

//       <CancelLeaveModal
//         open={modalState === "cancel"}
//         onOpenChange={(o) => setModalState(o ? "cancel" : null)}
//         onCancelLeave={handleCancel}
//         isLoading={cancelMutation.isPending}
//       />
//     </div>
//   );
// }

// /* ---------------------- HELPERS ---------------------- */

// function InfoRow({ label, value }: { label: string; value?: string }) {
//   return (
//     <p className="flex gap-2">
//       <span className="font-semibold">{label}:</span>
//       <span>{value || "N/A"}</span>
//     </p>
//   );
// }

// /* ---------------------- SKELETON ---------------------- */

// function LeaveDetailSkeleton() {
//   return (
//     <div className="space-y-4 animate-pulse">
//       <div className="h-6 w-40 bg-gray-200 rounded" />

//       <div className="border p-4 rounded space-y-3">
//         {[...Array(6)].map((_, i) => (
//           <div key={i} className="h-4 bg-gray-200 rounded w-3/4" />
//         ))}
//       </div>

//       <div className="flex gap-2">
//         <div className="h-10 w-24 bg-gray-200 rounded" />
//         <div className="h-10 w-24 bg-gray-200 rounded" />
//       </div>
//     </div>
//   );
// }

// /* ---------------------- ERROR ---------------------- */

// function LeaveDetailError({ message }: { message: string }) {
//   return (
//     <div className="p-6 border border-red-200 bg-red-50 rounded text-red-700">
//       <p className="font-semibold">Failed to load leave details</p>
//       <p className="text-sm">{message}</p>
//     </div>
//   );
// }

// ===================================================================================

import { useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getLeaveDetail } from "@/api/leave.api";
import { formatDate, getEmployeeFullName } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Leave } from "@/types/leave.types";
import { toast } from "sonner";
import {
  reverseLeaveRequest,
  updateLeaveRequestForAdmin,
} from "@/api/admin.api";
import { ApproveLeaveModal } from "./_modals/approve-leave-modal";
import { RejectLeaveModal } from "./_modals/reject-leave-modal";
import { EditLeaveModal } from "./_modals/edit-leave-modal";
import { CancelLeaveModal } from "./_modals/cancel-leave-modal";
import { ReverseLeaveModal } from "./_modals/reverse-leave-modal";
import { Undo2 } from "lucide-react";

type ModalStateEnum =
  | "approve"
  | "reject"
  | "edit"
  | "cancel"
  | "reverse"
  | null;

function getStatusStyles(status?: string): {
  bg: string;
  text: string;
  border: string;
} {
  switch (status) {
    case "approved":
      return {
        bg: "bg-emerald-50",
        text: "text-emerald-800",
        border: "border-emerald-200",
      };
    case "rejected":
      return {
        bg: "bg-red-50",
        text: "text-red-800",
        border: "border-red-200",
      };
    case "cancelled":
      return {
        bg: "bg-gray-100",
        text: "text-gray-600",
        border: "border-gray-200",
      };
    case "pending":
    default:
      return {
        bg: "bg-amber-50",
        text: "text-amber-800",
        border: "border-amber-200",
      };
  }
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

type AvatarColor = "purple" | "teal";

const avatarColors: Record<AvatarColor, { bg: string; text: string }> = {
  purple: { bg: "bg-violet-100", text: "text-violet-800" },
  teal: { bg: "bg-emerald-100", text: "text-emerald-800" },
};

function Avatar({
  name,
  color = "purple",
}: {
  name: string;
  color?: AvatarColor;
}) {
  const { bg, text } = avatarColors[color];
  return (
    <div
      className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-medium shrink-0 ${bg} ${text}`}
    >
      {getInitials(name)}
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[11px] uppercase tracking-widest text-muted-foreground mb-1">
      {children}
    </p>
  );
}

function DetailCell({
  label,
  children,
  bordered = false,
}: {
  label: string;
  children: React.ReactNode;
  bordered?: boolean;
}) {
  return (
    <div className={bordered ? "border-l border-border pl-5" : ""}>
      <SectionLabel>{label}</SectionLabel>
      <div className="text-sm font-medium text-foreground">{children}</div>
    </div>
  );
}

export default function AdminLeaveDetail() {
  const [modalState, setModalState] = useState<ModalStateEnum>(null);
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
    queryFn: () => getLeaveDetail(leaveId ?? ""),
    enabled: !!leaveId,
  });

  const leaveActionMutation = useMutation({
    mutationFn: updateLeaveRequestForAdmin,
    onSuccess: () => {
      toast.success("Leave request updated successfully");
      queryClient.invalidateQueries({ queryKey: ["admin-leave-detail"] });
      setModalState(null);
      setReason("");
    },
    onError: (error) => {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to update leave request",
      );
    },
  });

  const cancelLeaveMutation = useMutation({
    mutationFn: updateLeaveRequestForAdmin,
    onSuccess: () => {
      toast.success("Leave request cancelled successfully");
      queryClient.invalidateQueries({ queryKey: ["admin-leave-detail"] });
      setModalState(null);
    },
    onError: (error) => {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to cancel leave request",
      );
    },
  });

  const reverseLeaveMutation = useMutation({
    mutationFn: reverseLeaveRequest,
    onSuccess: () => {
      toast.success("Leave request reversed successfully");
      queryClient.invalidateQueries({ queryKey: ["admin-leave-detail"] });
      setModalState(null);
    },
    onError: (error) => {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Failed to reverse leave request");
      }
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
      reason,
    });
  };

  const handleCancelLeave = () => {
    if (!leaveRequest?._id) return;

    cancelLeaveMutation.mutateAsync({
      leaveId: leaveRequest._id,
      status: "cancelled",
      reason: "Leave cancelled by admin",
    });
  };

  const openModal = (modalType: ModalStateEnum) => setModalState(modalType);
  const handleReverseLeave = () => {
    if (!leaveRequest?._id) return;
    reverseLeaveMutation.mutateAsync(leaveRequest._id);
  };

  

  if (isLoading) return <AdminLeaveDetailSkeleton />;
  if (isError)
    return (
      <AdminLeaveDetailError
        message={(error as Error)?.message || "Something went wrong"}
      />
    );

  const employeeName = leaveRequest?.employee
    ? getEmployeeFullName(leaveRequest.employee)
    : "N/A";
  const managerName = leaveRequest?.lineManager
    ? getEmployeeFullName(leaveRequest.lineManager)
    : "N/A";

  const statusStyles = getStatusStyles(leaveRequest?.status);
  const isPending = leaveRequest?.status === "pending";
  const isSickLeave = leaveRequest?.leaveType?.name
    ?.toLowerCase()
    .includes("sick");

  return (
    <div className="text-start max-w-2xl">
      {/* ── Header ── */}
      <div className="flex items-start justify-between gap-3 mb-7 flex-wrap">
        <div>
          <p className="text-[11px] uppercase tracking-widest text-muted-foreground mb-1">
            Leave Request
          </p>
          <h1 className="text-2xl font-medium">Leave details</h1>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="font-normal text-sm"
            onClick={() => {
              openModal("reverse");
            }}
            disabled={
              leaveRequest?.status !== "approved" &&
              leaveRequest?.status !== "cancelled"
            }
          >
            <Undo2 className="" /> Reverse
          </Button>
          <Button
            onClick={() => {
              openModal("cancel");
            }}
            className="px-6 font-medium"
            disabled={leaveRequest?.status !== "pending"}
          >
            Cancel
          </Button>

          <Button
            onClick={() => {
              openModal("edit");
            }}
            className="px-6 font-medium"
          >
            Edit
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="font-normal text-sm text-destructive border-destructive/30 hover:bg-destructive/5"
            disabled={!isPending}
            onClick={() => openModal("cancel")}
          >
            Cancel request
          </Button>
        </div>
      </div>

      {/* ── People cards ── */}
      <div className="grid grid-cols-2 gap-3 mb-3">
        <div className="bg-muted/50 rounded-lg p-4">
          <SectionLabel>Employee</SectionLabel>
          <div className="flex items-center gap-2.5 mt-2">
            <Avatar name={employeeName} color="purple" />
            <div>
              <p className="text-sm font-medium leading-tight">
                {employeeName}
              </p>
              <p className="text-xs text-muted-foreground leading-tight mt-0.5">
                {leaveRequest?.employee?.email ?? "N/A"}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-muted/50 rounded-lg p-4">
          <SectionLabel>Line manager</SectionLabel>
          <div className="flex items-center gap-2.5 mt-2">
            <Avatar name={managerName} color="teal" />
            <div>
              <p className="text-sm font-medium leading-tight">{managerName}</p>
              <p className="text-xs text-muted-foreground leading-tight mt-0.5">
                {leaveRequest?.lineManager?.email ?? "N/A"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Details grid ── */}
      <div className="border border-border rounded-xl p-5 mb-3">
        <div className="grid grid-cols-3 gap-0 pb-4 mb-4 border-b border-border">
          <DetailCell label="Leave type">
            <span className="capitalize">
              {leaveRequest?.leaveType?.name ?? "N/A"}
            </span>
          </DetailCell>
          <DetailCell label="Duration" bordered>
            {leaveRequest?.duration ? `${leaveRequest.duration} days` : "N/A"}
          </DetailCell>
          <DetailCell label="Approval count" bordered>
            {leaveRequest?.approvalCount ?? "N/A"}
          </DetailCell>
        </div>

        <div className="grid grid-cols-3 gap-0">
          <DetailCell label="Start date">
            {formatDate(leaveRequest?.startDate ?? "")}
          </DetailCell>
          <DetailCell label="Resumption date" bordered>
            {formatDate(leaveRequest?.resumptionDate ?? "")}
          </DetailCell>
          <DetailCell label="Status" bordered>
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border capitalize ${statusStyles.bg} ${statusStyles.text} ${statusStyles.border}`}
            >
              {leaveRequest?.status ?? "N/A"}
            </span>
          </DetailCell>
        </div>
      </div>

      {/* ── Document (sick leave only) ── */}
      {leaveRequest?.document && isSickLeave && (
        <div className="border border-border rounded-xl p-5 mb-5">
          <SectionLabel>Supporting document</SectionLabel>
          <div className="flex items-center gap-3 mt-3">
            <div className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center shrink-0">
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                className="text-muted-foreground"
              >
                <path
                  d="M4 2h6l3 3v9H4V2z"
                  stroke="currentColor"
                  strokeWidth="1"
                  fill="none"
                />
                <path
                  d="M9 2v4h3"
                  stroke="currentColor"
                  strokeWidth="1"
                  fill="none"
                />
                <path
                  d="M6 8h5M6 10h3"
                  stroke="currentColor"
                  strokeWidth="1"
                  strokeLinecap="round"
                />
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">
                Medical certificate
              </p>
              <p className="text-xs text-muted-foreground">
                Uploaded with request
              </p>
            </div>
            <a
              href={leaveRequest.document}
              target="_blank"
              rel="noreferrer"
              className="text-xs font-medium text-blue-600 border border-blue-200 rounded-md px-3 py-1.5 hover:bg-blue-50 transition-colors shrink-0"
            >
              View
            </a>
          </div>
        </div>
      )}

      {/* ── Approve / Reject actions ── */}
      {leaveRequest?.status !== "approved" && (
        <div className="flex gap-2.5 pt-1">
          <button
            onClick={() => openModal("approve")}
            disabled={!isPending}
            className="flex-1 py-2.5 rounded-lg border border-emerald-300 bg-emerald-50 text-emerald-900 text-sm font-medium hover:bg-emerald-100 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Approve request
          </button>
          <button
            onClick={() => openModal("reject")}
            disabled={!isPending}
            className="flex-1 py-2.5 rounded-lg border border-red-200 bg-red-50 text-red-900 text-sm font-medium hover:bg-red-100 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Reject request
          </button>
        </div>
      )}

      {/* ── Modals ── */}
      <ApproveLeaveModal
        open={modalState === "approve"}
        onOpenChange={(open) => {
          if (!open) setReason("");
          openModal(open ? "approve" : null);
        }}
        reason={reason}
        setReason={setReason}
        onApprove={handleApprove}
        isLoading={leaveActionMutation.isPending}
      />

      <RejectLeaveModal
        open={modalState === "reject"}
        onOpenChange={(open) => {
          if (!open) setReason("");
          openModal(open ? "reject" : null);
        }}
        reason={reason}
        setReason={setReason}
        onReject={handleReject}
        isLoading={leaveActionMutation.isPending}
      />

      <EditLeaveModal
        open={modalState === "edit"}
        onOpenChange={(open) => {
          if (!open) setReason("");
          openModal(open ? "edit" : null);
        }}
        leaveId={leaveRequest?._id ?? ""}
        initialStartDate={leaveRequest?.startDate ?? ""}
        initialDuration={Number(leaveRequest?.duration) || 0}
      />

      <CancelLeaveModal
        open={modalState === "cancel"}
        onOpenChange={(open) => openModal(open ? "cancel" : null)}
        onCancelLeave={handleCancelLeave}
        isLoading={cancelLeaveMutation.isPending}
      />

      <ReverseLeaveModal
        open={modalState === "reverse"}
        onOpenChange={(open) => openModal(open ? "reverse" : null)}
        onReverseLeave={handleReverseLeave}
        isLoading={reverseLeaveMutation.isPending}
      />
    </div>
  );
}

/* ───────────────────────── SKELETON ───────────────────────── */

function AdminLeaveDetailSkeleton() {
  return (
    <div className="text-start max-w-2xl animate-pulse">
      {/* Header */}
      <div className="flex items-start justify-between mb-7">
        <div>
          <div className="h-2 w-24 bg-muted rounded mb-2" />
          <div className="h-6 w-40 bg-muted rounded" />
        </div>

        <div className="flex gap-2">
          <div className="h-9 w-20 bg-muted rounded-lg" />
          <div className="h-9 w-24 bg-muted rounded-lg" />
        </div>
      </div>

      {/* People cards */}
      <div className="grid grid-cols-2 gap-3 mb-3">
        {[1, 2].map((i) => (
          <div key={i} className="bg-muted/40 rounded-lg p-4 space-y-3">
            <div className="h-2 w-20 bg-muted rounded" />
            <div className="flex gap-2 items-center">
              <div className="w-9 h-9 rounded-full bg-muted" />
              <div className="space-y-2">
                <div className="h-3 w-28 bg-muted rounded" />
                <div className="h-2 w-36 bg-muted rounded" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Details */}
      <div className="border rounded-xl p-5 space-y-6">
        <div className="grid grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="space-y-2">
              <div className="h-2 w-16 bg-muted rounded" />
              <div className="h-4 w-20 bg-muted rounded" />
            </div>
          ))}
        </div>

        <div className="grid grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="space-y-2">
              <div className="h-2 w-16 bg-muted rounded" />
              <div className="h-4 w-20 bg-muted rounded" />
            </div>
          ))}
        </div>
      </div>

      {/* Buttons */}
      <div className="flex gap-2 mt-4">
        <div className="h-10 flex-1 bg-muted rounded-lg" />
        <div className="h-10 flex-1 bg-muted rounded-lg" />
      </div>
    </div>
  );
}

/* ───────────────────────── ERROR ───────────────────────── */

function AdminLeaveDetailError({ message }: { message: string }) {
  return (
    <div className="max-w-2xl border border-red-200 bg-red-50 rounded-xl p-5">
      <p className="text-sm font-semibold text-red-700">
        Failed to load leave details
      </p>
      <p className="text-xs text-red-600 mt-1">{message}</p>

      <button
        onClick={() => window.location.reload()}
        className="mt-4 text-xs font-medium text-red-700 underline"
      >
        Try again
      </button>
    </div>
  );
}
