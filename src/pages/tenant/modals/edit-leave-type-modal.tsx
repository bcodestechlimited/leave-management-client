import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/modal";
import { SearchableDropdown } from "@/components/searchable-dropdown";
import { handleFetchLevels } from "@/lib/utils";
import { toast } from "sonner";
import { editLeaveType } from "@/api/leave.api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

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
  };
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
      _id: leaveType._id,
      name: leaveType.name,
      defaultBalance: leaveType.defaultBalance,
      levelId: leaveType.levelId._id,
    },
  });

  const editMutation = useMutation({
    mutationFn: editLeaveType,
    onSuccess: () => {
      toast.success("Leave Type Added successfully");
      queryClient.invalidateQueries({ queryKey: ["leaveTypes"] });
      onClose();
    },
    onError: (error) => {
      toast.error("Something went wrong");
      console.error("Failed to add leave type", error);
    },
  });

  const handleFormSubmit = async (data: FormValues) => {
    await editMutation.mutateAsync(data);
  };

  return (
    <Modal heading="Edit Leave Type" isOpen={isOpen} onClose={onClose}>
      <form onSubmit={handleSubmit(handleFormSubmit)}>
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

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Level</label>
          <SearchableDropdown
            searchInputPlaceholder="Search for a level"
            placeholder={leaveType?.levelId?.name || "Select a Level"}
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

        <div className="mt-6 flex justify-center gap-4">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={editMutation.isPending}>
            {editMutation.isPending ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
