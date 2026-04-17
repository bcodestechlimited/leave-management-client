import { useForm } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SearchableDropdown } from "@/components/searchable-dropdown";
import { CustomDropdown } from "@/components/custom-dropdown";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateEmployeeDetailsByTenant } from "@/api/tenant.api";
import { toast } from "sonner";
import { useParams } from "react-router-dom";
import {
  getEmployeeFullName,
  handleFetchEmployees,
  handleFetchLevels,
  handleFetchLineManagers,
} from "@/lib/utils";
import { IEmployee } from "@/types/employee.types";
import { useAdminEmployee } from "@/hooks/use-employees";
import { useClientStore } from "@/store/client.store";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { addMonths, format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { CustomAlert } from "@/components/custom-alert";
import LeaveBalances from "./_components/leave-balances";

interface FormValues {
  _id: string;
  staffId: string;
  firstname: string;
  middlename: string;
  surname: string;
  gender: string;
  email: string;
  lineManager: string | null;
  reliever: string | null;
  jobRole: string;
  levelId: string;
  isAdmin: boolean;
  employmentStartDate: Date | null;
}

export default function AdminEmployeeDetail() {
  const { clientId } = useClientStore();

  const { employeeId } = useParams();
  const queryClient = useQueryClient();

  const { data, isLoading } = useAdminEmployee(clientId, employeeId as string);

  const employee = data?.employee;

  console.log({ employee });

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    clearErrors,
  } = useForm<FormValues>({
    values: employee
      ? {
          _id: employee?._id || "",
          staffId: employee?.staffId || "",
          firstname: employee?.firstname || "",
          middlename: employee?.middlename || "",
          surname: employee?.surname || "",
          gender: employee?.gender || "male",
          email: employee?.email || "",
          lineManager: employee?.lineManager?._id || null,
          reliever: employee?.reliever?._id || null,
          jobRole: employee?.jobRole || "",
          isAdmin: employee?.isAdmin || false,
          levelId: employee?.levelId?._id || "",
          employmentStartDate: employee?.employmentStartDate
            ? new Date(employee.employmentStartDate)
            : null,
        }
      : {
          _id: "",
          staffId: "",
          firstname: "",
          middlename: "",
          surname: "",
          gender: "male",
          email: "",
          lineManager: null,
          reliever: null,
          jobRole: "",
          isAdmin: false,
          levelId: "",
          employmentStartDate: null,
        },
  });

  const editMutation = useMutation({
    mutationFn: (data: FormValues) => updateEmployeeDetailsByTenant(data),
    onSuccess: () => {
      toast.success("Employee updated successfully");
      queryClient.invalidateQueries({ queryKey: ["getAllEmployees"] });
    },
    onError: () => toast.error("Something went wrong"),
  });

  const onSubmit = async (data: FormValues) => {
    await editMutation.mutateAsync(data);
  };

  const employmentDate = watch("employmentStartDate");

  const eligibleLeaveDate = employmentDate
    ? addMonths(new Date(employmentDate), 6)
    : null;

  const formattedEligibleDate = eligibleLeaveDate
    ? format(eligibleLeaveDate, "PPP")
    : "N/A";

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!employee) {
    return <div>Employee not found</div>;
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between text-start">
        <div>
          <h1 className="text-2xl font-bold">Employee Details</h1>
          <p className="text-muted-foreground text-sm">
            Manage employee information
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-2">
        {/* LEFT: FORM */}
        <Card className="lg:col-span-2 shadow-none rounded">
          <CardHeader>
            <CardTitle className="text-start">Personal Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-start">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <div>
                <Label>Staff ID</Label>
                <Input {...register("staffId")} />
              </div>
              <div>
                <Label>Email</Label>
                <Input {...register("email")} />
              </div>
              <div>
                <Label>First Name</Label>
                <Input {...register("firstname")} />
              </div>
              <div>
                <Label>Middle Name</Label>
                <Input {...register("middlename")} />
              </div>
              <div>
                <Label>Surname</Label>
                <Input {...register("surname")} />
              </div>
              <div>
                <Label>Job Role</Label>
                <Input {...register("jobRole")} />
              </div>
            </div>

            <CustomDropdown
              label="Gender"
              placeholder="Select gender"
              value={watch("gender") ?? ""}
              onChange={(value) => {
                setValue("gender", value as "male" | "female");
                clearErrors("gender");
              }}
              options={[
                { label: "Male", value: "male" },
                { label: "Female", value: "female" },
              ]}
              error={errors.gender?.message}
            />

            {/* Level */}
            <div>
              <Label>Level</Label>
              <SearchableDropdown
                searchInputPlaceholder="Search level"
                placeholder={employee?.levelId?.name || "Select level"}
                fetchOptions={handleFetchLevels}
                onChange={({ value }) => {
                  setValue("levelId", value);
                  clearErrors("levelId");
                }}
              />
            </div>

            {/* Managers */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <div>
                <Label>Line Manager</Label>
                <SearchableDropdown
                  fetchOptions={handleFetchLineManagers}
                  placeholder={getEmployeeFullName(
                    employee?.lineManager as IEmployee,
                  )}
                  onChange={({ value }) => setValue("lineManager", value)}
                />
              </div>

              <div>
                <Label>Reliever</Label>
                <SearchableDropdown
                  fetchOptions={handleFetchEmployees}
                  placeholder={getEmployeeFullName(
                    employee?.reliever as IEmployee,
                  )}
                  onChange={({ value }) => setValue("reliever", value)}
                />
              </div>
            </div>

            <CustomAlert
              variant="warning"
              title="Leave Eligibility"
              description={`This employee can only apply for leave 6 months after their employment start date (${formattedEligibleDate}). Updating this date will affect their leave eligibility.`}
            />

            <div>
              <Label>Employment Start Date</Label>

              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {watch("employmentStartDate") ? (
                      format(watch("employmentStartDate") as Date, "PPP")
                    ) : (
                      <span className="text-muted-foreground">Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>

                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={watch("employmentStartDate") || undefined}
                    onSelect={(date) => {
                      setValue("employmentStartDate", date || null);
                      clearErrors("employmentStartDate");
                    }}
                    // disabled={(date) => date > new Date()} // prevents future dates
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="flex justify-end">
              <Button
                onClick={handleSubmit(onSubmit)}
                disabled={editMutation.isPending}
                className=" rounded"
              >
                {editMutation.isPending ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* RIGHT: SUMMARY + LEAVES */}
        <div className="space-y-2">
          {/* Summary Card */}
          <Card className="shadow-none rounded ">
            <CardHeader>
              <CardTitle className="text-start">Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-start">
              <p>
                <strong>Name:</strong>{" "}
                {getEmployeeFullName(employee as IEmployee)}
              </p>
              <p>
                <strong>Role:</strong> {employee?.jobRole || "N/A"}
              </p>
              <p className=" capitalize">
                <strong>Leave Level:</strong> {employee?.levelId?.name || "N/A"}
              </p>
            </CardContent>
          </Card>

          {/* Leaves Section */}
          <LeaveBalances />
        </div>
      </div>
    </div>
  );
}
