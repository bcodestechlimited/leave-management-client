import { getLeaveRequestAnalyticsForAdmin } from "@/api/admin.api";
import LeaveRequestsChart from "@/components/charts/leave-request-chart";
import { Loader } from "@/components/loader";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import SwitchTenants from "./_components/switch-tenants";

export default function AdminDashboard() {
  const [selectedYear, setSelectedYear] = useState("2025");
  const [tenantId, setTenantId] = useState<string>(
    () => localStorage.getItem("tenant-id") || ""
  );

  const {
    data: chartData,
    isLoading,
    isError,
  } = useQuery({
    queryFn: () =>
      getLeaveRequestAnalyticsForAdmin({ year: selectedYear, tenantId }),
    queryKey: ["leave-request-analytics", selectedYear, tenantId],
    enabled: !!tenantId,
  });

  return (
    <div>
      <SwitchTenants tenantId={tenantId} setTenantId={setTenantId} />
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
