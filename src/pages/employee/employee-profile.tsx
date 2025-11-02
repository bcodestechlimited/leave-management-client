import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useEmployeeStore } from "@/store/use-employee-store";
import { cn, getEmployeeFullNameWithEmail } from "@/lib/utils";
import { updateEmployeeProfileAPI } from "@/api/employee.api";
import { toast } from "sonner";
import { UserCheck, UserX } from "lucide-react";
import { leaveBalanceService } from "@/api/leave-balance.api";

export default function EmployeeProfile() {
  const { employee } = useEmployeeStore();

  const {
    data: leaveBalances,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["leave-balance"],
    queryFn: () => leaveBalanceService.getLeaveBalances(),
    retry: false,
  });

  const handleDownload = (url: string) => {
    const link = document.createElement("a");
    link.href = url;
    link.download = url;
    link.click();
  };

  const { mutate, isPending } = useMutation({
    mutationFn: updateEmployeeProfileAPI,
    onSuccess: () => {
      toast.success("Profile updated successfully");
    },
    onError: (error) => {
      if (error instanceof Error) {
        return toast.error(error.message);
      }
      toast.error("Failed to update profile");
    },
  });

  const handleReturnFromLeave = () => {
    mutate({ isOnLeave: false });
  };

  return (
    <div className="mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-start">Employee Profile</h1>
      <div className="flex items-center justify-end gap-4 my-4">
        {/* <Button>Change Password</Button> */}

        <div className="flex gap-2">
          {employee?.isOnLeave ? (
            <Button
              disabled={isPending}
              onClick={() => {
                handleReturnFromLeave();
              }}
              className={`bg-[var(--tenant-primary)] hover:bg-[var(--tenant-primary)] hover:opacity-80`}
            >
              Are you back? Update your status
            </Button>
          ) : null}
          <p
            className={`border px-6 py-1 rounded-sm ${
              employee?.isOnLeave ? "border-red-500" : "border-green-500"
            }`}
          >
            {employee?.isOnLeave ? "On Leave" : "Available"}
          </p>
        </div>
        <Link to={"/dashboard/employee/profile/update"}>
          <Button
            style={{
              backgroundColor: employee?.clientId?.color || "black",
            }}
          >
            Update Profile
          </Button>
        </Link>
      </div>
      <div
        className={`bg-white shadow-md rounded-lg p-6 text-start ${cn(
          employee?.isOnLeave && "bg-red-600"
        )}`}
      >
        <div className="mb-4 flex flex-col gap-3">
          <img className="w-44 h-44 rounded-lg" src={employee?.avatar} alt="" />
          <h2 className="text-xl font-semibold">Personal Information</h2>
          <p className="text-gray-600">
            <span className="font-semibold">First Name: </span>
            {employee?.firstname ?? "N/A"}
          </p>
          <p className="text-gray-600">
            <span className="font-semibold">Middle Name: </span>
            {employee?.middlename ?? "N/A"}
          </p>
          <p className="text-gray-600">
            <span className="font-semibold">SurName: </span>
            {employee?.surname ?? "N/A"}
          </p>
          <p className="text-gray-600">
            <span className="font-semibold">Email: </span> {employee?.email}
          </p>
          {employee?.accountType === "employee" && (
            <div className="flex flex-col gap-2">
              <p className="text-gray-600">
                <span className="font-semibold">Gender: </span>
                <span className="capitalize">{employee?.gender ?? "N/A"}</span>
              </p>
              <p className="text-gray-600">
                <span className="font-semibold">Level: </span>
                <span className="capitalize">
                  {employee?.levelId?.name ?? "N/A"}
                </span>
              </p>
              <p className="text-gray-600">
                <span className="font-semibold">Job Role: </span>
                <span className="capitalize">{employee?.jobRole ?? "N/A"}</span>
              </p>
              <p className="text-gray-600">
                <span className="font-semibold">Branch: </span>
                <span className="capitalize">{employee?.branch ?? "N/A"}</span>
              </p>
              <p className="text-gray-600 flex gap-2 items-center">
                <span className="font-semibold">Line Manager: </span>
                {employee?.lineManager
                  ? getEmployeeFullNameWithEmail(employee?.lineManager)
                  : "N/A"}
                {/* {(employee?.lineManager?.name || employee?.lineManager?.email) ??
              "N/A"}{" "} */}
                {employee?.lineManager ? (
                  employee?.lineManager?.isOnLeave ? (
                    <UserX className="text-red-500" />
                  ) : (
                    <UserCheck className="text-green-500" />
                  )
                ) : null}
              </p>
              <p className="text-gray-600 flex gap-2 items-center">
                <span className="font-semibold">Reliever: </span>
                {employee?.reliever
                  ? getEmployeeFullNameWithEmail(employee?.reliever)
                  : "N/A"}{" "}
                {employee?.reliever ? (
                  employee?.reliever?.isOnLeave ? (
                    <UserX className="text-red-500" />
                  ) : (
                    <UserCheck className="text-green-500" />
                  )
                ) : null}
              </p>
            </div>
          )}
        </div>

        {/* Leave Balance Section */}
        {employee?.accountType === "employee" && (
          <div className="mt-6">
            <h2 className="text-xl font-semibold mb-4">Leave Balances</h2>
            <ul>
              {!isLoading &&
              !isError &&
              leaveBalances &&
              leaveBalances?.length > 0 ? (
                leaveBalances.map((leaveBalance: any, index: number) => (
                  <li key={index} className="mb-4">
                    <div className="flex justify-between">
                      <span className="font-semibold capitalize text-gray-600">
                        {leaveBalance.leaveType?.name ?? "N/A"}
                      </span>
                      <span>{leaveBalance.balance ?? 0} days</span>
                    </div>
                  </li>
                ))
              ) : (
                <p>No leave balances available.</p>
              )}
            </ul>
          </div>
        )}

        {/* Documents Section */}
        {employee && employee?.documents?.length > 0 && (
          <div className="mt-6">
            <h2 className="text-xl font-semibold mb-4">Documents</h2>
            <ul>
              {employee.documents.map((doc: any, index: number) => (
                <li key={doc._id} className="mb-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <a
                        href={doc.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500"
                      >
                        {doc.fileType === "image" ? (
                          <img
                            src={doc.url}
                            alt={`Document ${index + 1}`}
                            className="w-24 h-24 object-cover"
                          />
                        ) : (
                          <span className="underline">
                            {doc.url.split("/").pop()}
                          </span>
                        )}
                      </a>
                    </div>
                    <Button
                      onClick={() => handleDownload(doc.url)}
                      className="ml-4"
                    >
                      Download
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
