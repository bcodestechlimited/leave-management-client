import { Loader } from "lucide-react";
import { PieChart, Pie, Cell, Tooltip } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { getTotalEmployeesByClient } from "@/api/admin.api";

// You can expand this if you have many clients
const COLORS = [
  "#6366f1",
  "#22c55e",
  "#f59e0b",
  "#ef4444",
  "#06b6d4",
  "#a855f7",
  "#84cc16",
  "#f97316",
];

export default function EmployeesByClientChart() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["employees-by-client"],
    queryFn: getTotalEmployeesByClient,
  });

  const chartData = data?.data?.analytics || [];

  console.log({ chartData });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-6">
        <Loader className="animate-spin" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center text-red-500 py-6">Failed to load data</div>
    );
  }

  return (
    <Card className="w-full my-6 text-start">
      <CardHeader>
        <CardTitle>Total Employees by Client</CardTitle>
        <CardDescription>
          Distribution of employees across all clients
        </CardDescription>
      </CardHeader>

      <CardContent className="flex flex-col items-center">
        <PieChart width={800} height={300}>
          <Pie
            data={chartData}
            dataKey="totalEmployees"
            nameKey="clientName"
            cx="50%"
            cy="50%"
            outerRadius={100}
            label={({ clientName, percent }) =>
              `${clientName} (${(percent * 100).toFixed(0)}%)`
            }
          >
            {chartData.map((_: any, index: number) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>

          <Tooltip />
        </PieChart>

        {/* Legend */}
        <div className="mt-4 grid grid-cols-2 gap-2 w-full">
          {chartData &&
            chartData?.map((item: any, index: number) => (
              <div key={index} className="flex items-center gap-2 text-sm">
                <span
                  className="w-3 h-3 rounded-full"
                  style={{
                    backgroundColor: COLORS[index % COLORS.length],
                  }}
                />
                <span>
                  {item.clientName} ({item.totalEmployees})
                </span>
              </div>
            ))}
        </div>
      </CardContent>
    </Card>
  );
}
