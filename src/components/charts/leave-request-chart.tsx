import { TrendingDown, TrendingUp } from "lucide-react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const chartConfig = {
  totalLeaveRequests: {
    label: "Leave Requests",
    color: "hsl(var(--chart-1))",
  },
  pendingRequests: {
    label: "Pending Requests",
    color: "hsl(var(--chart-2))",
  },
  approvedRequests: {
    label: "Approved Requests",
    color: "hsl(var(--chart-3))",
  },
  rejectedRequests: {
    label: "Rejected Requests",
    color: "hsl(var(--chart-4))",
  },
} satisfies ChartConfig;

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

interface ChartData {
  selectedYear: string;
  setSelectedYear: (year: string) => void;
  chartData: any[];
}

export default function LeaveRequestsChart({
  selectedYear,
  setSelectedYear,
  chartData,
}: ChartData) {
  // Get current month index (0-based)
  const currentMonthIndex = new Date().getMonth();

  // Handle edge case for January (previous month should be December of the last year)
  const lastMonthName = months[currentMonthIndex] || null;
  const prevMonthName =
    currentMonthIndex === 0 ? "December" : months[currentMonthIndex - 1];

  // Get leave request data for the current and previous months
  const lastMonthData =
    chartData?.find((d: any) => d.month === lastMonthName)
      ?.totalLeaveRequests || 0;
  const prevMonthData =
    chartData?.find((d: any) => d.month === prevMonthName)
      ?.totalLeaveRequests || 0;

  // Calculate percentage change
  let percentageChange: string | number = "New Data Available";
  if (prevMonthData > 0) {
    percentageChange = ((lastMonthData - prevMonthData) / prevMonthData) * 100;
    percentageChange = percentageChange.toFixed(1) + "%";
  } else if (prevMonthData === 0 && lastMonthData > 0) {
    percentageChange = "100%";
  } else {
    percentageChange = "No change";
  }

  console.log({ lastMonthData, prevMonthData, lastMonthName, prevMonthName });

  return (
    <Card className="w-full my-6">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-start">
            Monthly Leave Request Breakdown
          </CardTitle>
          <CardDescription className="text-start">
            January - December {selectedYear}
          </CardDescription>
        </div>
        <Select value={selectedYear} onValueChange={setSelectedYear}>
          <SelectTrigger className="w-24">
            <SelectValue placeholder="Year" />
          </SelectTrigger>
          <SelectContent>
            {Array.from({ length: 6 }, (_, i) => 2025 + i).map((year) => (
              <SelectItem key={year} value={year.toString()}>
                {year}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="min-w-80 w-full h-64">
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dashed" />}
            />
            <Bar
              dataKey="totalLeaveRequests"
              fill={chartConfig.totalLeaveRequests.color}
              radius={4}
            />
            <Bar
              dataKey="pendingRequests"
              fill={chartConfig.pendingRequests.color}
              radius={4}
            />
            <Bar
              dataKey="approvedRequests"
              fill={chartConfig.approvedRequests.color}
              radius={4}
            />
            <Bar
              dataKey="rejectedRequests"
              fill={chartConfig.rejectedRequests.color}
              radius={4}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          {typeof percentageChange === "string" ? (
            <span className="text-gray-500 flex gap-2">
              Trending up by {percentageChange} this month
              <TrendingUp className="h-4 w-4" />
            </span>
          ) : (
            <>
              {percentageChange > 0 ? (
                <span className="text-green-500">
                  Trending up by {percentageChange} this month
                </span>
              ) : (
                <span className="text-red-500">
                  Trending down by {Math.abs(Number(percentageChange))}% this
                  month
                </span>
              )}
              {percentageChange > 0 ? (
                <TrendingUp className="h-4 w-4 text-green-500" />
              ) : (
                <TrendingDown className="h-4 w-4 text-red-500" />
              )}
            </>
          )}
        </div>
        <div className="leading-none text-muted-foreground">
          Showing total leave requests for the last 12 months
        </div>
      </CardFooter>
    </Card>
  );
}
