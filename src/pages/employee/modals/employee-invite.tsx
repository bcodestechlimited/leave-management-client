import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/modal";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { InviteAndAddEmployee } from "@/api/employee.api";

interface InviteFormData {
  email: string;
  firstname: string;
  middlename?: string;
  surname: string;
}

interface InviteModalProps {
  isOpen: boolean;
  onClose: () => void;
  accountType: string;
}

export default function InviteModal({
  isOpen,
  onClose,
  accountType,
}: InviteModalProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<InviteFormData>();

  const inviteMutation = useMutation({
    mutationFn: (data: any) => InviteAndAddEmployee(data),
    onSuccess: () => {
      onClose();
      toast.success("User invited successfully!");
    },
    onError: (error: Error) => {
      toast.error(error.message);
      console.error("Failed to invite", error);
    },
  });

  const handleGenerateInvite = async (data: InviteFormData) => {
    console.log({ ...data, accountType });

    await inviteMutation.mutateAsync({ ...data, accountType });
  };

  if (!isOpen) return null;

  return (
    <Modal
      heading={`Couldn't find your ${
        accountType === "employee" ? "reliever" : "line manager"
      }?`}
      isOpen={isOpen}
      onClose={onClose}
    >
      <div className="p-6">
        <h2 className="text-lg font-semibold mb-4">
          Send an invite to your
          {accountType === "employee" ? " reliever" : " line manager"}
        </h2>
        <form
          onSubmit={handleSubmit(handleGenerateInvite)}
          className="space-y-4"
        >
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <Input
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                  message: "Invalid email format",
                },
              })}
              type="email"
              placeholder="Enter email"
              className="mt-1"
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email.message}</p>
            )}
          </div>

          {/* Firstname */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              First Name
            </label>
            <Input
              {...register("firstname", {
                required: "First name is required",
              })}
              type="text"
              placeholder="Enter first name"
              className="mt-1"
            />
            {errors.firstname && (
              <p className="text-red-500 text-sm">{errors.firstname.message}</p>
            )}
          </div>

          {/* Middlename (Optional) */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Middle Name (Optional)
            </label>
            <Input
              {...register("middlename")}
              type="text"
              placeholder="Enter middle name"
              className="mt-1"
            />
          </div>

          {/* Surname */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Surname
            </label>
            <Input
              {...register("surname", {
                required: "Surname is required",
              })}
              type="text"
              placeholder="Enter surname"
              className="mt-1"
            />
            {errors.surname && (
              <p className="text-red-500 text-sm">{errors.surname.message}</p>
            )}
          </div>

          {/* Buttons */}
          <div className="mt-6 flex justify-end space-x-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={
                Object.keys(errors).length > 0 || inviteMutation.isPending
              }
            >
              {inviteMutation.isPending ? "Inviting..." : "Invite"}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
