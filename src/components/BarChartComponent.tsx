"use client";

import { Bar, BarChart, CartesianGrid, LabelList, XAxis } from "recharts";
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

export const description = "A bar chart with a label";

const chartConfig = {
  users: {
    label: "Users",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

// Function to generate last 6 months data including current month
const generateLast6MonthsData = () => {
  const months = [];
  const currentDate = new Date();

  for (let i = 5; i >= 0; i--) {
    const date = new Date(currentDate);
    date.setMonth(date.getMonth() - i);

    months.push({
      month: date.toLocaleString("default", { month: "long" }),
      year: date.getFullYear(),
      users: Math.floor(Math.random() * 300) + 50, // Replace with your actual data
    });
  }

  return months;
};

// Function to format date range (e.g., "January 2024 - June 2024")
const formatDateRange = (data: { month: string; year: number }[]) => {
  if (data.length === 0) return "";
  const first = data[0];
  const last = data[data.length - 1];
  return `${first.month} ${first.year} - ${last.month} ${last.year}`;
};

export default function BarchartComponent() {
  const chartData = generateLast6MonthsData();
  const dateRange = formatDateRange(chartData);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Active Members - Last 6 months</CardTitle>
        <CardDescription>{dateRange}</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart
            accessibilityLayer
            data={chartData}
            margin={{
              top: 20,
            }}
          >
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
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar dataKey="users" fill="#c092da" radius={8}>
              <LabelList
                position="top"
                offset={12}
                className="fill-foreground"
                fontSize={12}
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="text-muted-foreground leading-none">
          Showing total active members for the last 6 months
        </div>
      </CardFooter>
    </Card>
  );
}
