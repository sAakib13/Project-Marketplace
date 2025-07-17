"use client";

import { useState, useMemo } from "react";
import { DateRange } from "react-day-picker";
import { startOfDay, endOfDay, isWithinInterval, parseISO, isValid } from "date-fns";

interface Project {
  timeUpdated?: string | number;
  [key: string]: any;
}

interface UseDateFilterProps {
  projects: Project[];
  dateField?: keyof Project;
}

export function useDateFilter({ 
  projects, 
  dateField = "timeUpdated" 
}: UseDateFilterProps) {
  const [dateRange, setDateRange] = useState<DateRange | undefined>();

  const filteredProjects = useMemo(() => {
    if (!dateRange?.from || !projects.length) {
      return projects;
    }

    const fromDate = startOfDay(dateRange.from);
    const toDate = dateRange.to ? endOfDay(dateRange.to) : endOfDay(dateRange.from);

    return projects.filter((project) => {
      const projectDate = project[dateField];
      
      if (!projectDate) return false;

      let date: Date;
      
      // Handle different date formats
      if (typeof projectDate === "string") {
        // Try parsing ISO string first
        date = parseISO(projectDate);
        
        // If that fails, try creating a new Date
        if (!isValid(date)) {
          date = new Date(projectDate);
        }
      } else if (typeof projectDate === "number") {
        // Handle Unix timestamp (seconds or milliseconds)
        date = new Date(projectDate < 10000000000 ? projectDate * 1000 : projectDate);
      } else {
        return false;
      }

      // Check if date is valid and within range
      return isValid(date) && isWithinInterval(date, {
        start: fromDate,
        end: toDate,
      });
    });
  }, [projects, dateRange, dateField]);

  const clearDateFilter = () => {
    setDateRange(undefined);
  };

  const setDateFilter = (range: DateRange | undefined) => {
    setDateRange(range);
  };

  const hasActiveFilter = Boolean(dateRange?.from);

  return {
    dateRange,
    filteredProjects,
    setDateFilter,
    clearDateFilter,
    hasActiveFilter,
  };
}