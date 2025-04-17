import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { useEmployeeActions, useEmployeeStore } from "@/store/useEmployeeStore";
import { cn } from "@/lib/utils";
import { updateEmployeeProfileAPI } from "@/api/employee.api";
import { toast } from "sonner";
import { UserCheck, UserX } from "lucide-react";

export default function EmployeeProfile() {
  const { employee } = useEmployeeStore();
  const { getAuthEmployee } = useEmployeeActions();

  // const { data: leaveBalance } = useQuery({
  //   queryKey: ["leaveBalance"],
  //   queryFn: getEmployeeLeaveBalance,
  // });

  // console.log(leaveBalance);

  const handleDownload = (url: string) => {
    const link = document.createElement("a");
    link.href = url;
    link.download = url;
    link.click();
  };

  console.log(employee);

  const { mutate, isPending } = useMutation({
    mutationFn: updateEmployeeProfileAPI,
    onSuccess: () => {
      toast.success("Profile updated successfully");
      getAuthEmployee();
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
              backgroundColor: employee?.tenantId?.color || "black",
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
            <span className="font-semibold">Name: </span>
            {employee?.name ?? "N/A"}
          </p>
          <p className="text-gray-600">
            <span className="font-semibold">Email: </span> {employee?.email}
          </p>
          <p className="text-gray-600">
            <span className="font-semibold">Job Role: </span>
            {employee?.jobRole ?? "N/A"}
          </p>
          <p className="text-gray-600">
            <span className="font-semibold">Level: </span>
            <span className="capitalize">
              {employee?.levelId?.name ?? "N/A"}
            </span>
          </p>
          <p className="text-gray-600 flex gap-2 items-center">
            <span className="font-semibold">Line Manager: </span>
            {(employee?.lineManager?.name || employee?.lineManager?.email) ??
              "N/A"}{" "}
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
            {(employee?.reliever?.name || employee?.reliever?.email) ?? "N/A"}
            {employee?.reliever ? (
              employee?.reliever?.isOnLeave ? (
                <UserX className="text-red-500" />
              ) : (
                <UserCheck className="text-green-500" />
              )
            ) : null}
          </p>
        </div>

        {/* Leave Balance Section */}
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-4">Leave Balances</h2>
          <ul>
            {employee?.leaveBalances && employee?.leaveBalances.length > 0 ? (
              employee?.leaveBalances.map((balance: any, index: number) => (
                <li key={index} className="mb-4">
                  <div className="flex justify-between">
                    <span className="font-semibold capitalize text-gray-600">
                      {balance.leaveTypeDetails?.name ?? "N/A"}
                    </span>
                    <span>{balance.balance ?? 0} days</span>
                  </div>
                </li>
              ))
            ) : (
              <p>No leave balances available.</p>
            )}
          </ul>
        </div>

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
