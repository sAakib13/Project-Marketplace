"use client";

import { useState, useEffect } from "react";
import ProjectCard from "./ProjectCard";
import SearchAndFilter from "./SearchAndFilter";
import { Loader2, MessageSquare, TrendingUp, Users, Zap } from "lucide-react";

interface Project {
  projectId: string;
  projectName: string;
  useCase: string;
  description: string;
  features: string[];
  organization: string;
  timezone: string;
  metrics: {
    messagesSent: number;
    contactsManaged: number;
    activeGroups: number;
  };
  status: string;
  servicePlanLimit: {
    monthlyMessageCap: number;
    currentMonthUsage: number;
  };
  managementActions: {
    switchProjectUrl: string;
    manageContactsUrl: string;
    configureRoutesUrl: string;
    viewAnalyticsUrl: string;
  };
}

interface ProjectsClientProps {
  initialData: {
    projects: Project[];
  };
}

export default function ProjectsClient({ initialData }: ProjectsClientProps) {
  const [projects, setProjects] = useState<Project[]>(initialData.projects);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>(
    initialData.projects,
  );
  const [isLoading, setIsLoading] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Get unique statuses and organizations for filtering
  const statuses = Array.from(new Set(projects.map((p) => p.status)));
  const organizations = Array.from(new Set(projects.map((p) => p.organization)));

  useEffect(() => {
    filterProjects();
  }, [projects, selectedStatus, searchQuery]);

  const filterProjects = () => {
    let filtered = projects;

    if (selectedStatus !== "all") {
      filtered = filtered.filter(
        (project) => project.status === selectedStatus,
      );
    }

    if (searchQuery) {
      filtered = filtered.filter(
        (project) =>
          project.projectName
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          project.useCase.toLowerCase().includes(searchQuery.toLowerCase()) ||
          project.organization
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          project.features.some((feature) =>
            feature.toLowerCase().includes(searchQuery.toLowerCase()),
          ),
      );
    }

    setFilteredProjects(filtered);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleStatusFilter = (status: string) => {
    setSelectedStatus(status);
  };

  // Calculate aggregate stats
  const totalMessages = projects.reduce(
    (sum, p) => sum + p.metrics.messagesSent,
    0,
  );
  const totalContacts = projects.reduce(
    (sum, p) => sum + p.metrics.contactsManaged,
    0,
  );
  const totalGroups = projects.reduce(
    (sum, p) => sum + p.metrics.activeGroups,
    0,
  );
  const activeProjects = projects.filter((p) => p.status === "active").length;

  const stats = [
    {
      label: "Active Projects",
      value: activeProjects,
      icon: MessageSquare,
      color: "from-blue-600 to-blue-700",
    },
    {
      label: "Messages Sent",
      value: totalMessages.toLocaleString(),
      icon: TrendingUp,
      color: "from-green-600 to-green-700",
    },
    {
      label: "Total Contacts",
      value: totalContacts.toLocaleString(),
      icon: Users,
      color: "from-purple-600 to-purple-700",
    },
    {
      label: "Active Groups",
      value: totalGroups,
      icon: Zap,
      color: "from-orange-600 to-orange-700",
    },
  ];

  return (
    <>
      {/* Hero Section */}
      <section className="px-4 pb-16 pt-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-16 text-center">
            <h1 className="mb-6 text-4xl font-bold text-gray-900 sm:text-5xl lg:text-6xl">
              Communication{" "}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Projects Dashboard
              </span>
            </h1>
            <p className="mx-auto max-w-3xl text-xl leading-relaxed text-gray-600">
              Manage and monitor your messaging and communication projects.
              Track usage, manage contacts, and analyze performance across all
              your active campaigns.
            </p>
          </div>

          {/* Stats */}
          <div className="mb-16 grid grid-cols-2 gap-6 md:grid-cols-4">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="rounded-2xl bg-white p-6 text-center shadow-md transition-shadow duration-300 hover:shadow-lg"
              >
                <div
                  className={`inline-flex h-12 w-12 items-center justify-center bg-gradient-to-r ${stat.color} mb-4 rounded-lg`}
                >
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
                <div className="mb-1 text-2xl font-bold text-gray-900">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section className="px-4 pb-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12">
            <h2 className="mb-4 text-center text-3xl font-bold text-gray-900">
              Your Projects
            </h2>
            <p className="mx-auto mb-8 max-w-2xl text-center text-gray-600">
              Monitor project performance, manage contacts, and configure
              messaging routes for all your communication campaigns.
            </p>

            <SearchAndFilter
              onSearch={handleSearch}
              onCategoryFilter={handleStatusFilter}
              categories={statuses}
              selectedCategory={selectedStatus}
              filterLabel="Status"
            />
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <Loader2 className="mx-auto mb-4 h-8 w-8 animate-spin text-blue-600" />
                <p className="text-gray-600">Loading projects...</p>
              </div>
            </div>
          )}

          {/* Projects Grid */}
          {!isLoading && (
            <>
              {filteredProjects.length > 0 ? (
                <>
                  <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                    {filteredProjects.map((project) => (
                      <ProjectCard key={project.projectId} project={project} />
                    ))}
                  </div>

                  {filteredProjects.length !== projects.length && (
                    <div className="mt-12 text-center">
                      <p className="text-gray-600">
                        Showing {filteredProjects.length} of {projects.length}{" "}
                        projects
                      </p>
                    </div>
                  )}
                </>
              ) : (
                <div className="py-20 text-center">
                  <div className="mb-4 text-gray-400">
                    <MessageSquare className="mx-auto h-16 w-16" />
                  </div>
                  <h3 className="mb-2 text-xl font-medium text-gray-900">
                    No projects found
                  </h3>
                  <p className="text-gray-600">
                    Try adjusting your search or filter criteria
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
            <div className="col-span-1 md:col-span-2">
              <div className="mb-4 flex items-center space-x-2">
                <div className="rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 p-2">
                  <MessageSquare className="h-6 w-6 text-white" />
                </div>
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-xl font-bold text-transparent">
                  CommHub
                </span>
              </div>
              <p className="max-w-md text-gray-600">
                Manage your communication projects with powerful messaging and
                analytics tools.
              </p>
            </div>
            <div>
              <h4 className="mb-4 font-semibold text-gray-900">Features</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>
                  <a href="#" className="transition-colors hover:text-blue-600">
                    SMS Messaging
                  </a>
                </li>
                <li>
                  <a href="#" className="transition-colors hover:text-blue-600">
                    Voice Calls
                  </a>
                </li>
                <li>
                  <a href="#" className="transition-colors hover:text-blue-600">
                    Analytics
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="mb-4 font-semibold text-gray-900">Support</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>
                  <a href="#" className="transition-colors hover:text-blue-600">
                    Documentation
                  </a>
                </li>
                <li>
                  <a href="#" className="transition-colors hover:text-blue-600">
                    API Reference
                  </a>
                </li>
                <li>
                  <a href="#" className="transition-colors hover:text-blue-600">
                    Contact Support
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-8 border-t border-gray-200 pt-8 text-center text-sm text-gray-600">
            <p>
              &copy; 2024 CommHub. Communication project management platform.
            </p>
          </div>
        </div>
      </footer>
    </>
  );
}
