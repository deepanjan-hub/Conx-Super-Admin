import { useState, useMemo } from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { TimeRangeFilter, TimeRangeOption } from "@/components/shared/TimeRangeFilter";
import { DateRange } from "react-day-picker";
import { isWithinInterval, parse } from "date-fns";

// Data reflecting last 12 months ending February 2026
const allData = [
  { month: "Mar 25", revenue: 35000, target: 40000, date: new Date(2025, 2, 1) },
  { month: "Apr 25", revenue: 38000, target: 42000, date: new Date(2025, 3, 1) },
  { month: "May 25", revenue: 42000, target: 45000, date: new Date(2025, 4, 1) },
  { month: "Jun 25", revenue: 45000, target: 47000, date: new Date(2025, 5, 1) },
  { month: "Jul 25", revenue: 48000, target: 50000, date: new Date(2025, 6, 1) },
  { month: "Aug 25", revenue: 52000, target: 52000, date: new Date(2025, 7, 1) },
  { month: "Sep 25", revenue: 58000, target: 55000, date: new Date(2025, 8, 1) },
  { month: "Oct 25", revenue: 62000, target: 58000, date: new Date(2025, 9, 1) },
  { month: "Nov 25", revenue: 71000, target: 62000, date: new Date(2025, 10, 1) },
  { month: "Dec 25", revenue: 78000, target: 68000, date: new Date(2025, 11, 1) },
  { month: "Jan 26", revenue: 85000, target: 75000, date: new Date(2026, 0, 1) },
  { month: "Feb 26", revenue: 92000, target: 82000, date: new Date(2026, 1, 1) },
];

const getDataForRange = (range: TimeRangeOption, customRange?: DateRange): typeof allData => {
  switch (range) {
    case "last_month":
      return allData.slice(-1);
    case "last_quarter":
      return allData.slice(-3);
    case "last_6_months":
      return allData.slice(-6);
    case "last_year":
      return allData;
    case "custom":
      if (customRange?.from && customRange?.to) {
        return allData.filter(item => 
          isWithinInterval(item.date, { start: customRange.from!, end: customRange.to! })
        );
      }
      return allData.slice(-6);
    default:
      return allData.slice(-6);
  }
};

export function RevenueChart() {
  const [timeRange, setTimeRange] = useState<TimeRangeOption>("last_6_months");
  const [customDateRange, setCustomDateRange] = useState<DateRange | undefined>(undefined);

  const handleTimeRangeChange = (value: TimeRangeOption, dateRange?: DateRange) => {
    setTimeRange(value);
    if (value === "custom" && dateRange) {
      setCustomDateRange(dateRange);
    } else if (value !== "custom") {
      setCustomDateRange(undefined);
    }
  };

  const data = useMemo(() => getDataForRange(timeRange, customDateRange), [timeRange, customDateRange]);

  return (
    <div className="rounded-xl border bg-card p-6 shadow-card">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Revenue Overview</h3>
          <p className="text-sm text-muted-foreground">Monthly recurring revenue vs target</p>
        </div>
        <TimeRangeFilter value={timeRange} onChange={handleTimeRangeChange} />
      </div>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(221, 83%, 53%)" stopOpacity={0.2} />
                <stop offset="95%" stopColor="hsl(221, 83%, 53%)" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorTarget" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(142, 76%, 36%)" stopOpacity={0.1} />
                <stop offset="95%" stopColor="hsl(142, 76%, 36%)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 13%, 91%)" vertical={false} />
            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: "hsl(220, 9%, 46%)" }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: "hsl(220, 9%, 46%)" }}
              tickFormatter={(value) => `$${value / 1000}k`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(0, 0%, 100%)",
                border: "1px solid hsl(220, 13%, 91%)",
                borderRadius: "8px",
                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
              }}
              formatter={(value: number) => [`$${value.toLocaleString()}`, ""]}
              labelStyle={{ color: "hsl(222, 47%, 11%)", fontWeight: 600 }}
            />
            <Area
              type="monotone"
              dataKey="target"
              stroke="hsl(142, 76%, 36%)"
              strokeWidth={2}
              strokeDasharray="5 5"
              fill="url(#colorTarget)"
              name="Target"
            />
            <Area
              type="monotone"
              dataKey="revenue"
              stroke="hsl(221, 83%, 53%)"
              strokeWidth={2}
              fill="url(#colorRevenue)"
              name="Revenue"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-4 flex items-center justify-center gap-6">
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-primary" />
          <span className="text-sm text-muted-foreground">Revenue</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-success" />
          <span className="text-sm text-muted-foreground">Target</span>
        </div>
      </div>
    </div>
  );
}
