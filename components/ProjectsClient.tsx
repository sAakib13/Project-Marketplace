"use client";

import { useState, useEffect } from "react";
import ProjectCard from "./ProjectCard";
import SearchAndFilter from "./SearchAndFilter";
import { Loader2, MessageSquare, TrendingUp, Users, Zap } from "lucide-react";

/**
 * Project type used in this component.
 * Adjust fields as needed to match your backend/schema.
 */
interface Project {
  id: string;
  projectId: string;
  projectName: string;
  projectDescription: string;
  organizationName: string;
  keyFeatures: string[];
  status: string;
  routesAvailable?: boolean;
  servicesAvailable: boolean;
  projectUrl?: string;
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
        console.log("Fetched projects:", data);
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
          <h1 className="mb-6 text-4xl font-bold text-white sm:text-5xl lg:text-6xl">
            Telerivet{" "}
            <span className="bg-gradient-to-r bg-clip-text text-transparent text-white">
              Projects Hub
            </span>
          </h1>
          <p className="mx-auto max-w-3xl text-xl text-gray-200">
            Manage and monitor your Telerivet projects.
          </p>

          {/* Stats */}
          {/* <div className="mt-12 grid grid-cols-2 gap-6 md:grid-cols-4">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="rounded-2xl border border-white/20 bg-white/20 p-6 text-center shadow-lg backdrop-blur-md transition hover:shadow-xl"
              >
                <div
                  className={`inline-flex h-12 w-12 items-center justify-center bg-gradient-to-r ${stat.color} mb-4 rounded-lg`}
                >
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
                <div className="text-2xl font-bold text-white">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-200">{stat.label}</div>
              </div>
            ))}
          </div> */}
        </div>
      </section>

      {/* Projects Section */}
      <section className="px-4 pb-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="rounded-3xl border border-white/20 p-12 shadow-lg backdrop-blur-md">
            <SearchAndFilter
              onSearch={handleSearch}
              onCategoryFilter={handleStatusFilter}
              categories={statuses}
              selectedCategory={selectedStatus}
              filterLabel="Status"
            />

            {isLoading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="mx-auto h-8 w-8 animate-spin text-blue-400" />
              </div>
            ) : filteredProjects.length > 0 ? (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 py-6">
                {filteredProjects.map((project) => (
                  <ProjectCard project={project as any} key={project.projectId} />
                ))}
              </div>
            ) : (
              <div className="py-20 text-center text-white">
                <MessageSquare className="mx-auto mb-4 h-16 w-16 text-gray-300" />
                <h3 className="text-xl font-medium">No projects found</h3>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
