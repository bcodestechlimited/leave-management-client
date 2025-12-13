import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

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
      toast.error("Something went wrong");
      console.error("Failed to add level", error);
    },
  });

  const handleFormSubmit = async (data: { name: string }) => {
    await addMutation.mutateAsync(data);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add Level</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          {/* Level Name */}
          <div>
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

          {/* Buttons */}
          <div className="flex justify-end gap-4 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>

            <Button type="submit" disabled={addMutation.isPending}>
              {addMutation.isPending ? "Adding..." : "Add Level"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
