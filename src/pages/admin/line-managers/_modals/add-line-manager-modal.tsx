import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { addLineManager } from "@/api/employee.api";
import { Label } from "@/components/ui/label";

interface AddLineManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface AddLineManagerFormValues {
  firstname: string;
  middlename?: string;
  surname: string;
  email: string;
  accountType: string;
}

export default function AddLineManagerModal({
  isOpen,
  onClose,
}: AddLineManagerModalProps) {
  const queryClient = useQueryClient();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AddLineManagerFormValues>();

  const { mutateAsync: createEmployee, isPending } = useMutation({
    mutationFn: addLineManager,
    onSuccess: () => {
      toast.success("Line Manager added successfully");
      queryClient.invalidateQueries({ queryKey: ["getAllLineManagers"] });
      onClose();
      reset();
    },
    onError: (error: Error) => {
      toast.error(error.message);
      console.error(error);
    },
  });

  const onSubmit = async (data: AddLineManagerFormValues) => {
    await createEmployee({
      ...data,
      accountType: "lineManager", // Force accountType to lineManager
    });
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add Line Manager</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label className="text-sm font-medium">First Name</Label>
            <Input
              {...register("firstname", { required: "First name is required" })}
              placeholder="Enter first name"
            />
            {errors.firstname && (
              <p className="text-red-500 text-sm">{errors.firstname.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium">Middle Name</Label>
            <Input
              {...register("middlename")}
              placeholder="Enter middle name"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium">Surname</Label>
            <Input
              {...register("surname", { required: "Surname is required" })}
              placeholder="Enter surname"
            />
            {errors.surname && (
              <p className="text-red-500 text-sm">{errors.surname.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium">Email</Label>
            <Input
              type="email"
              {...register("email", { required: "Email is required" })}
              placeholder="Enter email address"
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email.message}</p>
            )}
          </div>

          <div className="flex justify-end pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="mr-2"
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Adding..." : "Add Line Manager"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
