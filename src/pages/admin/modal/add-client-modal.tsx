import { useForm, SubmitHandler } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/modal";
import { Input } from "@/components/ui/input";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { addClient } from "@/api/admin.api";

interface AddClientFormValues {
  name: string;
  email: string;
  logo: FileList;
  color: string;
}

interface AddClientModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AddClientModal({
  isOpen,
  onClose,
}: AddClientModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AddClientFormValues>();

  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: addClient,
    onSuccess: () => {
      toast.success("Client added sucessfully");
      reset();
      onClose();
      queryClient.invalidateQueries({ queryKey: ["clients"] });
    },
    onError: (error) => {
      console.log(error);
      toast.error(error.message || "Failed to add client");
    },
  });

  const handleFormSubmit: SubmitHandler<AddClientFormValues> = (data) => {
    const logo = data.logo[0];
    const newClient = { ...data, logo };
    mutate(newClient);
  };

  return (
    <Modal heading="Add Client" isOpen={isOpen} onClose={onClose}>
      <form onSubmit={handleSubmit(handleFormSubmit)} className="p-4">
        <h2 className="text-lg font-semibold mb-4">Add New Client</h2>
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
          {isPending ? "Submitting..." : "Add Client"}
        </Button>
      </form>
    </Modal>
  );
}
