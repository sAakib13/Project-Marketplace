"use client";

import * as React from "react";
import { Search, Filter, X } from "lucide-react";
import { DateRange } from "react-day-picker";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DateRangeFilter } from "./DateRangeFilter";
import { cn } from "@/lib/utils";

interface ProjectFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedCategory: string;
  onCategoryChange: (value: string) => void;
  selectedIndustry: string;
  onIndustryChange: (value: string) => void;
  dateRange: DateRange | undefined;
  onDateRangeChange: (range: DateRange | undefined) => void;
  categories: string[];
  industries: string[];
  activeFiltersCount: number;
  onClearAllFilters: () => void;
  className?: string;
}

export function ProjectFilters({
  searchTerm,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  selectedIndustry,
  onIndustryChange,
  dateRange,
  onDateRangeChange,
  categories,
  industries,
  activeFiltersCount,
  onClearAllFilters,
  className,
}: ProjectFiltersProps) {
  return (
    <div className={cn("space-y-4", className)}>
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search projects..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10"
        />
        {searchTerm && (
          <Button
            variant="ghost"
            size="sm"
            className="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2 p-0"
            onClick={() => onSearchChange("")}
          >
            <X className="h-3 w-3" />
          </Button>
        )}
      </div>

      {/* Filter Controls */}
      <div className="flex flex-wrap gap-3">
        {/* Category Filter */}
        <Select value={selectedCategory} onValueChange={onCategoryChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Industry Filter */}
        <Select value={selectedIndustry} onValueChange={onIndustryChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="All Industries" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Industries</SelectItem>
            {industries.map((industry) => (
              <SelectItem key={industry} value={industry}>
                {industry}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Date Range Filter */}
        <DateRangeFilter
          dateRange={dateRange}
          onDateRangeChange={onDateRangeChange}
          className="w-[280px]"
          placeholder="Filter by date range"
        />

        {/* Clear All Filters */}
        {activeFiltersCount > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={onClearAllFilters}
            className="ml-auto"
          >
            <Filter className="mr-2 h-4 w-4" />
            Clear All ({activeFiltersCount})
          </Button>
        )}
      </div>

      {/* Active Filters Display */}
      {activeFiltersCount > 0 && (
        <div className="flex flex-wrap gap-2">
          {searchTerm && (
            <Badge variant="secondary" className="gap-1">
              Search: {searchTerm}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => onSearchChange("")}
              />
            </Badge>
          )}
          {selectedCategory !== "all" && (
            <Badge variant="secondary" className="gap-1">
              Category: {selectedCategory}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => onCategoryChange("all")}
              />
            </Badge>
          )}
          {selectedIndustry !== "all" && (
            <Badge variant="secondary" className="gap-1">
              Industry: {selectedIndustry}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => onIndustryChange("all")}
              />
            </Badge>
          )}
          {dateRange?.from && (
            <Badge variant="secondary" className="gap-1">
              Date: {dateRange.from.toLocaleDateString()}
              {dateRange.to && ` - ${dateRange.to.toLocaleDateString()}`}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => onDateRangeChange(undefined)}
              />
            </Badge>
          )}
        </div>
      )}
    </div>
  );
}