import { leaveBalanceService } from "@/api/leave-balance.api";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import { CalendarDays } from "lucide-react";

export default function LeaveBalances() {
  const {
    data: leaveBalances,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["leave-balance"],
    queryFn: () => leaveBalanceService.getLeaveBalances(),
    retry: false,
  });

  if (isLoading)
    return (
      <Card className="rounded-2xl shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <CalendarDays size={18} /> Leave Balances
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-3 pl-6">
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-36" />
          </div>
        </CardContent>
      </Card>
    );

  if (isError) return <div>Error</div>;

  return (
    <Card className="rounded-2xl shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <CalendarDays size={18} /> Leave Balances
        </CardTitle>
      </CardHeader>
      <CardContent>
        {leaveBalances?.length > 0 ? (
          <ul className="list-disc pl-6 space-y-3">
            {leaveBalances.map((leaveBalance: any, index: number) => (
              <li key={index}>
                <div className="flex justify-between">
                  <span className="font-semibold capitalize text-gray-600">
                    {leaveBalance.leaveType?.name ?? "N/A"}
                  </span>
                  <span>{leaveBalance.balance ?? 0} days</span>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p>No leave balances available.</p>
        )}
      </CardContent>
    </Card>
  );
}
