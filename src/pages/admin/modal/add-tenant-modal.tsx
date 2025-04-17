import { FC } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/modal";
import { Input } from "@/components/ui/input";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addTenant } from "@/api/admin.api";
import { toast } from "sonner";

interface AddTenantFormValues {
  name: string;
  email: string;
  logo: FileList;
  color: string;
}

interface AddTenantModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddTenantModal: FC<AddTenantModalProps> = ({ isOpen, onClose }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AddTenantFormValues>();

  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: addTenant,
    onSuccess: () => {
      toast.success("Client added sucessfully");
      reset();
      onClose();
      queryClient.invalidateQueries({ queryKey: ["tenants"] });
    },
    onError: (error) => {
      console.log(error);
      toast.error(error.message || "Failed to add tenant");
    },
  });

  const handleFormSubmit: SubmitHandler<AddTenantFormValues> = (data) => {
    const logo = data.logo[0];
    const newTenant = { ...data, logo };
    mutate(newTenant);
  };

  return (
    <Modal heading="Add Tenant" isOpen={isOpen} onClose={onClose}>
      <form onSubmit={handleSubmit(handleFormSubmit)} className="p-4">
        <h2 className="text-lg font-semibold mb-4">Add New Tenant</h2>
        <div className="mb-4">
          <label className="block text-sm font-medium">Name</label>
          <Input
            type="text"
            {...register("name", { required: "Name is required" })}
          />
          {errors.name && (
            <p className="text-red-500 text-sm">{errors.name.message}</p>
          )}
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium">Email</label>
          <Input
            type="email"
            {...register("email", { required: "Email is required" })}
          />
          {errors.email && (
            <p className="text-red-500 text-sm">{errors.email.message}</p>
          )}
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium">Logo</label>
          <Input
            type="file"
            accept="image/png, image/jpeg"
            {...register("logo", { required: "Image URL is required" })}
          />
          {errors.logo && (
            <p className="text-red-500 text-sm">{errors.logo.message}</p>
          )}
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium">Color</label>
          <Input
            type="color"
            {...register("color", { required: "Color is required" })}
          />
          {errors.color && (
            <p className="text-red-500 text-sm">{errors.color.message}</p>
          )}
        </div>
        <Button type="submit" disabled={isPending} className="w-full">
          {isPending ? "Submitting..." : "Add Tenant"}
        </Button>
      </form>
    </Modal>
  );
};

export default AddTenantModal;
