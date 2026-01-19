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

interface ApproveLeaveModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  reason: string;
  setReason: (value: string) => void;
  onApprove: () => void;
  isLoading?: boolean;
}

export function ApproveLeaveModal({
  open,
  onOpenChange,
  reason,
  setReason,
  onApprove,
  isLoading,
}: ApproveLeaveModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Approve Leave Request</DialogTitle>
          <DialogDescription>
            Are you sure you want to approve this leave request?
          </DialogDescription>
        </DialogHeader>

        <Textarea
          placeholder="Optional reason or comments"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
        />

        <DialogFooter className="flex gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            className="bg-green-700"
            onClick={onApprove}
            disabled={isLoading}
          >
            {isLoading ? "Processing..." : "Approve"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
