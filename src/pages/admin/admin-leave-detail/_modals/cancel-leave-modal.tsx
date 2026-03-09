import { CustomAlert } from "@/components/custom-alert";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Loader } from "lucide-react";

interface CancelLeaveModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCancelLeave: () => void;
  isLoading?: boolean;
}

export function CancelLeaveModal({
  open,
  onOpenChange,
  onCancelLeave,
  isLoading,
}: CancelLeaveModalProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Cancel Leave Request</AlertDialogTitle>

          <CustomAlert
            variant="warning"
            description="Canceling this leave request will add the leave days back to the employee's leave balance."
          />

          <AlertDialogDescription>
            Are you sure you want to cancel this leave request? This action
            cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading} className="font-medium">
            No, go back
          </AlertDialogCancel>

          <Button
            onClick={onCancelLeave}
            className="bg-rose-700 hover:bg-rose-600"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <Loader className="w-4 h-4 mr-2 animate-spin" /> Processing...
              </span>
            ) : (
              " Yes, cancel leave"
            )}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
