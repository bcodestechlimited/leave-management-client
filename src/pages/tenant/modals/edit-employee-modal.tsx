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
import {
  getEmployeeFullName,
  handleFetchEmployees,
  handleFetchLevels,
  handleFetchLineManagers,
} from "@/lib/utils";
import { updateEmployeeDetailsByTenant } from "@/api/tenant.api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Employee } from "@/types/employee.types";
import { CustomDropdown } from "@/components/custom-dropdown";
import { Label } from "@/components/ui/label";

interface EditEmployeeModalProps {
  isOpen: boolean;
  onClose: () => void;
  employee: Partial<Employee>;
}

interface FormValues {
  _id: string;
  staffId: string;
  name: string;
  firstname: string;
  middlename: string;
  surname: string;
  gender: string;
  email: string;
  lineManager: string | null;
  reliever: string | null;
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
    watch,
    setValue,
    clearErrors,
  } = useForm<FormValues>({
    defaultValues: {
      _id: employee._id,
      staffId: employee.staffId,
      firstname: employee.firstname,
      middlename: employee.middlename,
      surname: employee.surname,
      email: employee.email,
      gender: employee.gender || "male",
      lineManager: employee?.lineManager?._id || null,
      reliever: employee?.reliever?._id || null,
      jobRole: employee.jobRole,
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
    console.log({ data });

    await editMutation.mutateAsync(data);
  };

  console.log({ employee });

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
            <label className="block text-sm font-medium mb-1">Staff Id</label>
            <Input type="text" {...register("staffId")} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">First Name</label>
            <Input type="text" {...register("firstname")} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Middle Name
            </label>
            <Input type="text" {...register("middlename")} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Surname</label>
            <Input type="text" {...register("surname")} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <Input type="email" {...register("email")} />
          </div>
          <CustomDropdown
            label="Gender"
            placeholder="Select gender"
            value={watch("gender") ?? ""}
            onChange={(value) => {
              setValue("gender", value as "male" | "female");
              clearErrors("gender");
            }}
            options={[
              { label: "Male", value: "male" },
              { label: "Female", value: "female" },
            ]}
            error={errors.gender?.message}
          />
          <div>
            <label className="block text-sm font-medium mb-1">Job Role</label>
            <Input type="text" {...register("jobRole")} />
          </div>

          {/* Editable Field */}
          <div>
            <label className="block text-sm font-medium mb-1">Level</label>
            <SearchableDropdown
              searchInputPlaceholder="Search for a level"
              placeholder={employee?.levelId?.name || "Select a Level"}
              fetchOptions={handleFetchLevels}
              onChange={({ value }) => {
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

          {/* Line Manager */}
          <div className="mb-4">
            <Label className="block text-sm font-medium mb-1">
              Line Manager -{" "}
              <span className="text-muted-foreground font-semibold">
                {" "}
                {getEmployeeFullName(employee?.lineManager as Employee)}{" "}
              </span>
            </Label>
            <div className="flex items-center gap-2">
              <SearchableDropdown
                searchInputPlaceholder="Search for a line manager"
                placeholder={
                  getEmployeeFullName(employee?.lineManager as Employee) ===
                  "N/A"
                    ? "Search for a line manager"
                    : getEmployeeFullName(employee?.lineManager as Employee)
                }
                fetchOptions={handleFetchLineManagers}
                onChange={({ value }) => {
                  console.log("Selected Level ID:", value);
                  setValue("lineManager", value);
                  clearErrors(["lineManager"]);
                }}
              />
            </div>
            <Input
              type="text"
              {...register("lineManager")}
              className="hidden"
            />

            {errors.lineManager && (
              <p className="text-red-500 text-sm mt-1">
                {errors.lineManager?.message}
              </p>
            )}
          </div>

          {/* Reliever */}
          <div className="mb-4">
            <Label className="block text-sm font-medium mb-1">
              Reliever -{" "}
              <span className="text-muted-foreground font-semibold">
                {getEmployeeFullName(employee?.reliever as Employee)}
              </span>
            </Label>
            <div className="flex items-center gap-2">
              <SearchableDropdown
                searchInputPlaceholder="Search for a reliever"
                placeholder={
                  getEmployeeFullName(employee?.reliever as Employee) === "N/A"
                    ? "Search for a reliever"
                    : getEmployeeFullName(employee?.reliever as Employee)
                }
                fetchOptions={handleFetchEmployees}
                onChange={({ value }) => {
                  console.log("Selected Level ID:", value);
                  setValue("reliever", value);
                  clearErrors(["reliever"]);
                }}
              />
            </div>
            <Input type="text" {...register("reliever")} className="hidden" />

            {errors.reliever && (
              <p className="text-red-500 text-sm mt-1">
                {errors.reliever?.message}
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
