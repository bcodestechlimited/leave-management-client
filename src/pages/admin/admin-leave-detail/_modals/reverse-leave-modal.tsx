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
  onReverseLeave: () => void;
  isLoading?: boolean;
}

export function ReverseLeaveModal({
  open,
  onOpenChange,
  onReverseLeave,
  isLoading,
}: CancelLeaveModalProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Reverse Leave Request</AlertDialogTitle>

          <CustomAlert
            variant="warning"
            description="Reversing this leave request will add the leave days back to the employee's leave balance."
          />

          <AlertDialogDescription>
            Are you sure you want to reverse this leave request? This action
            cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading} className="font-medium">
            No, go back
          </AlertDialogCancel>

          <Button
            onClick={onReverseLeave}
            className="bg-rose-700 hover:bg-rose-600"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <Loader className="w-4 h-4 mr-2 animate-spin" /> Processing...
              </span>
            ) : (
              " Yes, reverse leave"
            )}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
