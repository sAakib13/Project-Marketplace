"use client";

import * as React from "react";
import { CalendarIcon } from "lucide-react";
import { format, isValid, parseISO, startOfDay, endOfDay } from "date-fns";
import { DateRange } from "react-day-picker";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";

interface DateRangeFilterProps {
  dateRange: DateRange | undefined;
  onDateRangeChange: (range: DateRange | undefined) => void;
  className?: string;
  placeholder?: string;
  disabled?: boolean;
}

export function DateRangeFilter({
  dateRange,
  onDateRangeChange,
  className,
  placeholder = "Pick a date range",
  disabled = false,
}: DateRangeFilterProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  const formatDateRange = (range: DateRange | undefined) => {
    if (!range?.from) return placeholder;
    
    if (!range.to) {
      return format(range.from, "LLL dd, y");
    }
    
    if (range.from.getTime() === range.to.getTime()) {
      return format(range.from, "LLL dd, y");
    }
    
    return `${format(range.from, "LLL dd, y")} - ${format(range.to, "LLL dd, y")}`;
  };

  const clearFilter = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDateRangeChange(undefined);
  };

  const hasActiveFilter = dateRange?.from || dateRange?.to;

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            id="date-range-filter"
            variant="outline"
            className={cn(
              "w-full justify-start text-left font-normal",
              !dateRange && "text-muted-foreground",
              hasActiveFilter && "border-primary"
            )}
            disabled={disabled}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {formatDateRange(dateRange)}
            {hasActiveFilter && (
              <Badge 
                variant="secondary" 
                className="ml-auto h-5 px-1.5 text-xs"
                onClick={clearFilter}
              >
                ✕
              </Badge>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={dateRange?.from}
            selected={dateRange}
            onSelect={(range) => {
              onDateRangeChange(range);
              // Close popover when both dates are selected
              if (range?.from && range?.to) {
                setIsOpen(false);
              }
            }}
            numberOfMonths={2}
            disabled={disabled}
          />
          <div className="flex items-center justify-between border-t p-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onDateRangeChange(undefined)}
              disabled={!hasActiveFilter}
            >
              Clear
            </Button>
            <Button
              size="sm"
              onClick={() => setIsOpen(false)}
            >
              Done
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}