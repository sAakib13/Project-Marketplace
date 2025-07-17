"use client";

import { useState, useMemo } from "react";
import { DateRange } from "react-day-picker";
import { isValid, parseISO, isWithinInterval, startOfDay, endOfDay } from "date-fns";

interface Project {
  timeUpdated?: string | number;
  [key: string]: any;
}

interface UseDateFilterProps {
  projects: Project[];
  dateField?: string;
}

export function useDateFilter({ 
  projects, 
  dateField = "timeUpdated" 
}: UseDateFilterProps) {
  const [dateRange, setDateRange] = useState<DateRange | undefined>();

  // Parse date from various formats
  const parseDate = (dateValue?: string | number): Date | null => {
    if (!dateValue) return null;

    let date: Date;
    
    if (typeof dateValue === "string") {
      // Try parsing as ISO string first
      date = parseISO(dateValue);
      if (!isValid(date)) {
        // Fallback to Date constructor
        date = new Date(dateValue);
      }
    } else {
      // Handle Unix timestamp (convert to milliseconds if needed)
      date = new Date(dateValue < 10000000000 ? dateValue * 1000 : dateValue);
    }

    return isValid(date) ? date : null;
  };

  // Filter projects by date range
  const filteredProjects = useMemo(() => {
    if (!dateRange?.from) {
      return projects;
    }

    const fromDate = startOfDay(dateRange.from);
    const toDate = dateRange.to ? endOfDay(dateRange.to) : endOfDay(dateRange.from);

    return projects.filter((project) => {
      const projectDate = parseDate(project[dateField]);
      if (!projectDate) return false;

      return isWithinInterval(projectDate, {
        start: fromDate,
        end: toDate,
      });
    });
  }, [projects, dateRange, dateField]);

  // Set date filter
  const setDateFilter = (range: DateRange | undefined) => {
    setDateRange(range);
  };

  // Clear date filter
  const clearDateFilter = () => {
    setDateRange(undefined);
  };

  // Check if filter is active
  const hasActiveFilter = Boolean(dateRange?.from);

  return {
    dateRange,
    filteredProjects,
    setDateFilter,
    clearDateFilter,
    hasActiveFilter,
  };
}