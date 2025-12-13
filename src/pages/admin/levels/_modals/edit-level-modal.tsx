import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { editLevel } from "@/api/level.api";

interface EditLevelModalProps {
  isOpen: boolean;
  onClose: () => void;
  level: { _id: string; name: string };
}

export default function EditLevelModal({
  isOpen,
  onClose,
  level,
}: EditLevelModalProps) {
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<{ _id: string; name: string }>({
    defaultValues: { _id: level._id, name: level.name },
  });

  const editMutation = useMutation({
    mutationFn: editLevel,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["levels"] });
      toast.success("Level updated successfully");
      onClose();
    },
    onError: (error) => {
      toast.error("Something went wrong");
      console.error("Failed to update level", error);
    },
  });

  const handleFormSubmit = async (data: { _id: string; name: string }) => {
    await editMutation.mutateAsync(data);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Level</DialogTitle>
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

            <Button type="submit" disabled={editMutation.isPending}>
              {editMutation.isPending ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
