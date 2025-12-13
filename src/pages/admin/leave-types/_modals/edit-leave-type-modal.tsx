import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { SearchableDropdown } from "@/components/searchable-dropdown";
import { handleFetchLevels } from "@/lib/utils";
import { toast } from "sonner";
import { editLeaveType } from "@/api/leave.api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader } from "lucide-react";

interface EditLeaveTypeModalProps {
  isOpen: boolean;
  onClose: () => void;
  leaveType: {
    _id: string;
    name: string;
    defaultBalance: number;
    levelId: {
      _id: string;
      name: string;
    };
  } | null;
}

interface FormValues {
  _id: string;
  name: string;
  defaultBalance: number;
  levelId: string;
}

export default function EditLeaveTypeModal({
  isOpen,
  onClose,
  leaveType,
}: EditLeaveTypeModalProps) {
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    setValue,
    clearErrors,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      _id: leaveType?._id,
      name: leaveType?.name,
      defaultBalance: leaveType?.defaultBalance,
      levelId: leaveType?.levelId?._id,
    },
  });

  const editMutation = useMutation({
    mutationFn: editLeaveType,
    onSuccess: () => {
      toast.success("Leave Type updated successfully");
      queryClient.invalidateQueries({ queryKey: ["leaveTypes"] });
      onClose();
    },
    onError: (error) => {
      toast.error("Something went wrong");
      console.error("Failed to update leave type", error);
    },
  });

  const handleFormSubmit = async (data: FormValues) => {
    await editMutation.mutateAsync(data);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Leave Type</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          {/* Leave Name */}
          <div>
            <label className="block text-sm font-medium mb-1">Leave Name</label>
            <input
              type="text"
              {...register("name", { required: "Leave name is required" })}
              className="w-full p-2 border rounded"
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
            )}
          </div>

          {/* Balance */}
          <div>
            <label className="block text-sm font-medium mb-1">Balance</label>
            <input
              type="number"
              {...register("defaultBalance", {
                required: "Balance is required",
                min: { value: 0, message: "Balance must be at least 0" },
              })}
              className="w-full p-2 border rounded"
            />
            {errors.defaultBalance && (
              <p className="text-red-500 text-sm mt-1">
                {errors.defaultBalance.message}
              </p>
            )}
          </div>

          {/* Level */}
          <div>
            <label className="block text-sm font-medium mb-1">Level</label>
            <SearchableDropdown
              searchInputPlaceholder="Search for a level"
              placeholder={leaveType?.levelId?.name || "Select a Level"}
              fetchOptions={handleFetchLevels}
              onChange={({ value }) => {
                setValue("levelId", value);
                clearErrors(["levelId"]);
              }}
            />
            <input
              type="text"
              {...register("levelId", {
                required: "Level is required",
              })}
              className="hidden"
            />

            {errors.levelId && (
              <p className="text-red-500 text-sm mt-1">
                {errors.levelId.message}
              </p>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={editMutation.isPending}>
              {editMutation.isPending ? (
                <span className="flex items-center gap-2">
                  <Loader className=" animate-spin" /> Saving...
                </span>
              ) : (
                "Save Changes"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
