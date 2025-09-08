import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { SearchableDropdown } from "@/components/searchable-dropdown";
import { useEffect, useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { handleFetchBalances } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { applyForLeave } from "@/api/leave.api";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";

interface ApplyLeaveModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ApplyLeaveFormData {
  leaveTypeId: string;
  startDate: Date | string;
  resumptionDate: Date | string;
  duration: number;
  reason: string;
  document?: FileList;
}

export default function ApplyLeaveModal({
  isOpen,
  onClose,
}: ApplyLeaveModalProps) {
  const {
    register,
    handleSubmit,
    setValue,
    clearErrors,
    watch,
    formState: { errors },
    reset,
  } = useForm<ApplyLeaveFormData>({
    defaultValues: {
      startDate: new Date(),
    },
  });

  const duration = watch("duration");

  const [startDate, setStartDate] = useState<Date | string>(new Date());
  const [resumptionDate, setResumptionDate] = useState<Date | string>("");
  const [isSickLeave, setIsSickLeave] = useState(false);

  const queryClient = useQueryClient();

  useEffect(() => {
    if (duration) {
      const newDate = calculateResumptionDate(startDate, duration);
      setResumptionDate(newDate);
      setValue("resumptionDate", newDate);
      clearErrors(["resumptionDate"]);
    }
  }, [duration, startDate]);

  function calculateResumptionDate(startDate: Date | string, duration: number) {
    // const start = new Date(startDate); // Create a new Date object to avoid mutating the original date
    // start.setDate(start.getDate() + duration);
    // start.setDate(start.getDate() + 1);
    // const resumptionDate = start.toLocaleDateString("en-CA");
    // return resumptionDate;
    let start = new Date(startDate);
    let addedDays = 0;

    while (addedDays < duration) {
      start.setDate(start.getDate() + 1);
      // Skip weekends (Saturday = 6, Sunday = 0)
      if (start.getDay() !== 0 && start.getDay() !== 6) {
        addedDays++;
      }
    }

    return start.toLocaleDateString("en-CA"); // Returns in YYYY-MM-DD format
  }

  const { mutate, isPending } = useMutation({
    mutationFn: applyForLeave,
    onSuccess: () => {
      toast.success("Leave appllied");
      onClose();
      reset();
      queryClient.invalidateQueries({ queryKey: ["employee-leaves"] });
    },
    onError: (error) => {
      console.log(error);
      toast.error(error.message || "Failed to apply");
    },
  });

  const handleFormSubmit = async (data: ApplyLeaveFormData) => {
    const { startDate, resumptionDate } = data;
    const start = new Date(startDate);
    const end = new Date(resumptionDate);

    const updatedData = {
      ...data,
      startDate: start.toISOString().split("T")[0].toString(),
      resumptionDate: end.toISOString().split("T")[0].toString(),
      document: data.document?.[0],
    };

    console.log({ updatedData });

    mutate(updatedData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent aria-describedby="leave-application-description">
        <DialogHeader>
          <DialogTitle>Apply for Leave</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Leave Type</label>
            <SearchableDropdown
              placeholder="Search and select a leave type"
              fetchOptions={handleFetchBalances}
              onChange={({ value, label }) => {
                console.log("Selected Level ID:", value);
                setValue("leaveTypeId", value);
                clearErrors(["leaveTypeId"]);
                if (label.toLowerCase().includes("sick")) {
                  setIsSickLeave(true);
                } else {
                  setIsSickLeave(false);
                }
              }}
            />
            <Input
              type="text"
              {...register("leaveTypeId", {
                required: "Select a leave type",
              })}
              className="hidden"
            />

            {errors.leaveTypeId && (
              <p className="text-red-500 text-sm mt-1">
                {errors.leaveTypeId?.message}
              </p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Start Date</label>
            <Popover modal={true}>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className="w-full pl-3 text-left font-normal"
                >
                  {startDate
                    ? new Date(startDate).toISOString().split("T")[0]
                    : "Pick a date"}
                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent
                className="w-auto p-0 flex justify-end"
                align="center"
              >
                <Calendar
                  mode="single"
                  selected={new Date(startDate)}
                  onSelect={(date) => {
                    console.log(date);
                    console.log(date?.toISOString());

                    setStartDate(date ? date.toLocaleDateString("en-CA") : "");
                    setValue(
                      "startDate",
                      date ? date.toLocaleDateString("en-CA") : ""
                    );

                    clearErrors(["startDate"]);
                  }}
                  // disabled={(date) => date < new Date()}
                  initialFocus
                  className="rounded-md border bg-white z-50"
                />
              </PopoverContent>
            </Popover>

            <Input
              type="text"
              {...register("startDate", {
                required: "Start Date is required",
              })}
              className="hidden"
            />

            {errors.startDate && (
              <p className="text-sm text-red-500 mt-1">
                {errors.startDate.message}
              </p>
            )}
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Duration</label>
            <Input
              type="number"
              {...register("duration", {
                required: "Duration is required",
                min: { value: 1, message: "Duration must be at least 1" },
                valueAsNumber: true,
              })}
              className="w-full p-2 border rounded"
              min="0"
            />
            {errors.duration && (
              <p className="text-red-500 text-sm mt-1">
                {errors.duration.message}
              </p>
            )}
          </div>

          <div>
            <Label className="block text-sm font-medium mb-1">
              Resumption Date
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className="w-full pl-3 text-left font-normal"
                  disabled
                >
                  {resumptionDate
                    ? resumptionDate.toLocaleString()
                    : "Pick a date"}
                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={new Date(resumptionDate)}
                  disabled={(date) => date < new Date()}
                  initialFocus
                  className="rounded-md border bg-white"
                />
              </PopoverContent>
            </Popover>

            <Input
              type="text"
              {...register("resumptionDate", {
                required: "Resumption date is required",
              })}
              className="hidden"
            />

            {errors.resumptionDate && (
              <p className="text-sm text-red-500 mt-1">
                {errors.resumptionDate.message}
              </p>
            )}
          </div>

          {isSickLeave && (
            <div className="mb-4">
              <Label className="block text-sm font-medium mb-1">Document</Label>
              <Input
                type="file"
                accept="image/*, application/pdf"
                {...register("document", {
                  required: "Document is required for sick leave",
                })}
                className="block w-full border rounded-lg p-2"
              />
              {errors.document && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.document.message}
                </p>
              )}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium mb-1">Reason</label>
            <Textarea
              placeholder="Enter the reason for leave"
              {...register("reason", { required: "Reason is required" })}
              disabled={isPending}
            />
            {errors.reason && (
              <p className="text-sm text-red-500 mt-1">
                {errors.reason.message}
              </p>
            )}
          </div>

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="destructive"
              onClick={onClose}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isPending}
              className={`bg-[var(--tenant-primary)] hover:bg-[var(--tenant-primary)] hover:opacity-80`}
            >
              {isPending ? "Submitting..." : "Submit"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
