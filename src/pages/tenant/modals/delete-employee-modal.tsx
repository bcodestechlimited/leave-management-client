import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { deleteEmployeeByTenant } from "@/api/tenant.api";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Employee } from "@/types/employee.types";

interface ModalPrope {
  isOpen: boolean;
  onClose: () => void;
  employeeId: Employee;
}

export default function DeleteEmployeeModal({
  isOpen,
  onClose,
  employeeId,
}: ModalPrope) {
  const queryClient = useQueryClient();

  const deleteEmployeeMutation = useMutation({
    mutationFn: deleteEmployeeByTenant,
    onSuccess: () => {
      toast.success("Employee deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["getAllEmployees"] });
      onClose();
    },
    onError: (error: Error) => {
      toast.error("Something went wrong");
      console.error("Failed to delete employee:", error);
    },
  });

  const handleDelete = () => {
    deleteEmployeeMutation.mutate(employeeId._id);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirm Deletion</DialogTitle>
        </DialogHeader>
        <p>Are you sure you want to delete this employee?</p>
        <p>
          Please note that this action cannot be undone and will also do the the
          following:
        </p>
        <ul className="list-disc pl-5 text-red-500">
          <li>Delete the employee.</li>
          <li>Delete all leave requests this employee has made.</li>
          <li>
            Remove the employee from other employees' profiles that have this
            employee as their line manager or reliever.
          </li>
        </ul>

        <p>Do you still want to proceed?</p>
        <DialogFooter>
          <Button
            disabled={deleteEmployeeMutation.isPending}
            variant="secondary"
            onClick={onClose}
          >
            No
          </Button>
          <Button
            disabled={deleteEmployeeMutation.isPending}
            variant="destructive"
            onClick={handleDelete}
          >
            Yes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
