import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, UserCheck } from "lucide-react";
import LeaveBalances from "./_components/leave-balances";
import { useEmployeeStore } from "@/store/use-employee-store";
import { getEmployeeFullName, getEmployeeInitials } from "@/lib/utils";
import { IEmployee } from "@/types/employee.types";
import { Link } from "react-router-dom";
import PendingLeaveRequests from "./_components/pending-leave-requests";

export default function EmployeeDashboard() {
  const { employee } = useEmployeeStore();

  console.log({ employee });

  if (!employee) return null;

  if (employee.accountType === "lineManager") {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="text-start">
          <h1 className="text-2xl font-semibold">
            Welcome {employee?.firstname} 👋
          </h1>
          <p className="text-muted-foreground">Here is your leave overview</p>
        </div>

        {/* Quick Actions */}
        <div className="flex gap-3">
          <Button variant="outline" className="rounded-lg px-6">
            <a href="mailto:leave@icsoutsourcing.com"> Contact HR</a>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-start">
        <h1 className="text-2xl font-semibold">
          Welcome {employee?.firstname} 👋
        </h1>
        <p className="text-muted-foreground">Here is your leave overview</p>
      </div>

      {/* Quick Actions */}
      <div className="flex gap-3">
        <Button className="rounded-lg px-6">
          <Link to={"/dashboard/employee/leave"}>Apply for Leave</Link>
        </Button>
        {/* <Button variant="outline" className="rounded-lg px-6">
          View Leave Policy
        </Button> */}
        <Button variant="outline" className="rounded-lg px-6">
          <a href="mailto:leave@icsoutsourcing.com"> Contact HR</a>
        </Button>
      </div>

      <LeaveBalances />

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Leave Balance */}

        {/* Manager */}
        <Card className="rounded-2xl shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <User size={18} /> Reporting To
            </CardTitle>
          </CardHeader>
          {employee?.lineManager ? (
            <CardContent className="flex items-center gap-4">
              <Avatar className="h-12 w-12">
                <AvatarImage src={employee?.lineManager?.avatar} />
                <AvatarFallback>
                  {getEmployeeInitials(employee?.lineManager as IEmployee)}
                </AvatarFallback>
              </Avatar>
              <div className="text-start">
                {employee?.lineManager
                  ? getEmployeeFullName(employee?.lineManager)
                  : "N/A"}
                <p className="text-sm text-muted-foreground">
                  {employee?.lineManager.jobRole || "--"}
                </p>
              </div>
            </CardContent>
          ) : (
            <CardContent className="flex items-center gap-4">
              <div className="text-start flex flex-col items-start gap-2">
                <p className="text-sm text-muted-foreground">
                  You don't have a line manager yet
                </p>
                <Button>
                  <Link to={"/dashboard/employee/profile/update"}>
                    Add Line Manager
                  </Link>
                </Button>
              </div>
            </CardContent>
          )}
        </Card>

        {/* Reliever */}
        <Card className="rounded-2xl shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <UserCheck size={18} /> Reliever
            </CardTitle>
          </CardHeader>
          {employee?.reliever ? (
            <CardContent className="flex items-center gap-4">
              <Avatar className="h-12 w-12">
                <AvatarImage src={employee?.reliever?.avatar} />
                <AvatarFallback>
                  {getEmployeeInitials(employee?.reliever as IEmployee)}
                </AvatarFallback>
              </Avatar>
              <div className="text-start">
                {employee?.reliever
                  ? getEmployeeFullName(employee?.reliever)
                  : "N/A"}
                <p className="text-sm text-muted-foreground">
                  {employee?.reliever.jobRole || "--"}
                </p>
              </div>
            </CardContent>
          ) : (
            <CardContent className="flex items-center gap-4">
              <div className="text-start flex flex-col items-start gap-2">
                <p className="text-sm text-muted-foreground">
                  You don't have a reliever yet
                </p>
                <Button>
                  <Link to={"/dashboard/employee/profile/update"}>
                    Add reliever
                  </Link>
                </Button>
              </div>
            </CardContent>
          )}
        </Card>
      </div>

      {/* Pending Leave Requests */}
      <PendingLeaveRequests />

      {/* Chart Placeholder */}
      <Card className="rounded-2xl shadow-sm p-6 h-64 flex items-center justify-center text-muted-foreground">
        Chart coming soon...
      </Card>
    </div>
  );
}
