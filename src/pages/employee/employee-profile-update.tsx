import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import FileUpload from "@/components/file-upload";
import { SearchableDropdown } from "@/components/searchable-dropdown";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useMutation } from "@tanstack/react-query";
import { handleFetchEmployees, handleFetchLineManagers } from "@/lib/utils";
import { updateEmployeeProfileAPI } from "@/api/employee.api";
import { toast } from "sonner";
import { useEmployeeActions, useEmployeeStore } from "@/store/useEmployeeStore";
import { PlusCircle } from "lucide-react";
import { useState } from "react";
import InviteModal from "./modals/employee-invite";

export interface FormInputs {
  firstname: string | null;
  middlename: string | null;
  surname: string | null;
  email: string;
  lineManager: string | null;
  reliever: string | null;
  file: FileList | null;
  avatar: FileList | null;
}

export default function EmployeeProfileUpdate() {
  const { employee } = useEmployeeStore();
  const { setAuthEmployee } = useEmployeeActions();

  const navigate = useNavigate();

  const [isInviteModalOpen, setIsInviteModalOpen] = useState<boolean>(false);
  const [accountType, setAccountType] = useState<"employee" | "lineManager">(
    "employee"
  );

  const openInviteModal = () => {
    setIsInviteModalOpen(true);
  };

  const closeInviteModal = () => {
    setIsInviteModalOpen(false);
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    clearErrors,
  } = useForm<FormInputs>({
    defaultValues: {
      firstname: employee?.firstname || null,
      middlename: employee?.middlename || null,
      surname: employee?.surname || null,
      email: employee?.email,
      lineManager: employee?.lineManager?._id || null,
      reliever: employee?.reliever?._id || null,
      avatar: null,
      file: null,
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: updateEmployeeProfileAPI,
    onSuccess: ({ employee, leaveBalances }) => {
      setAuthEmployee({ ...employee, leaveBalances });
      // getAuthEmployee();
      toast.success("Profile updated successfully");
      navigate("/dashboard/employee/profile");
    },
    onError: (error) => {
      if (error instanceof Error) {
        return toast.error(error.message);
      }
      toast.error("Failed to profile");
    },
  });

  const onSubmit = (data: FormInputs) => {
    const file = data.file?.[0];
    const avatar = data.avatar?.[0];

    const payload = {
      ...data,
      file: file || null,
      avatar: avatar || null,
    };

    mutate(payload);
  };

  return (
    <div className="w-full max-w-4xl">
      <h1 className="text-2xl font-bold mb-4 text-start">Update Profile</h1>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white shadow-md rounded-lg p-6 text-start space-y-4"
      >
        <div>
          <Label>First Name</Label>
          <Input type="text" {...register("firstname")} className="w-full" />
          {errors.firstname && (
            <p className="text-red-500 text-sm mt-1">
              {errors.firstname.message}
            </p>
          )}
        </div>

        <div>
          <Label>Middle Name</Label>
          <Input type="text" {...register("middlename")} className="w-full" />
          {errors.middlename && (
            <p className="text-red-500 text-sm mt-1">
              {errors.middlename.message}
            </p>
          )}
        </div>

        <div>
          <Label>Surname</Label>
          <Input type="text" {...register("surname")} className="w-full" />
          {errors.surname && (
            <p className="text-red-500 text-sm mt-1">
              {errors.surname.message}
            </p>
          )}
        </div>

        {employee?.accountType === "employee" && (
          <div className="mb-4">
            <Label className="block text-sm font-medium mb-1">
              Line Manager
            </Label>
            <div className="flex items-center gap-2">
              <SearchableDropdown
                searchInputPlaceholder="Search for a line manager"
                placeholder={
                  employee?.lineManager?.name ||
                  employee?.lineManager?.email ||
                  "Search for a line manager"
                }
                fetchOptions={handleFetchLineManagers}
                onChange={(value) => {
                  console.log("Selected Level ID:", value);
                  setValue("lineManager", value);
                  clearErrors(["lineManager"]);
                }}
              />
              <PlusCircle
                className="w-5 h-5 cursor-pointer"
                onClick={() => {
                  openInviteModal();
                  setAccountType("lineManager");
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
        )}

        {employee?.accountType === "employee" && (
          <div className="mb-4">
            <Label className="block text-sm font-medium mb-1">Reliever</Label>
            <div className="flex items-center gap-2">
              <SearchableDropdown
                searchInputPlaceholder="Search for a reliever"
                placeholder={
                  employee?.reliever?.name ||
                  employee?.reliever?.email ||
                  "Search for a reliever"
                }
                fetchOptions={handleFetchEmployees}
                onChange={(value) => {
                  console.log("Selected Level ID:", value);
                  setValue("reliever", value);
                  clearErrors(["reliever"]);
                }}
              />
              <PlusCircle
                className="w-5 h-5 cursor-pointer"
                onClick={() => {
                  openInviteModal();
                  setAccountType("employee");
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
        )}

        {/* <div className="mb-4">
          <FileUpload
            label="Upload File"
            register={{ ...register("file") }}
            error={errors.file}
            accept=".jpg,.png,.pdf"
            maxSize={10 * 1024 * 1024}
          />
        </div> */}

        <div className="mb-4">
          <FileUpload
            label="Change Avatar"
            register={{ ...register("avatar") }}
            error={errors.avatar}
            accept=".jpg,.png"
            maxSize={10 * 1024 * 1024}
          />
        </div>

        <div className="flex justify-end">
          <Button
            disabled={isPending}
            type="submit"
            className={`bg-[var(--tenant-primary)] hover:bg-[var(--tenant-primary)] hover:opacity-80`}
          >
            {isPending ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </form>
      <InviteModal
        isOpen={isInviteModalOpen}
        onClose={closeInviteModal}
        accountType={accountType}
      />
    </div>
  );
}
