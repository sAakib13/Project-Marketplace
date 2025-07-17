"use client";

import { useState, useMemo } from "react";
import { DateRange } from "react-day-picker";
import { useDateFilter } from "./useDateFilter";

interface Project {
  title: string;
  description: string;
  category: string;
  industry: string[];
  timeUpdated?: string | number;
  [key: string]: any;
}

interface UseProjectFiltersProps {
  projects: Project[];
}

export function useProjectFilters({ projects }: UseProjectFiltersProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedIndustry, setSelectedIndustry] = useState("all");

  // Use the date filter hook
  const {
    dateRange,
    filteredProjects: dateFilteredProjects,
    setDateFilter,
    clearDateFilter,
    hasActiveFilter: hasActiveDateFilter,
  } = useDateFilter({ projects });

  // Apply other filters to date-filtered projects
  const filteredProjects = useMemo(() => {
    let filtered = dateFilteredProjects;

    // Search filter
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase().trim();
      filtered = filtered.filter(
        (project) =>
          project.title.toLowerCase().includes(searchLower) ||
          project.description.toLowerCase().includes(searchLower)
      );
    }

    // Category filter
    if (selectedCategory !== "all") {
      filtered = filtered.filter(
        (project) => project.category === selectedCategory
      );
    }

    // Industry filter
    if (selectedIndustry !== "all") {
      filtered = filtered.filter((project) =>
        project.industry.includes(selectedIndustry)
      );
    }

    return filtered;
  }, [dateFilteredProjects, searchTerm, selectedCategory, selectedIndustry]);

  // Get unique categories and industries for filter options
  const categories = useMemo(() => {
    const cats = projects.map((p) => p.category).filter(Boolean);
    return Array.from(new Set(cats)).sort();
  }, [projects]);

  const industries = useMemo(() => {
    const inds = projects.flatMap((p) => p.industry || []).filter(Boolean);
    return Array.from(new Set(inds)).sort();
  }, [projects]);

  // Count active filters
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (searchTerm.trim()) count++;
    if (selectedCategory !== "all") count++;
    if (selectedIndustry !== "all") count++;
    if (hasActiveDateFilter) count++;
    return count;
  }, [searchTerm, selectedCategory, selectedIndustry, hasActiveDateFilter]);

  // Clear all filters
  const clearAllFilters = () => {
    setSearchTerm("");
    setSelectedCategory("all");
    setSelectedIndustry("all");
    clearDateFilter();
  };

  return {
    // Filter values
    searchTerm,
    selectedCategory,
    selectedIndustry,
    dateRange,
    
    // Filter setters
    setSearchTerm,
    setSelectedCategory,
    setSelectedIndustry,
    setDateFilter,
    
    // Filtered data
    filteredProjects,
    categories,
    industries,
    
    // Filter state
    activeFiltersCount,
    clearAllFilters,
  };
}

export { useProjectFilters }