import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/modal";
import { Input } from "@/components/ui/input";
import { SearchableDropdown } from "@/components/searchable-dropdown";
import { handleFetchLevels } from "@/lib/utils";
import { updateEmployeeDetailsByTenant } from "@/api/tenant.api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface EditEmployeeModalProps {
  isOpen: boolean;
  onClose: () => void;
  employee: {
    _id: string;
    name: string;
    email: string;
    jobRole: string;
    isAdmin: boolean;
    levelId: {
      _id: string;
      name: string;
    };
  };
}

interface FormValues {
  _id: string;
  name: string;
  email: string;
  jobRole: string;
  levelId: string;
  isAdmin: boolean;
}

export default function EditEmployeeModal({
  isOpen,
  onClose,
  employee,
}: EditEmployeeModalProps) {
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    clearErrors,
  } = useForm<FormValues>({
    defaultValues: {
      _id: employee._id,
      name: employee.name,
      email: employee.email,
      jobRole: employee.jobRole,
      isAdmin: employee?.isAdmin,
      levelId: employee?.levelId?._id ? employee.levelId._id : "",
    },
  });

  const editMutation = useMutation({
    mutationFn: (data: any) => updateEmployeeDetailsByTenant(data),
    onSuccess: () => {
      toast.success("Employee updated successfully");
      queryClient.invalidateQueries({ queryKey: ["getAllEmployees"] });
      onClose();
    },
    onError: (error: Error) => {
      toast.success("Something went wrong");
      console.error("Failed to update employee:", error);
    },
  });

  const handleFormSubmit = async (data: FormValues) => {
    await editMutation.mutateAsync(data);
  };

  return (
    <Modal heading="Update Employee" isOpen={isOpen} onClose={onClose}>
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Name</label>
          <Input
            disabled
            type="text"
            {...register("name")}
            className="w-full p-2 border rounded"
          />
          {errors.name && (
            <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
          )}
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Email</label>
          <Input
            disabled
            type="email"
            {...register("email")}
            className="w-full p-2 border rounded"
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
          )}
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Job Role</label>
          <Input
            disabled
            type="text"
            {...register("jobRole")}
            className="w-full p-2 border rounded"
          />
          {errors.jobRole && (
            <p className="text-red-500 text-sm mt-1">
              {errors.jobRole.message}
            </p>
          )}
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Level</label>
          <SearchableDropdown
            searchInputPlaceholder="Search for a level"
            placeholder={employee?.levelId?.name || "Select a Level"}
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

        <div className="mt-6 flex justify-end gap-4">
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
