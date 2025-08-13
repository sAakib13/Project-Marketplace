"use client";

import { useState, useEffect } from "react";
import ProjectCard from "./ProjectCard";
import SearchAndFilter from "./SearchAndFilter";
import { Loader2, MessageSquare, TrendingUp, Users, Zap } from "lucide-react";

interface Project {
  projectId: string;
  projectName: string;
  projectDescription: string;
  keyFeatures: string[];
  organizationName: string;
  routesAvailable: string;
  servicesAvailable: string;
  projectUrl: string;
  status: string;
}

export default function ProjectsClient() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch projects from API route
useEffect(() => {
  const fetchProjects = async () => {
    try {
      setIsLoading(true);

      // Pass optional filters via query params
      const res = await fetch(`/api/projects`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) throw new Error("Failed to fetch");

      const data = await res.json();
      setProjects(data);
      setFilteredProjects(data);
    } catch (err) {
      console.error("Error loading projects:", err);
    } finally {
      setIsLoading(false);
    }
  };

  fetchProjects();
}, []);


  // Filter logic
  useEffect(() => {
    let filtered = projects;

    if (selectedStatus !== "all") {
      filtered = filtered.filter((p) => p.status === selectedStatus);
    }

    if (searchQuery) {
      filtered = filtered.filter(
        (p) =>
          p.projectName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.projectDescription
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          p.organizationName
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          p.keyFeatures.some((feature) =>
            feature.toLowerCase().includes(searchQuery.toLowerCase()),
          ),
      );
    }

    setFilteredProjects(filtered);
  }, [projects, selectedStatus, searchQuery]);

  const handleSearch = (query: string) => setSearchQuery(query);
  const handleStatusFilter = (status: string) => setSelectedStatus(status);

  const statuses = Array.from(new Set(projects.map((p) => p.status)));
  const organizations = Array.from(
    new Set(projects.map((p) => p.organizationName)),
  );

  const stats = [
    {
      label: "Active Projects",
      value: projects.filter((p) => p.status === "active").length,
      icon: MessageSquare,
      color: "from-blue-600 to-blue-700",
    },
    {
      label: "Total Projects",
      value: projects.length,
      icon: TrendingUp,
      color: "from-green-600 to-green-700",
    },
    {
      label: "Organizations",
      value: organizations.length,
      icon: Users,
      color: "from-purple-600 to-purple-700",
    },
    {
      label: "Routes Listed",
      value: projects.filter((p) => p.routesAvailable).length,
      icon: Zap,
      color: "from-orange-600 to-orange-700",
    },
  ];

  return (
    <>
      {/* Hero Section */}
      <section className="px-4 pb-16 pt-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl text-center">
          <h1 className="mb-6 text-4xl font-bold sm:text-5xl lg:text-6xl">
            Communication{" "}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Projects Dashboard
            </span>
          </h1>
          <p className="mx-auto max-w-3xl text-xl text-gray-600">
            Manage and monitor your messaging and communication projects.
          </p>

          {/* Stats */}
          <div className="mt-12 grid grid-cols-2 gap-6 md:grid-cols-4">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="rounded-2xl bg-white p-6 text-center shadow-md transition hover:shadow-lg"
              >
                <div
                  className={`inline-flex h-12 w-12 items-center justify-center bg-gradient-to-r ${stat.color} mb-4 rounded-lg`}
                >
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section className="px-4 pb-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <SearchAndFilter
            onSearch={handleSearch}
            onCategoryFilter={handleStatusFilter}
            categories={statuses}
            selectedCategory={selectedStatus}
            filterLabel="Status"
          />

          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="mx-auto h-8 w-8 animate-spin text-blue-600" />
            </div>
          ) : filteredProjects.length > 0 ? (
            <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-2">
              {filteredProjects.map((project) => (
                <ProjectCard key={project.projectId} project={project} />
              ))}
            </div>
          ) : (
            <div className="py-20 text-center">
              <MessageSquare className="mx-auto mb-4 h-16 w-16 text-gray-400" />
              <h3 className="text-xl font-medium">No projects found</h3>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
