import { getEmployeeDetails } from "@/api/employee.api";
import { Loader } from "@/components/loader";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { UserCheck, UserX } from "lucide-react";
import { useParams } from "react-router-dom";

export default function EmployeeDetail() {
  const { employeeId } = useParams<{ employeeId: string }>();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["employeeDetail", employeeId],
    queryFn: () => getEmployeeDetails(employeeId),
  });

  if (isLoading) return <Loader isLoading={isLoading} />;
  if (isError) return <div>Error fetching details: {error.message}</div>;

  console.log(data?.employee);

  return (
    <div className="p-4 bg-white rounded-md shadow-md text-start">
      <h2 className="text-xl font-bold mb-4">Employee Details</h2>
      <div
        className={`text-start ${cn(
          data?.employee?.isOnLeave && "bg-red-600"
        )}`}
      >
        <div className="mb-4 flex flex-col gap-3">
          <img
            className="w-44 h-44 rounded-lg my-6"
            src={data?.employee?.avatar}
            alt=""
          />
          <h2 className="text-xl font-semibold">Personal Information</h2>
          <p className="text-gray-600">
            <span className="font-semibold">Name: </span>
            {data?.employee?.name ?? "N/A"}
          </p>
          <p className="text-gray-600">
            <span className="font-semibold">Email: </span>{" "}
            {data?.employee?.email}
          </p>
          <p className="text-gray-600">
            <span className="font-semibold">Job Role: </span>
            {data?.employee?.jobRole ?? "N/A"}
          </p>
          <p className="text-gray-600">
            <span className="font-semibold">Level: </span>
            <span className="capitalize">
              {data?.employee?.levelId?.name ?? "N/A"}
            </span>
          </p>
          <p className="text-gray-600 flex gap-2 items-center">
            <span className="font-semibold">Line Manager: </span>
            {(data?.employee?.lineManager?.name ||
              data?.employee?.lineManager?.email) ??
              "N/A"}{" "}
            {data?.employee?.lineManager ? (
              data?.employee?.lineManager?.isOnLeave ? (
                <UserX className="text-red-500" />
              ) : (
                <UserCheck className="text-green-500" />
              )
            ) : null}
          </p>
          <p className="text-gray-600 flex gap-2 items-center">
            <span className="font-semibold">Reliever: </span>
            {(data?.employee?.reliever?.name ||
              data?.employee?.reliever?.email) ??
              "N/A"}
            {data?.employee?.reliever ? (
              data?.employee?.reliever?.isOnLeave ? (
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
            {data?.leaveBalances && data?.leaveBalances.length > 0 ? (
              data?.leaveBalances.map((balance: any, index: number) => (
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
        {data?.employee && data?.employee?.documents?.length > 0 && (
          <div className="mt-6">
            <h2 className="text-xl font-semibold mb-4">Documents</h2>
            <ul>
              {data?.employee.documents.map((doc: any, index: number) => (
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
                      // onClick={() => handleDownload(doc.url)}
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
