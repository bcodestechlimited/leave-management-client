import { getAllLeaves } from "@/api/leave.api";
import DataTable from "@/components/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { formatDate, getStatusClasses } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { EllipsisVertical } from "lucide-react";
import { useSearchParams, Link } from "react-router-dom";

export default function TenantLeave() {
  const [searchParams] = useSearchParams();

  const page = parseInt(searchParams.get("page") || "1", 10);
  const search = searchParams.get("search") || "";

  const { data, isLoading } = useQuery({
    queryKey: ["leaves", { page, limit: 10, search }],
    queryFn: () => getAllLeaves({ page, limit: 10, search }),
  });

  const columns = [
    {
      header: "Name",
      render: (row: any) => row?.employee?.name || "N/A",
    },
    {
      header: "Line Manager",
      render: (row: any) => row?.lineManager?.name || "N/A",
    },
    {
      header: "Start Data",
      render: (row: any) => formatDate(row?.startDate) || "N/A",
    },
    {
      header: "Resumption Date",
      render: (row: any) => formatDate(row?.resumptionDate) || "N/A",
    },
    {
      header: "Status",
      render: (row: any) => (
        <span
          className={`capitalize p-4 w-full ${getStatusClasses(row?.status)}`}
        >
          {row?.status}
        </span>
      ),
    },
    {
      header: "Actions",
      render: (row: any) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="p-2 text-gray-600 hover:bg-gray-200 rounded-full outline-none"
              aria-label="Open actions"
            >
              <EllipsisVertical />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-fit">
            <Link to={`/dashboard/tenant/leave/${row._id}`}>
              <DropdownMenuItem className=" cursor-pointer">
                View
              </DropdownMenuItem>
            </Link>
            {/* <Link to={`/admin-dashboard/course/${row._id}/edit`}>
              <DropdownMenuItem className=" cursor-pointer">
                Edit
              </DropdownMenuItem>
            </Link> */}
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-lg font-semibold">Leave History</h1>
      </div>

      <DataTable
        columns={columns}
        data={data?.leaveRequests || []}
        isLoading={isLoading}
        noDataMessage="No leave request found."
        pagination={data?.pagination}
      />
    </div>
  );
}
