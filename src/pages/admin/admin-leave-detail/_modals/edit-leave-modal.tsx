import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { updateLeaveRequestDate } from "@/api/admin.api";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { CustomAlert } from "@/components/custom-alert";

interface EditLeaveFormValues {
  startDate: string;
  duration: number;
  resumptionDate: string;
}

interface EditLeaveModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  leaveId: string;
  initialStartDate: string;
  initialDuration: number;
}

/* ===================== */
/* Component */
/* ===================== */

export function EditLeaveModal({
  open,
  onOpenChange,
  leaveId,
  initialStartDate,
  initialDuration,
}: EditLeaveModalProps) {
  const queryClient = useQueryClient();

  const form = useForm<EditLeaveFormValues>({
    defaultValues: {
      startDate: initialStartDate,
      duration: initialDuration,
      resumptionDate: "",
    },
  });

  const { watch, setValue, reset } = form;

  const startDate = watch("startDate");
  const duration = watch("duration");

  /* ===================== */
  /* Auto compute resumption date */
  /* ===================== */
  useEffect(() => {
    if (startDate && duration) {
      const newDate = calculateResumptionDate(startDate, duration);
      setValue("resumptionDate", newDate, { shouldValidate: true });
    }
  }, [startDate, duration, setValue]);

  /* ===================== */
  /* Reset form when modal opens */
  /* ===================== */
  useEffect(() => {
    if (open) {
      reset({
        startDate: initialStartDate,
        duration: initialDuration,
        resumptionDate: calculateResumptionDate(
          initialStartDate,
          initialDuration,
        ),
      });
    }
  }, [open, initialStartDate, initialDuration, reset]);

  /* ===================== */
  /* Mutation */
  /* ===================== */

  const updateLeaveMutation = useMutation({
    mutationFn: (data: EditLeaveFormValues) =>
      updateLeaveRequestDate(leaveId, {
        startDate: data.startDate,
        duration: data.duration,
        resumptionDate: data.resumptionDate,
      }),
    onSuccess: () => {
      toast.success("Leave dates updated successfully");
      queryClient.invalidateQueries({ queryKey: ["admin-leave-detail"] });
      onOpenChange(false);
    },
    onError: (error) => {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Failed to update leave dates");
      }
    },
  });

  /* ===================== */
  /* Submit */
  /* ===================== */

  const onSubmit = (data: EditLeaveFormValues) => {
    updateLeaveMutation.mutateAsync(data);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Leave</DialogTitle>
        </DialogHeader>

        <CustomAlert
          variant="warning"
          description="Editing the leave date will update the resumption date automatically and revert the leave status to pending."
        />

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="startDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Start Date</FormLabel>
                  <FormControl>
                    <Popover modal>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-between text-left font-normal",
                            !field.value && "text-muted-foreground",
                          )}
                        >
                          {field.value
                            ? new Date(field.value).toISOString().split("T")[0]
                            : "Pick a date"}
                          <CalendarIcon className="h-4 w-4 opacity-50" />
                        </Button>
                      </PopoverTrigger>

                      <PopoverContent
                        align="center"
                        className="w-auto p-0 bg-white"
                      >
                        <Calendar
                          // disabled={(date) => date < new Date()}
                          mode="single"
                          selected={
                            field.value ? new Date(field.value) : undefined
                          }
                          onSelect={(date) => {
                            field.onChange(
                              date ? date.toLocaleDateString("en-CA") : "",
                            );
                          }}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="duration"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Duration (working days)</FormLabel>
                  <FormControl>
                    <Input disabled type="number" min={1} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="resumptionDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Resumption Date</FormLabel>
                  <FormControl>
                    <Input disabled {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            <DialogFooter className="pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={updateLeaveMutation.isPending}>
                {updateLeaveMutation.isPending ? "Updating..." : "Update Leave"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

/* ===================== */
/* Utils */
/* ===================== */

function calculateResumptionDate(startDate: Date | string, duration: number) {
  let start = new Date(startDate);
  let addedDays = 0;

  while (addedDays < duration) {
    start.setDate(start.getDate() + 1);
    if (start.getDay() !== 0 && start.getDay() !== 6) {
      addedDays++;
    }
  }

  return start.toLocaleDateString("en-CA");
}
