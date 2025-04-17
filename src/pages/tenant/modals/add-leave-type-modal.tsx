import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/modal";
import { SearchableDropdown } from "@/components/searchable-dropdown";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addLeaveType } from "@/api/leave.api";
import { toast } from "sonner";
import { handleFetchLevels } from "@/lib/utils";

interface AddLeaveTypeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AddLeaveTypeModal({
  isOpen,
  onClose,
}: AddLeaveTypeModalProps) {
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    setValue,
    clearErrors,
    formState: { errors },
    reset,
  } = useForm<{ name: string; defaultBalance: number; levelId: string }>();

  const addMutation = useMutation({
    mutationFn: addLeaveType,
    onSuccess: () => {
      toast.success("Leave Type Added successfully");
      queryClient.invalidateQueries({ queryKey: ["leaveTypes"] });
      reset();
      onClose();
    },
    onError: (error) => {
      toast.error("Something went wrong");
      console.error("Failed to add leave type", error);
    },
  });

  const handleFormSubmit = async (data: {
    name: string;
    defaultBalance: number;
    levelId: string;
  }) => {
    await addMutation.mutateAsync(data);
  };

  return (
    <Modal heading="Add Leave Type" isOpen={isOpen} onClose={onClose}>
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        {/* Leave Name */}
        <div className="mb-4">
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

        {/* Default Balance */}
        <div className="mb-4">
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

        {/* Searchable Dropdown for Level */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Level</label>
          <SearchableDropdown
            placeholder="Search and select a Level"
            fetchOptions={handleFetchLevels}
            onChange={(value) => {
              console.log("Selected Level ID:", value);
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
              {errors.levelId?.message}
            </p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex justify-center gap-4">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={addMutation.isPending}>
            {addMutation.isPending ? "Adding..." : "Add Leave Type"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
