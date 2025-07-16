"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
  Plus,
  Tag,
  Building2,
  Calendar as CalendarIcon,
  Hash,
  Loader2,
  CalendarDays,
  X,
} from "lucide-react";
import { format, isAfter, isBefore, isEqual, parseISO } from "date-fns";
import { cn } from "@/lib/utils";

// Types
interface Project {
  rowId: string;
  title: string;
  description: string;
  serialNo: string;
  category: string;
  timeUpdated: string;
  cardImage?: string;
  applicableRoutes: string[];
  industry: string | string[];
  useCases?: string[];
  links: Array<{
    name: string;
    url: string;
    description: string;
    icon: string;
  }>;
}

interface DateRange {
  from: Date | undefined;
  to: Date | undefined;
}

// Custom CardDescription component
const CardDescription = ({ description }: { description: string }) => {
  const truncatedDescription = description.length > 100 
    ? description.substring(0, 100) + "..." 
    : description;
  
  return (
    <p className="text-sm text-gray-600 leading-relaxed">
      {truncatedDescription}
    </p>
  );
};

export default function ProjectMarketplace() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [industryFilter, setIndustryFilter] = useState("all");
  const [dateRange, setDateRange] = useState<DateRange>({
    from: undefined,
    to: undefined,
  });
  const [viewMode, setViewMode] = useState<"customer" | "internal">("customer");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Get unique categories and industries for filters
  const categories = Array.from(new Set(projects.map(p => p.category))).filter(Boolean);
  const industries = Array.from(new Set(
    projects.flatMap(p => Array.isArray(p.industry) ? p.industry : [p.industry])
  )).filter(Boolean);

  // Fetch projects
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("/api/telerivet/projects");
        if (response.ok) {
          const data = await response.json();
          setProjects(data);
          setFilteredProjects(data);
        }
      } catch (error) {
        console.error("Error fetching projects:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjects();
  }, []);

  // Filter projects
  useEffect(() => {
    let filtered = projects;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(project =>
        project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.serialNo.includes(searchTerm)
      );
    }

    // Category filter
    if (categoryFilter !== "all") {
      filtered = filtered.filter(project => project.category === categoryFilter);
    }

    // Industry filter
    if (industryFilter !== "all") {
      filtered = filtered.filter(project => {
        const projectIndustries = Array.isArray(project.industry) 
          ? project.industry 
          : [project.industry];
        return projectIndustries.includes(industryFilter);
      });
    }

    // Date range filter
    if (dateRange.from || dateRange.to) {
      filtered = filtered.filter(project => {
        const projectDate = parseISO(project.timeUpdated);
        
        if (dateRange.from && dateRange.to) {
          return (isAfter(projectDate, dateRange.from) || isEqual(projectDate, dateRange.from)) &&
                 (isBefore(projectDate, dateRange.to) || isEqual(projectDate, dateRange.to));
        } else if (dateRange.from) {
          return isAfter(projectDate, dateRange.from) || isEqual(projectDate, dateRange.from);
        } else if (dateRange.to) {
          return isBefore(projectDate, dateRange.to) || isEqual(projectDate, dateRange.to);
        }
        
        return true;
      });
    }

    setFilteredProjects(filtered);
  }, [projects, searchTerm, categoryFilter, industryFilter, dateRange]);

  // Helper functions
  const formatDate = (dateString: string) => {
    try {
      return format(parseISO(dateString), "MMM dd, yyyy");
    } catch {
      return "Invalid date";
    }
  };

  const getProjectImage = (project: Project) => {
    if (project.cardImage && project.cardImage !== "no-image.png") {
      return project.cardImage;
    }
    return "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=250&fit=crop";
  };

  const clearDateRange = () => {
    setDateRange({ from: undefined, to: undefined });
  };

  const handleViewProject = (project: Project) => {
    setSelectedProject(project);
    setIsDialogOpen(true);
  };

  const handleEditProject = (project: Project) => {
    // Edit functionality would go here
    console.log("Edit project:", project);
  };

  const handleDeleteProject = async (project: Project) => {
    if (!confirm(`Are you sure you want to delete "${project.title}"?`)) {
      return;
    }

    try {
      setIsDeleting(project.rowId);
      const response = await fetch("/api/telerivet/delete", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rowId: project.rowId }),
      });

      if (response.ok) {
        setProjects(prev => prev.filter(p => p.rowId !== project.rowId));
      } else {
        alert("Failed to delete project");
      }
    } catch (error) {
      console.error("Error deleting project:", error);
      alert("Error deleting project");
    } finally {
      setIsDeleting(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="mb-4 text-4xl font-bold text-gray-900">
            Project Marketplace
          </h1>
          <p className="text-lg text-gray-600">
            Discover and explore our communication solutions
          </p>
        </div>

        {/* View Mode Toggle */}
        <div className="mb-6 flex justify-center">
          <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as "customer" | "internal")}>
            <TabsList className="grid w-full max-w-md grid-cols-2">
              <TabsTrigger value="customer">Customer View</TabsTrigger>
              <TabsTrigger value="internal">Internal View</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search projects, descriptions, or serial numbers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Date Range Filter */}
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full md:w-auto justify-start text-left font-normal",
                    !dateRange.from && !dateRange.to && "text-muted-foreground"
                  )}
                >
                  <CalendarDays className="mr-2 h-4 w-4" />
                  {dateRange.from ? (
                    dateRange.to ? (
                      <>
                        {format(dateRange.from, "LLL dd, y")} -{" "}
                        {format(dateRange.to, "LLL dd, y")}
                      </>
                    ) : (
                      format(dateRange.from, "LLL dd, y")
                    )
                  ) : (
                    <span>Pick a date range</span>
                  )}
                  {(dateRange.from || dateRange.to) && (
                    <X
                      className="ml-2 h-4 w-4 cursor-pointer hover:text-red-500"
                      onClick={(e) => {
                        e.stopPropagation();
                        clearDateRange();
                      }}
                    />
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  initialFocus
                  mode="range"
                  defaultMonth={dateRange.from}
                  selected={dateRange}
                  onSelect={setDateRange}
                  numberOfMonths={2}
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Category and Industry Filters */}
          <div className="flex flex-col gap-4 md:flex-row">
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={industryFilter} onValueChange={setIndustryFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="All Industries" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Industries</SelectItem>
                {industries.map(industry => (
                  <SelectItem key={industry} value={industry}>
                    {industry}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Results Count */}
            <div className="flex items-center text-sm text-gray-600">
              <Filter className="mr-2 h-4 w-4" />
              {filteredProjects.length} of {projects.length} projects
            </div>
          </div>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredProjects.map((project) => (
            <Card
              key={project.rowId}
              className="border-blue-200 bg-white transition-all duration-300 hover:translate-y-[-2px] hover:shadow-lg hover:shadow-blue-500/10"
            >
              <div className="relative">
                <img
                  src={getProjectImage(project)}
                  alt={project.title}
                  className="h-48 w-full rounded-t-lg object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src =
                      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=250&fit=crop";
                  }}
                />
                <div className="absolute right-2 top-2">
                  <Badge
                    variant="secondary"
                    className="bg-blue-600 text-white"
                  >
                    #{project.serialNo}
                  </Badge>
                </div>
              </div>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <CardTitle className="text-lg text-gray-900">
                    {project.title}
                  </CardTitle>
                </div>
                <CardDescription description={project.description} />
              </CardHeader>
              <CardContent>
                <div className="mb-4 flex flex-wrap gap-2">
                  <Badge
                    variant="outline"
                    className="border-blue-400 text-blue-600"
                  >
                    <Tag className="mr-1 h-3 w-3" />
                    {project.category}
                  </Badge>
                  {Array.isArray(project.industry) ? (
                    project.industry.slice(0, 2).map((ind, idx) => (
                      <Badge
                        key={idx}
                        variant="outline"
                        className="border-green-400 text-green-600"
                      >
                        <Building2 className="mr-1 h-3 w-3" />
                        {ind}
                      </Badge>
                    ))
                  ) : (
                    <Badge
                      variant="outline"
                      className="border-green-400 text-green-600"
                    >
                      <Building2 className="mr-1 h-3 w-3" />
                      {project.industry}
                    </Badge>
                  )}
                  {Array.isArray(project.industry) &&
                    project.industry.length > 2 && (
                      <Badge
                        variant="outline"
                        className="border-gray-400 text-gray-600"
                      >
                        +{project.industry.length - 2} more
                      </Badge>
                    )}
                </div>
                <div className="mb-4 flex items-center justify-between text-sm text-gray-500">
                  <span className="flex items-center">
                    <CalendarIcon className="mr-1 h-4 w-4" />
                    {formatDate(project.timeUpdated)}
                  </span>
                  <span className="flex items-center">
                    <Hash className="mr-1 h-4 w-4" />
                    {project.applicableRoutes.length} routes
                  </span>
                </div>
                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleViewProject(project)}
                    className="flex-1 border-blue-200 text-blue-600 hover:bg-blue-50"
                  >
                    <Eye className="mr-2 h-4 w-4" />
                    View
                  </Button>
                  {viewMode === "internal" && (
                    <>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEditProject(project)}
                        className="border-blue-400 text-blue-600 hover:bg-blue-50"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDeleteProject(project)}
                        disabled={isDeleting === project.rowId}
                        className="border-red-400 text-red-600 hover:bg-red-50"
                      >
                        {isDeleting === project.rowId ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                      </Button>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {filteredProjects.length === 0 && !isLoading && (
          <div className="py-12 text-center">
            <div className="mx-auto mb-4 h-24 w-24 rounded-full bg-gray-100 flex items-center justify-center">
              <Search className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="mb-2 text-lg font-medium text-gray-900">No projects found</h3>
            <p className="text-gray-500">
              Try adjusting your search terms or filters to find what you're looking for.
            </p>
          </div>
        )}

        {/* Project Detail Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-gray-900">
                {selectedProject?.title}
              </DialogTitle>
            </DialogHeader>
            {selectedProject && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <img
                      src={getProjectImage(selectedProject)}
                      alt={selectedProject.title}
                      className="w-full h-64 object-cover rounded-lg"
                    />
                  </div>
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
                      <p className="text-gray-600">{selectedProject.description}</p>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Details</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-500">Serial No:</span>
                          <span className="font-medium">#{selectedProject.serialNo}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Category:</span>
                          <span className="font-medium">{selectedProject.category}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Last Updated:</span>
                          <span className="font-medium">{formatDate(selectedProject.timeUpdated)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {selectedProject.useCases && selectedProject.useCases.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">Use Cases</h3>
                    <ul className="space-y-2">
                      {selectedProject.useCases.map((useCase, index) => (
                        <li key={index} className="flex items-start">
                          <span className="text-blue-600 mr-2">•</span>
                          <span className="text-gray-600">{useCase}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {selectedProject.links && selectedProject.links.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">Related Links</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {selectedProject.links.map((link, index) => (
                        <a
                          key={index}
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-sm transition-all"
                        >
                          <div className="flex items-start space-x-3">
                            <span className="text-2xl">{link.icon}</span>
                            <div>
                              <h4 className="font-medium text-gray-900">{link.name}</h4>
                              <p className="text-sm text-gray-600">{link.description}</p>
                            </div>
                          </div>
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}