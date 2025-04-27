import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
    firstname: string;
    middlename: string;
    surname: string;
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
  firstname: string;
  middlename: string;
  surname: string;
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
      firstname: employee.firstname,
      middlename: employee.middlename,
      surname: employee.surname,
      email: employee.email,
      isAdmin: employee.isAdmin,
      levelId: employee.levelId?._id || "",
    },
  });

  const editMutation = useMutation({
    mutationFn: (data: FormValues) => updateEmployeeDetailsByTenant(data),
    onSuccess: () => {
      toast.success("Employee updated successfully");
      queryClient.invalidateQueries({ queryKey: ["getAllEmployees"] });
      onClose();
    },
    onError: (error: Error) => {
      toast.error("Something went wrong");
      console.error("Failed to update employee:", error);
    },
  });

  const handleFormSubmit = async (data: FormValues) => {
    await editMutation.mutateAsync(data);
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Update Employee</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          {/* Display basic disabled fields */}
          <div>
            <label className="block text-sm font-medium mb-1">First Name</label>
            <Input disabled type="text" {...register("firstname")} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Middle Name
            </label>
            <Input disabled type="text" {...register("middlename")} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Surname</label>
            <Input disabled type="text" {...register("surname")} />
          </div>
          {/* <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <Input disabled type="text" {...register("name")} />
          </div> */}
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <Input disabled type="email" {...register("email")} />
          </div>
          {/* <div>
            <label className="block text-sm font-medium mb-1">Job Role</label>
            <Input disabled type="text" {...register("jobRole")} />
          </div> */}

          {/* Editable Field */}
          <div>
            <label className="block text-sm font-medium mb-1">Level</label>
            <SearchableDropdown
              searchInputPlaceholder="Search for a level"
              placeholder={employee?.levelId?.name || "Select a Level"}
              fetchOptions={handleFetchLevels}
              onChange={(value) => {
                setValue("levelId", value);
                clearErrors("levelId");
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

          {/* Action buttons */}
          <div className="flex justify-end gap-4 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={editMutation.isPending}>
              {editMutation.isPending ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
