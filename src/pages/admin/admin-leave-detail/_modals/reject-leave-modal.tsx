import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

interface RejectLeaveModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  reason: string;
  setReason: (value: string) => void;
  onReject: () => void;
  isLoading?: boolean;
}

export function RejectLeaveModal({
  open,
  onOpenChange,
  reason,
  setReason,
  onReject,
  isLoading,
}: RejectLeaveModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Reject Leave Request</DialogTitle>
          <DialogDescription>
            Please provide a reason for rejecting this leave request.
          </DialogDescription>
        </DialogHeader>

        <Textarea
          placeholder="Reason for rejection (required)"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          required
        />

        <DialogFooter className="flex gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            className="bg-red-700"
            onClick={onReject}
            disabled={isLoading || !reason.trim()}
          >
            {isLoading ? "Processing..." : "Reject"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
