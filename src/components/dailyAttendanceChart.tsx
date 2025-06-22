"use client";

import { Bar, BarChart, CartesianGrid, LabelList, XAxis } from "recharts";
import { useEffect, useState } from "react";
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

export const description = "A bar chart showing daily attendance";

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

// Helper function to format date as "MMM DD" (e.g., "Jun 12")
const formatDate = (date: Date) => {
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
};

// Mock data generator for last 7 days
const generateLast7DaysData = () => {
  const data = [];
  const today = new Date();

  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);

    data.push({
      date: formatDate(date),
      // Replace this with your actual attendance data
      attendance: Math.floor(Math.random() * 100) + 50, // Random data for demo
    });
  }

  return data;
};

export default function DailyAttendanceChart() {
  const [chartData, setChartData] = useState<
    { date: string; attendance: number }[]
  >([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real app, you would fetch this data from your API
    const fetchData = () => {
      setLoading(true);
      try {
        // Simulate API call
        setTimeout(() => {
          const data = generateLast7DaysData();
          setChartData(data);
          setLoading(false);
        }, 500);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const today = new Date();
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6); // -6 to include today

  return (
    <Card>
      <CardHeader>
        <CardTitle>Daily Attendance - Last 07 Days</CardTitle>
        <CardDescription>
          from {formatDate(sevenDaysAgo)} to {formatDate(today)}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="h-[300px] flex items-center justify-center">
            Loading chart...
          </div>
        ) : (
          <ChartContainer config={chartConfig}>
            <BarChart
              width={500}
              height={300}
              data={chartData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="date"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Bar dataKey="attendance" fill="#8884d8" radius={8}>
                <LabelList
                  position="top"
                  offset={12}
                  className="fill-foreground"
                  fontSize={12}
                />
              </Bar>
            </BarChart>
          </ChartContainer>
        )}
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        {/* <div className="flex gap-2 leading-none font-medium">
          Trending up by 5.2% this week <TrendingUp className="h-4 w-4" />
        </div> */}
        <div className="text-muted-foreground leading-none">
          Showing daily attendance for the last 7 days
        </div>
      </CardFooter>
    </Card>
  );
}
