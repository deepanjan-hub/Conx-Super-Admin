import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CalendarIcon } from "lucide-react";
import { format, subMonths, subDays, startOfMonth, endOfMonth, subQuarters, startOfQuarter, endOfQuarter, startOfYear, subYears } from "date-fns";
import { cn } from "@/lib/utils";
import { DateRange } from "react-day-picker";

export type TimeRangeOption = "last_month" | "last_quarter" | "last_6_months" | "last_year" | "custom";

interface TimeRangeFilterProps {
  value: TimeRangeOption;
  onChange: (value: TimeRangeOption, dateRange?: DateRange) => void;
  className?: string;
}

const timeRangeLabels: Record<TimeRangeOption, string> = {
  last_month: "Last Month",
  last_quarter: "Last Quarter",
  last_6_months: "Last 6 Months",
  last_year: "Last Year",
  custom: "Custom Range",
};

export function getDateRangeForOption(option: TimeRangeOption): DateRange {
  const now = new Date();
  switch (option) {
    case "last_month":
      return {
        from: startOfMonth(subMonths(now, 1)),
        to: endOfMonth(subMonths(now, 1)),
      };
    case "last_quarter":
      return {
        from: startOfQuarter(subQuarters(now, 1)),
        to: endOfQuarter(subQuarters(now, 1)),
      };
    case "last_6_months":
      return {
        from: subMonths(now, 6),
        to: now,
      };
    case "last_year":
      return {
        from: startOfYear(subYears(now, 1)),
        to: now,
      };
    default:
      return {
        from: subMonths(now, 6),
        to: now,
      };
  }
}

export function TimeRangeFilter({ value, onChange, className }: TimeRangeFilterProps) {
  const today = new Date();
  const [customDateRange, setCustomDateRange] = useState<DateRange | undefined>({
    from: today,
    to: undefined,
  });
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const handleSelectChange = (newValue: TimeRangeOption) => {
    if (newValue === "custom") {
      // Reset to today as start date when opening custom
      setCustomDateRange({ from: today, to: undefined });
      onChange(newValue);
      setIsCalendarOpen(true);
    } else {
      onChange(newValue);
    }
  };

  const handleDateSelect = (range: DateRange | undefined) => {
    if (range) {
      // Ensure start date is not after end date and end date is not after today
      let validRange = { ...range };
      
      if (validRange.to && validRange.to > today) {
        validRange.to = today;
      }
      
      if (validRange.from && validRange.to && validRange.from > validRange.to) {
        validRange.from = validRange.to;
      }
      
      setCustomDateRange(validRange);
      
      if (validRange.from && validRange.to) {
        onChange("custom", validRange);
        setIsCalendarOpen(false);
      }
    }
  };

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <Select value={value} onValueChange={handleSelectChange}>
        <SelectTrigger className="w-[160px] h-9">
          <SelectValue placeholder="Select range" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="last_month">Last Month</SelectItem>
          <SelectItem value="last_quarter">Last Quarter</SelectItem>
          <SelectItem value="last_6_months">Last 6 Months</SelectItem>
          <SelectItem value="last_year">Last Year</SelectItem>
          <SelectItem value="custom">Custom Range</SelectItem>
        </SelectContent>
      </Select>

      {value === "custom" && (
        <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className={cn(
                "justify-start text-left font-normal h-9",
                !customDateRange?.to && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {customDateRange?.from ? (
                customDateRange.to ? (
                  <>
                    {format(customDateRange.from, "LLL dd, y")} -{" "}
                    {format(customDateRange.to, "LLL dd, y")}
                  </>
                ) : (
                  format(customDateRange.from, "LLL dd, y")
                )
              ) : (
                <span>Pick dates</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              initialFocus
              mode="range"
              defaultMonth={today}
              selected={customDateRange}
              onSelect={handleDateSelect}
              numberOfMonths={2}
              disabled={(date) => date > today}
              className="pointer-events-auto"
            />
          </PopoverContent>
        </Popover>
      )}
    </div>
  );
}
