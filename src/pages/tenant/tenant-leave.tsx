import { getAllLeaves, getMonthlyLeaveReport } from "@/api/leave.api";
import DataTable from "@/components/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { formatDate, getEmployeeFullName, getStatusClasses } from "@/lib/utils";
import { useMutation, useQuery } from "@tanstack/react-query";
import { CalendarIcon, EllipsisVertical } from "lucide-react";
import { useSearchParams, Link } from "react-router-dom";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useState } from "react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { toast } from "sonner";

export default function TenantLeave() {
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [searchParams] = useSearchParams();

  const page = parseInt(searchParams.get("page") || "1", 10);
  const search = searchParams.get("search") || "";

  const { data, isLoading } = useQuery({
    queryKey: ["leaves", { page, limit: 10, search }],
    queryFn: () => getAllLeaves({ page, limit: 10, search }),
  });

  const monthlyReportMutation = useMutation({
    mutationFn: (params: { startDate: string; endDate: string }) =>
      getMonthlyLeaveReport(params),
    onSuccess: (blob) => {
      // Create a URL and trigger download
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "monthly-leave-report.xlsx"); // Adjust name/extension as needed
      document.body.appendChild(link);
      link.click();
      link.remove();
    },
    onError: (error: any) => {
      alert("Failed to download report. Try again.");
      console.error(error);
    },
  });

  const handleDownloadReport = async () => {
    if (!startDate || !endDate) return toast.error("Select both dates.");
    if (startDate > endDate)
      return toast.error("Start date must be before end date.");

    await monthlyReportMutation.mutateAsync({
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
    });
  };

  const columns = [
    {
      header: "Name",
      render: (row: any) => getEmployeeFullName(row?.employee) || "N/A",
    },
    {
      header: "Line Manager",
      render: (row: any) => getEmployeeFullName(row?.lineManager) || "N/A",
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
        <div className="flex items-end justify-between gap-4 flex-wrap">
          <div className="flex gap-4 flex-wrap">
            <div className="flex flex-col  items-start">
              <label className="block text-sm mb-1">Start Date</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-[200px] justify-start text-left font-normal"
                  >
                    {startDate ? format(startDate, "PPP") : "Pick a date"}
                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={startDate}
                    onSelect={(date) => setStartDate(date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="flex flex-col  items-start">
              <label className="block text-sm mb-1">End Date</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-[200px] justify-start text-left font-normal"
                  >
                    {endDate ? format(endDate, "PPP") : "Pick a date"}
                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={endDate}
                    onSelect={setEndDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <Button onClick={handleDownloadReport}>Download Report</Button>
        </div>
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
