import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/modal";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { sendInviteLink } from "@/api/tenant.api";
import { toast } from "sonner";

interface InviteFormData {
  email: string;
  expiresIn: number;
}

interface InviteModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function InviteModal({ isOpen, onClose }: InviteModalProps) {
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<InviteFormData>();

  const inviteMutation = useMutation({
    mutationFn: (data: any) => sendInviteLink(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["invites"] });
      onClose();
      toast.success("Invite link sent successfully!");
    },
    onError: (error: Error) => {
      toast.error("Something went wrong");
      console.error("Failed to", error);
    },
  });

  const handleGenerateInvite = async (data: {
    email: string;
    expiresIn: number;
  }) => {
    await inviteMutation.mutateAsync(data);
  };

  return (
    <Modal heading="Generate Invite Link" isOpen={isOpen} onClose={onClose}>
      <div className="p-6">
        <h2 className="text-lg font-semibold mb-4">Generate Invite Link</h2>
        <form
          onSubmit={handleSubmit(handleGenerateInvite)}
          className="space-y-4"
        >
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

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Expires In (Days)
            </label>
            <Input
              {...register("expiresIn", {
                required: "Number of days is required",
                valueAsNumber: true,
                min: { value: 1, message: "Minimum value is 1" },
              })}
              type="number"
              placeholder="Enter number of days"
              className="mt-1"
            />
            {errors.expiresIn && (
              <p className="text-red-500 text-sm">{errors.expiresIn.message}</p>
            )}
          </div>

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
              {inviteMutation.isPending ? "Generating..." : "Generate"}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
