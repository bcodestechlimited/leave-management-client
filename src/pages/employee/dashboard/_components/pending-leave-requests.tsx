import { getEmployeeLeaves } from "@/api/leave.api";
import DataTable from "@/components/table";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { formatDate, getEmployeeFullName, getStatusClasses } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { Eye } from "lucide-react";
import { Link } from "react-router-dom";

export default function PendingLeaveRequests() {
  const { data, isLoading } = useQuery({
    queryKey: ["employee-leaves"],
    queryFn: () => getEmployeeLeaves({ page: 1, limit: 5, status: "pending" }),
  });

  console.log({ data });

  const columns = [
    // {
    //   header: "Employee",
    //   render: (row: any) => getEmployeeFullName(row?.employee) || "N/A",
    // },
    {
      header: "Line Manager",
      render: (row: any) => getEmployeeFullName(row?.lineManager) || "N/A",
    },
    {
      header: "Start Date",
      render: (row: any) => {
        return <span>{formatDate(row.startDate)}</span>;
      },
    },
    {
      header: "Resumption Date",
      render: (row: any) => {
        return <span>{formatDate(row.resumptionDate)}</span>;
      },
    },
    {
      header: "Status",
      render: (row: any) => (
        <span className={`capitalize p-2 ${getStatusClasses(row.status)}`}>
          {row.status}
        </span>
      ),
    },
    {
      header: "Action",
      render: (row: any) => (
        <div className="flex gap-2">
          <Link to={`/dashboard/employee/leave/leave-request/${row._id}`}>
            <Eye />
          </Link>
        </div>
      ),
    },
  ];

  if (isLoading) {
    return (
      <Card className="rounded-2xl shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg">Pending Requests</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <p>Loading...</p>
        </CardContent>
      </Card>
    );
  }

  if (data?.leaveRequests?.length < 1) {
    return (
      <Card className="rounded-2xl shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg text-start">Pending Requests</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <p>No pending approval.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="rounded-2xl shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg text-start">Pending Requests</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <DataTable
          columns={columns}
          data={data?.leaveRequests || []}
          isLoading={isLoading}
          noDataMessage="No leaves found."
          pagination={data?.pagination}
        />
      </CardContent>
    </Card>
  );
}
