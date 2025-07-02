import {
  getAllTenants,
  getLeaveRequestAnalyticsForAdmin,
} from "@/api/admin.api";
import LeaveRequestsChart from "@/components/charts/leave-request-chart";
import { Loader } from "@/components/loader";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tenant } from "@/types/tenant.types";

export default function AdminDashboard() {
  const [selectedYear, setSelectedYear] = useState("2025");
  const [tenantId, setTenantId] = useState("");

  const {
    data: chartData,
    isLoading,
    isError,
  } = useQuery({
    queryFn: () =>
      getLeaveRequestAnalyticsForAdmin({ year: selectedYear, tenantId }),
    queryKey: ["lineManagerLeaves", selectedYear, tenantId],
    enabled: !!tenantId,
  });

  const {
    data: tenantsData,
    isLoading: tenantsLoading,
    isError: tenantsError,
  } = useQuery({
    queryFn: () => getAllTenants({ page: 1, limit: 10 }),
    queryKey: ["tenants"],
  });

  if (tenantsLoading) return <Loader isLoading={tenantsLoading} />;

  if (tenantsError)
    return (
      <div className="text-center py-4 text-red-500">
        Failed to load clients
      </div>
    );


  return (
    <div>
      <div className="flex justify-end">
        <Select value={tenantId || ""} onValueChange={setTenantId}>
          <SelectTrigger className="w-fit gap-4">
            <SelectValue placeholder={"Select Tenant"} className="px-12" />
          </SelectTrigger>
          <SelectContent>
            {tenantsData?.tenants.map((option: Tenant) => (
              <SelectItem key={option._id} value={option._id}>
                {option.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <Charts
        chartData={chartData}
        isLoading={isLoading}
        isError={isError}
        tenantId={tenantId}
        selectedYear={selectedYear}
        setSelectedYear={setSelectedYear}
      />
    </div>
  );
}

interface ChartsProps {
  chartData: any;
  isLoading: boolean;
  isError: boolean;
  tenantId: string;
  selectedYear: string;
  setSelectedYear: (year: string) => void;
}

function Charts({
  chartData,
  isLoading,
  isError,
  tenantId,
  selectedYear,
  setSelectedYear,
}: ChartsProps) {
  if (!tenantId) {
    return <div className="text-center py-4">Please select a client</div>;
  }
  if (isLoading) return <Loader isLoading={isLoading} />;

  if (isError)
    return (
      <div className="text-center py-4 text-red-500">Failed to load data</div>
    );

  return (
    <LeaveRequestsChart
      chartData={chartData}
      selectedYear={selectedYear}
      setSelectedYear={setSelectedYear}
    />
  );
}
