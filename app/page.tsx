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
import { Search, ExternalLink, Filter } from "lucide-react";
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
import projectDetails from "./api/projects.json";

type Project = {
  title: string;
  description: string;
  industry: string[];
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
  salesPitch: {
    overview: string;
    benefits: string[];
    useCase: string;
    implementation: string[];
    roi: {
      metrics: string[];
    };
  };
};

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
    null
  );
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [loadingDetails, setLoadingDetails] = useState(false);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get("/api/telerivet");
        setProjects(response.data);
        setError(null);
      } catch (err) {
        setError("Failed to load projects");
        console.log("Error fetching projects:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const fetchProjectDetails = async (projectId: string) => {
    setLoadingDetails(true);
    try {
      // Instead of making an API call, we use the static JSON data
      const details = projectDetails[projectId as keyof typeof projectDetails];
      if (details) {
        setSelectedProject(details);
        setIsDialogOpen(true);
      } else {
        throw new Error("Project not found");
      }
    } catch (err) {
      console.error("Error fetching project details:", err);
    } finally {
      setLoadingDetails(false);
    }
  };

  const toggleIndustry = (industry: string) => {
    setSelectedIndustries((prev) =>
      prev.includes(industry)
        ? prev.filter((i) => i !== industry)
        : [...prev, industry]
    );
  };

  const filteredProjects = projects.filter((project) => {
    const matchesSearch =
      project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.links.some(
        (link) =>
          link.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          link.description.toLowerCase().includes(searchQuery.toLowerCase())
      ) ||
      project.industry.some((ind) =>
        ind.toLowerCase().includes(searchQuery.toLowerCase())
      );

    const matchesIndustry =
      selectedIndustries.length === 0 ||
      project.industry.some((ind) => selectedIndustries.includes(ind));

    return matchesSearch && matchesIndustry;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background via-secondary/30 to-background flex items-center justify-center">
        <div className="text-2xl text-blue-400">Loading projects...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background via-secondary/30 to-background flex items-center justify-center">
        <div className="text-2xl text-red-400">{error}</div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-background via-secondary/30 to-background pb-12">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="text-center my-10">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent my-6">
            Telerivet Solutions Marketplace
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed mx-auto px-4 md:px-8 lg:px-16">
            The{" "}
            <strong className="font-semibold">
              Telerivet Solutions Marketplace
            </strong>{" "}
            is a comprehensive platform designed to empower organizations with
            cutting-edge communication tools and solutions.
          </p>
          <p className="text-lg text-muted-foreground leading-relaxed mx-auto px-4 md:px-8 lg:px-16 mt-4">
            This marketplace enables users to streamline customer engagement,
            automate interactions, and scale operations efficiently. Telerivet
            supports versatile use cases ranging from retail to logistics.
          </p>
          <p className="text-lg text-muted-foreground leading-relaxed mx-auto px-4 md:px-8 lg:px-16 mt-4">
            Whether you're looking to enhance customer support, launch targeted
            marketing campaigns, or implement innovative mobile solutions, the
            Telerivet Solutions Marketplace offers endless possibilities to
            drive meaningful results globally.
          </p>
        </div>

        {/* Search Section */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="relative mb-4">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-blue-400" />
            </div>
            <Input
              type="search"
              placeholder="Search services or descriptions..."
              className="pl-10 h-12 text-lg bg-background/50 backdrop-blur-sm border-blue-500/20 focus-visible:ring-blue-500/50"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Industry Filter */}
          <div className="flex flex-wrap gap-2 justify-center items-center">
            {mainIndustries.map((industry) => (
              <Badge
                key={industry}
                variant={
                  selectedIndustries.includes(industry) ? "default" : "outline"
                }
                className={`cursor-pointer text-sm px-6 py-2.5 transition-all duration-200 ${
                  selectedIndustries.includes(industry)
                    ? "bg-blue-500 hover:bg-blue-600 hover:translate-y-[-2px] shadow-lg shadow-blue-500/25"
                    : "hover:bg-blue-500/10 border-blue-500/30 hover:border-blue-500 hover:translate-y-[-2px]"
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
                  className="flex items-center gap-2 px-6 py-2.5 h-auto text-sm hover:bg-blue-500/10 border-blue-500/30 hover:border-blue-500 hover:translate-y-[-2px] transition-all duration-200"
                >
                  <Filter className="h-4 w-4" />
                  More Industries
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-64 p-4">
                <div className="space-y-4">
                  <h4 className="font-medium text-sm">Select Industries</h4>
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
                        />
                        <label
                          htmlFor={industry}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
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

        {/* Project Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project, projectIndex) => (
            <Card
              key={projectIndex}
              className="bg-card/50 backdrop-blur-sm border-2 border-blue-500/20 hover:border-blue-500/40 transition-all duration-200 hover:translate-y-[-4px] hover:shadow-xl hover:shadow-blue-500/10 cursor-pointer"
              onClick={() => fetchProjectDetails(project.title)}
            >
              <CardHeader>
                <div className="flex flex-wrap gap-2 mb-3">
                  {project.industry.map((ind) => (
                    <Badge
                      key={ind}
                      variant="secondary"
                      className="bg-blue-500/10 text-blue-400 border-blue-500/30"
                    >
                      {ind}
                    </Badge>
                  ))}
                </div>
                <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
                  {project.title}
                </CardTitle>
                <CardDescription className="text-lg mt-2">
                  {project.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {project.links.map((link, linkIndex) => (
                    <div key={linkIndex} className="group">
                      <Link
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-start space-x-4 p-3 transition-all duration-200 hover:bg-blue-500/10 hover:translate-x-2"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <span className="text-2xl">{link.icon}</span>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h3 className="text-base font-semibold text-blue-400">
                              {link.name}
                            </h3>
                            <ExternalLink className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity text-blue-400" />
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">
                            {link.description}
                          </p>
                        </div>
                      </Link>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Project Details Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-3xl">
            {loadingDetails ? (
              <div className="flex items-center justify-center py-8">
                <div className="text-xl text-blue-400">Loading details...</div>
              </div>
            ) : selectedProject ? (
              <>
                <DialogHeader>
                  <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
                    {selectedProject.title}
                  </DialogTitle>
                  <DialogDescription className="text-lg mt-2">
                    {selectedProject.description}
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-6 py-4">
                  <div>
                    <h3 className="text-lg font-semibold text-blue-400 mb-2">
                      Overview
                    </h3>
                    <p className="text-muted-foreground">
                      {selectedProject.salesPitch.overview}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-blue-400 mb-2">
                      Key Benefits
                    </h3>
                    <ul className="list-disc list-inside space-y-2">
                      {selectedProject.salesPitch.benefits.map(
                        (benefit, index) => (
                          <li key={index} className="text-muted-foreground">
                            {benefit}
                          </li>
                        )
                      )}
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-blue-400 mb-2">
                      Use Case
                    </h3>
                    <p className="text-muted-foreground">
                      {selectedProject.salesPitch.useCase}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-blue-400 mb-2">
                      Implementation
                    </h3>
                    <ul className="list-disc list-inside space-y-2">
                      {selectedProject.salesPitch.implementation.map(
                        (step, index) => (
                          <li key={index} className="text-muted-foreground">
                            {step}
                          </li>
                        )
                      )}
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-blue-400 mb-2">
                      ROI & Metrics
                    </h3>
                    <ul className="list-disc list-inside space-y-2">
                      {selectedProject.salesPitch.roi.metrics.map(
                        (metric, index) => (
                          <li key={index} className="text-muted-foreground">
                            {metric}
                          </li>
                        )
                      )}
                    </ul>
                  </div>
                </div>
              </>
            ) : null}
          </DialogContent>
        </Dialog>

        {/* No Results Message */}
        {filteredProjects.length === 0 && (
          <div className="text-center mt-12">
            <p className="text-xl text-muted-foreground">
              No projects found matching your search.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
