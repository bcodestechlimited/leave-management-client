import { getEmployeeLeaveBalances } from "@/api/admin.api";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import ILeaveBalance from "@/interfaces/leave-balance";

export default function LeaveBalances() {
  const { employeeId } = useParams();

  const {
    data,
    isLoading: isLoadingBalances,
    isError,
  } = useQuery({
    queryKey: ["leave-balance"],
    queryFn: () => getEmployeeLeaveBalances(employeeId as string),
    enabled: !!employeeId,
  });

  const leaveBalances = data?.data?.leaveBalances;

  console.log({ leaveBalances });

  if (isLoadingBalances) return <div>Loading...</div>;
  if (isError) return <div>Error</div>;

  return (
    <div>
      <h3 className="text-2xl font-semibold mb-4">Leave Balances</h3>
      <div className=" grid grid-cols-1 gap-2">
        {leaveBalances?.map((leaveBalance: ILeaveBalance) => (
          <Card
            className="shadow-none rounded p-0 text-start"
            key={leaveBalance._id}
          >
            <CardContent className="p-6">
              <p className="font-medium">
                Leave Type:{" "}
                <span className=" capitalize">
                  {leaveBalance.leaveType.name}
                </span>
              </p>
              <p className="text-sm text-muted-foreground">
                Balance: {leaveBalance.balance} days left
              </p>
              <p className="text-xs mt-2">
                Total: {leaveBalance.leaveType.defaultBalance}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
      {/* <Card className="shadow-none rounded ">
        <CardHeader>
          <CardTitle className=" text-start">Leave Balances</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-4 text-start">
          {[1, 2, 3].map((leave) => (
            <div
              key={leave}
              className="p-4 rounded-xl border bg-muted/30 hover:bg-muted transition"
            >
              <p className="font-semibold">-</p>
              <p className="text-sm text-muted-foreground">-</p>
              <p className="text-xs mt-2">-</p>
            </div>
          ))}
        </CardContent>
      </Card> */}
    </div>
  );
}
