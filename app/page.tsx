"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Search, ExternalLink, Filter, Users, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import axios from "axios";
import Logo from "./TR-white-logo.png"
import Image from "next/image";

type Project = {
  title: string;
  description: string;
  industry: string[];
  serialNo: string;
  category: string;
  links: {
    name: string;
    url: string;
    description: string;
    icon: string;
  }[];
};

type ProjectDetails = {
  title: string;
  description: string;
  serialNo: string;
  usecase: string;
  benefits: string[];
  implementation: string[];
  overview: string;
  roiMetrics: string[];
};

type ViewMode = "internal" | "customer";

const mainIndustries = ["FMCG", "Health", "Technology", "Finance", "Retail"];

const otherIndustries = [
  "NGO",
  "Logistics",
  "Telecom",
  "Manufacturing",
  "Education",
  "Energy",
  "Construction",
  "Agriculture",
  "Tourism",
  "Media",
  "Real Estate",
  "Transportation",
  "Environmental Services",
  "Government Services",
];

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIndustries, setSelectedIndustries] = useState<string[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedProject, setSelectedProject] = useState<ProjectDetails | null>(
    null,
  );
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>("customer");

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get("/api/telerivet");
        setProjects(response.data);
        setError(null);
      } catch (err) {
        setError("Failed to load projects");
        console.error("Error fetching projects:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const fetchProjectDetails = async (serialNo: string) => {
    setLoadingDetails(true);
    try {
      const response = await axios.post("/api/telerivet/id", { serialNo });
      setSelectedProject(response.data[0]);
      setIsDialogOpen(true);
    } catch (err) {
      console.error("Error fetching project details:", err);
      setError("Failed to load project details");
    } finally {
      setLoadingDetails(false);
    }
  };

  const toggleIndustry = (industry: string) => {
    setSelectedIndustries((prev) =>
      prev.includes(industry)
        ? prev.filter((i) => i !== industry)
        : [...prev, industry],
    );
  };

  const toggleViewMode = () => {
    setViewMode((prev) => (prev === "internal" ? "customer" : "internal"));
  };

  const filteredProjects = projects.filter((project) => {
    const matchesSearch =
      project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.links.some(
        (link) =>
          link.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          link.description.toLowerCase().includes(searchQuery.toLowerCase()),
      ) ||
      project.industry.some((ind) =>
        ind.toLowerCase().includes(searchQuery.toLowerCase()),
      );

    const matchesIndustry =
      selectedIndustries.length === 0 ||
      project.industry.some((ind) => selectedIndustries.includes(ind));

    return matchesSearch && matchesIndustry;
  });

  const groupedProjects = filteredProjects.reduce(
    (acc, project) => {
      const category = project.category || "Uncategorized";
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(project);
      return acc;
    },
    {} as Record<string, Project[]>,
  );

  const sortedCategories = Object.keys(groupedProjects).sort();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <div className="text-2xl text-blue-600">Loading projects...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <div className="text-2xl text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-blue-500/20 bg-black/80 backdrop-blur-sm">
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold text-white"></span>
            <Image src={Logo} alt="Telerivet Logo" width={200} height={200} />
          </div>
          <div className="flex items-center gap-6">
            <Link
              href="https://telerivet.com/solutions"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-white transition-colors hover:text-blue-600"
            >
              Solutions
            </Link>
            <Link
              href="https://telerivet.com/signup"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-white transition-colors hover:text-blue-600"
            >
              Sign Up
            </Link>
            <Link
              href="https://telerivet.com/login"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-all hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-500/25"
            >
              Login
            </Link>
          </div>
        </nav>
      </header>

      <main className="min-h-screen bg-gradient-to-r from-blue-100 to-white pb-12">
        <div className="mx-auto max-w-6xl px-4 py-12">
          <div className="my-10 text-center">
            <div className="mb-6 flex items-center justify-center gap-4">
              <h1 className="text-4xl font-bold text-blue-600">
                Telerivet Solutions Marketplace
              </h1>
              <Button
                variant="outline"
                size="icon"
                className="h-10 w-10 rounded-full border-blue-500/30 transition-all duration-200 hover:border-blue-500 hover:bg-blue-500/10"
                onClick={toggleViewMode}
              >
                {viewMode === "internal" ? (
                  <Users className="h-5 w-5 text-blue-600" />
                ) : (
                  <User className="h-5 w-5 text-blue-600" />
                )}
              </Button>
            </div>
            <p className="mx-auto px-4 text-lg leading-relaxed text-gray-600 md:px-8 lg:px-16">
              The{" "}
              <strong className="font-semibold text-blue-600">
                Telerivet Solutions Marketplace
              </strong>{" "}
              is a comprehensive platform designed to empower organizations with
              cutting-edge communication tools and solutions.
            </p>
            <p className="mx-auto mt-4 px-4 text-lg leading-relaxed text-gray-600 md:px-8 lg:px-16">
              This marketplace enables users to streamline customer engagement,
              automate interactions, and scale operations efficiently. Telerivet
              supports versatile use cases ranging from retail to logistics.
            </p>
            <p className="mx-auto mt-4 px-4 text-lg leading-relaxed text-gray-600 md:px-8 lg:px-16">
              Whether you're looking to enhance customer support, launch
              targeted marketing campaigns, or implement innovative mobile
              solutions, the Telerivet Solutions Marketplace offers endless
              possibilities to drive meaningful results globally.
            </p>
          </div>

          <div className="mx-auto mb-8 max-w-2xl">
            <div className="relative mb-4">
              <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center">
                <Search className="h-5 w-5 text-blue-600" />
              </div>
              <Input
                type="search"
                placeholder="Search services or descriptions..."
                className="h-12 border-blue-500/20 bg-white pl-10 text-lg focus-visible:ring-blue-500/50"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="flex flex-wrap items-center justify-center gap-2">
              {mainIndustries.map((industry) => (
                <Badge
                  key={industry}
                  variant={
                    selectedIndustries.includes(industry)
                      ? "default"
                      : "outline"
                  }
                  className={`cursor-pointer px-6 py-2.5 text-sm transition-all duration-200 ${
                    selectedIndustries.includes(industry)
                      ? "bg-blue-600 text-white shadow-lg shadow-blue-500/25 hover:translate-y-[-2px] hover:bg-blue-700"
                      : "border-blue-500/30 text-blue-600 hover:translate-y-[-2px] hover:border-blue-500 hover:bg-blue-500/10"
                  }`}
                  onClick={() => toggleIndustry(industry)}
                >
                  {industry}
                </Badge>
              ))}

              <Popover>
                <PopoverTrigger>
                  <Button
                    variant="outline"
                    className="flex h-auto items-center gap-2 rounded-3xl border-blue-500/30 px-6 py-2.5 text-sm text-blue-600 transition-all duration-200 hover:translate-y-[-2px] hover:border-blue-500 hover:bg-blue-500/10"
                  >
                    <Filter className="h-4 w-4" />
                    More Industries
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-64 border-blue-500/20 bg-white p-4">
                  <div className="space-y-4">
                    <h4 className="text-sm font-medium text-gray-900">
                      Select Industries
                    </h4>
                    <div className="space-y-2">
                      {otherIndustries.map((industry) => (
                        <div
                          key={industry}
                          className="flex items-center space-x-2"
                        >
                          <Checkbox
                            id={industry}
                            checked={selectedIndustries.includes(industry)}
                            onCheckedChange={() => toggleIndustry(industry)}
                            className="border-blue-500/30 text-blue-600"
                          />
                          <label
                            htmlFor={industry}
                            className="text-sm font-medium text-gray-700"
                          >
                            {industry}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {sortedCategories.map((category) => (
            <div key={category} className="mb-12 w-full">
              <h2 className="mb-6 text-2xl font-bold text-blue-600">
                {category}
              </h2>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {groupedProjects[category].map((project) => (
                  <Card
                    key={project.serialNo}
                    className="cursor-pointer border-2 border-blue-500/20 bg-white transition-all duration-200 hover:translate-y-[-4px] hover:border-blue-500/40 hover:shadow-xl hover:shadow-blue-500/10"
                    onClick={() => fetchProjectDetails(project.serialNo)}
                  >
                    <CardHeader>
                      <div className="mb-3 flex items-center justify-between">
                        <div className="flex flex-wrap gap-2">
                          {project.industry.map((ind) => (
                            <Badge
                              key={ind}
                              variant="secondary"
                              className="border-blue-500/30 bg-blue-500/10 text-blue-600"
                            >
                              {ind}
                            </Badge>
                          ))}
                        </div>
                        <span className="text-sm text-gray-500">
                          #{project.serialNo}
                        </span>
                      </div>
                      <CardTitle className="text-2xl font-bold text-blue-600">
                        {project.title}
                      </CardTitle>
                      <CardDescription className="mt-2 text-lg text-gray-600">
                        {project.description}
                      </CardDescription>
                    </CardHeader>
                    {viewMode === "internal" && (
                      <CardContent>
                        <div className="space-y-4">
                          {project.links.map((link, linkIndex) => (
                            <div key={linkIndex} className="group">
                              <Link
                                href={link.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-start space-x-4 p-3 transition-all duration-200 hover:translate-x-2 hover:bg-blue-500/10"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <span className="text-2xl">{link.icon}</span>
                                <div className="flex-1">
                                  <div className="flex items-center gap-2">
                                    <h3 className="text-base font-semibold text-blue-600">
                                      {link.name}
                                    </h3>
                                    <ExternalLink className="h-4 w-4 text-blue-600 opacity-0 transition-opacity group-hover:opacity-100" />
                                  </div>
                                  <p className="mt-1 text-sm text-gray-600">
                                    {link.description}
                                  </p>
                                </div>
                              </Link>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    )}
                  </Card>
                ))}
              </div>
            </div>
          ))}

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogContent className="max-w-3xl border-blue-500/20 bg-white">
              {loadingDetails ? (
                <div className="flex items-center justify-center py-8">
                  <div className="text-xl text-blue-600">
                    Loading details...
                  </div>
                </div>
              ) : selectedProject ? (
                <>
                  <DialogHeader>
                    <DialogTitle className="text-2xl font-bold text-blue-600">
                      {selectedProject.title}
                    </DialogTitle>
                    <DialogDescription className="mt-2 text-lg text-gray-600">
                      {selectedProject.description}
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-6 py-4">
                    <div>
                      <h3 className="mb-2 text-lg font-semibold text-blue-600">
                        Overview
                      </h3>
                      <p className="text-gray-700">
                        {selectedProject.overview}
                      </p>
                    </div>
                    <div>
                      <h3 className="mb-2 text-lg font-semibold text-blue-600">
                        Key Benefits
                      </h3>
                      <ul className="list-inside list-disc space-y-2">
                        {selectedProject.benefits.map((benefit, index) => (
                          <li key={index} className="text-gray-700">
                            {benefit}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h3 className="mb-2 text-lg font-semibold text-blue-600">
                        Use Case
                      </h3>
                      <p className="text-gray-700">{selectedProject.usecase}</p>
                    </div>
                    <div>
                      <h3 className="mb-2 text-lg font-semibold text-blue-600">
                        Implementation
                      </h3>
                      <ul className="list-inside list-disc space-y-2">
                        {selectedProject.implementation.map((step, index) => (
                          <li key={index} className="text-gray-700">
                            {step}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h3 className="mb-2 text-lg font-semibold text-blue-600">
                        ROI & Metrics
                      </h3>
                      <ul className="list-inside list-disc space-y-2">
                        {selectedProject.roiMetrics.map((metric, index) => (
                          <li key={index} className="text-gray-700">
                            {metric}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </>
              ) : null}
            </DialogContent>
          </Dialog>

          {filteredProjects.length === 0 && (
            <div className="mt-12 text-center">
              <p className="text-xl text-gray-600">
                No projects found matching your search.
              </p>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
