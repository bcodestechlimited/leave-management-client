import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/modal";
import { addLevel } from "@/api/level.api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface AddLevelModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AddLevelModal({ isOpen, onClose }: AddLevelModalProps) {
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<{ name: string }>();

  const addMutation = useMutation({
    mutationFn: addLevel,
    onSuccess: () => {
      toast.success("Level Added successfully");
      queryClient.invalidateQueries({ queryKey: ["levels"] });
      onClose();
    },
    onError: (error) => {
      toast.success("Something went wrong");
      console.error("Failed to add level", error);
    },
  });

  const handleFormSubmit = async (data: { name: string }) => {
    await addMutation.mutateAsync(data);
  };

  return (
    <Modal heading="Add Level" isOpen={isOpen} onClose={onClose}>
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Level Name</label>
          <input
            type="text"
            {...register("name", { required: "Level name is required" })}
            className="w-full p-2 border rounded"
          />
          {errors.name && (
            <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
          )}
        </div>

        <div className="mt-6 flex justify-center gap-4">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={addMutation.isPending}>
            {addMutation.isPending ? "Adding..." : "Add Level"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
