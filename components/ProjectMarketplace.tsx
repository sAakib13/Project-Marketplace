"use client";

import * as React from "react";
import { useEffect, useState } from "react";
import { ProjectFilters } from "./ProjectFilters";
import { useProjectFilters } from "@/hooks/useProjectFilters";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, Calendar } from "lucide-react";
import { format, isValid, parseISO } from "date-fns";

interface Project {
  title: string;
  description: string;
  serialNo: string;
  category: string;
  timeUpdated?: string | number;
  rowId: string;
  cardImage?: string;
  applicableRoutes: string[];
  industry: string[];
  useCases: string[];
  links: Array<{
    name: string;
    url: string;
    description: string;
    icon: string;
  }>;
}

export function ProjectMarketplace() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Use the project filters hook
  const {
    searchTerm,
    selectedCategory,
    selectedIndustry,
    dateRange,
    setSearchTerm,
    setSelectedCategory,
    setSelectedIndustry,
    setDateFilter,
    filteredProjects,
    categories,
    industries,
    activeFiltersCount,
    clearAllFilters,
  } = useProjectFilters({ projects });

  // Fetch projects from API
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/telerivet/projects");
        if (!response.ok) {
          throw new Error("Failed to fetch projects");
        }
        const data = await response.json();
        setProjects(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const formatDate = (dateValue?: string | number) => {
    if (!dateValue) return "No date";

    let date: Date;
    
    if (typeof dateValue === "string") {
      date = parseISO(dateValue);
      if (!isValid(date)) {
        date = new Date(dateValue);
      }
    } else {
      date = new Date(dateValue < 10000000000 ? dateValue * 1000 : dateValue);
    }

    return isValid(date) ? format(date, "MMM dd, yyyy") : "Invalid date";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading projects...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-destructive mb-4">Error: {error}</p>
          <Button onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Project Marketplace</h1>
        <p className="text-muted-foreground">
          Discover and explore our communication solutions
        </p>
      </div>

      {/* Filters */}
      <ProjectFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        selectedIndustry={selectedIndustry}
        onIndustryChange={setSelectedIndustry}
        dateRange={dateRange}
        onDateRangeChange={setDateFilter}
        categories={categories}
        industries={industries}
        activeFiltersCount={activeFiltersCount}
        onClearAllFilters={clearAllFilters}
        className="mb-8"
      />

      {/* Results Summary */}
      <div className="mb-6">
        <p className="text-sm text-muted-foreground">
          Showing {filteredProjects.length} of {projects.length} projects
          {activeFiltersCount > 0 && ` (${activeFiltersCount} filter${activeFiltersCount > 1 ? 's' : ''} applied)`}
        </p>
      </div>

      {/* Project Grid */}
      {filteredProjects.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">
            No projects found matching your criteria
          </p>
          {activeFiltersCount > 0 && (
            <Button variant="outline" onClick={clearAllFilters}>
              Clear All Filters
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <Card key={project.rowId} className="h-full flex flex-col">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg mb-2">{project.title}</CardTitle>
                    <CardDescription className="line-clamp-2">
                      {project.description}
                    </CardDescription>
                  </div>
                  <Badge variant="outline" className="ml-2">
                    #{project.serialNo}
                  </Badge>
                </div>
                
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  {formatDate(project.timeUpdated)}
                </div>
              </CardHeader>

              <CardContent className="flex-1 flex flex-col">
                {/* Categories and Industries */}
                <div className="mb-4">
                  <div className="flex flex-wrap gap-1 mb-2">
                    <Badge variant="secondary">{project.category}</Badge>
                    {project.industry.slice(0, 2).map((ind) => (
                      <Badge key={ind} variant="outline" className="text-xs">
                        {ind}
                      </Badge>
                    ))}
                    {project.industry.length > 2 && (
                      <Badge variant="outline" className="text-xs">
                        +{project.industry.length - 2}
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Links */}
                {project.links.length > 0 && (
                  <div className="mt-auto">
                    <div className="grid grid-cols-1 gap-2">
                      {project.links.slice(0, 3).map((link, index) => (
                        <Button
                          key={index}
                          variant="outline"
                          size="sm"
                          className="justify-start h-auto p-2"
                          asChild
                        >
                          <a
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2"
                          >
                            <span className="text-base">{link.icon}</span>
                            <div className="flex-1 text-left">
                              <div className="font-medium text-xs">{link.name}</div>
                              <div className="text-xs text-muted-foreground line-clamp-1">
                                {link.description}
                              </div>
                            </div>
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        </Button>
                      ))}
                      {project.links.length > 3 && (
                        <p className="text-xs text-muted-foreground text-center">
                          +{project.links.length - 3} more links
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}