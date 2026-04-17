import EmployeesByClientChart from "./_components/employees-by-client-chart";
import LeaveRequestsChart from "./_components/leave-request-chart";

export default function AdminDashboard() {
  return (
    <div>
      <LeaveRequestsChart />
      <EmployeesByClientChart />
    </div>
  );
}
