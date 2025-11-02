import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Eye, PlusCircle } from "lucide-react";
import ApplyLeaveModal from "./modals/apply-leave-modal";
import { useQuery } from "@tanstack/react-query";
import { formatDate, getStatusClasses } from "@/lib/utils";
import { getEmployeeLeaves } from "@/api/leave.api";
import { Link, useSearchParams } from "react-router-dom";
import DataTable from "@/components/table";
import { useEmployeeStore } from "@/store/use-employee-store";

export default function EmployeeLeave() {
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);

  const { employee } = useEmployeeStore();

  const [searchParams] = useSearchParams();
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "10", 10);

  const { data, isLoading } = useQuery({
    queryKey: ["employee-leaves", { page, limit }],
    queryFn: () => getEmployeeLeaves({ page, limit }),
  });

  const columns = [
    {
      header: "Employee",
      render: (row: any) => row?.employee?.firstname || "N/A",
    },
    {
      header: "Line Manager",
      render: (row: any) => row?.lineManager?.firstname || "N/A",
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

  const openApplyModal = () => setIsApplyModalOpen(true);
  const closeApplyModal = () => setIsApplyModalOpen(false);

  console.log(employee);

  return (
    <div className="">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-lg font-semibold">Leave History</h1>
        <Button
          className={`bg-[var(--tenant-primary)] hover:bg-[var(--tenant-primary)] hover:opacity-80`}
          onClick={openApplyModal}
        >
          <PlusCircle size={16} className="mr-2" />
          Apply for Leave
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={data?.leaveRequests || []}
        isLoading={isLoading}
        noDataMessage="No leaves found."
        pagination={data?.pagination}
      />

      <ApplyLeaveModal isOpen={isApplyModalOpen} onClose={closeApplyModal} />
    </div>
  );
}
