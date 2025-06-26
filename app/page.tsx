"use client";
import { useState, useEffect } from "react";
import { useKeenSlider } from "keen-slider/react";
import { useForm } from "react-hook-form";
import axios from "axios";
import Link from "next/link";
import Image from "next/image";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

// Icons
import {
  Search,
  ExternalLink,
  Filter,
  Users,
  User,
  MessageSquare,
  Phone,
  ChevronLeft,
  ChevronRight,
  X,
  Pencil,
  Trash,
  Save,
  AlertCircle,
} from "lucide-react";

// UI components
import { Input } from "@/components/ui/input";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

// Assets
import Logo from "./TR-white-logo.png";
import "keen-slider/keen-slider.min.css";

// Communication channels with their icons
const channels = [
  { name: "SMS", icon: <MessageSquare className="h-4 w-4" /> },
  {
    name: "WhatsApp",
    icon: <MessageSquare className="h-4 w-4 text-green-600" />,
  },
  {
    name: "Viber",
    icon: <MessageSquare className="h-4 w-4 text-purple-600" />,
  },
  { name: "Voice", icon: <Phone className="h-4 w-4" /> },
];

// Hero slides for the carousel
const heroSlides = [
  {
    title: "Telerivet Solutions Marketplace",
    description:
      "The Telerivet Solutions Marketplace is a comprehensive platform designed to empower organizations with cutting-edge communication tools and solutions.",
    image:
      "https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
  },
  {
    title: "Enterprise Communication Solutions",
    description:
      "Streamline customer engagement, automate interactions, and scale your operations with versatile tools, from retail to logistics.",
    image:
      "https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
  },
  {
    title: "Global Impact Through Innovation",
    description:
      "Whether you're enhancing support, launching marketing campaigns, or deploying mobile solutions — unlock endless possibilities to drive global impact.",
    image:
      "https://images.pexels.com/photos/3184325/pexels-photo-3184325.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
  },
];

// Category-based stock images
const categoryImages = {
  "SMS Marketing":
    "https://images.pexels.com/photos/267350/pexels-photo-267350.jpeg?auto=compress&cs=tinysrgb&w=400&h=300",
  "Customer Support":
    "https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=400&h=300",
  "E-commerce":
    "https://images.pexels.com/photos/230544/pexels-photo-230544.jpeg?auto=compress&cs=tinysrgb&w=400&h=300",
  Healthcare:
    "https://images.pexels.com/photos/263402/pexels-photo-263402.jpeg?auto=compress&cs=tinysrgb&w=400&h=300",
  Education:
    "https://images.pexels.com/photos/289737/pexels-photo-289737.jpeg?auto=compress&cs=tinysrgb&w=400&h=300",
  Finance:
    "https://images.pexels.com/photos/259027/pexels-photo-259027.jpeg?auto=compress&cs=tinysrgb&w=400&h=300",
  Logistics:
    "https://images.pexels.com/photos/906494/pexels-photo-906494.jpeg?auto=compress&cs=tinysrgb&w=400&h=300",
  Default:
    "https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=400&h=300",
};

// View modes for the application
type ViewMode = "internal" | "customer";

type Project = {
  title: string;
  description: string;
  industry: string[];
  serialNo: string;
  category: string;
  timeUpdated: number;
  applicableRoutes: string[];
  card_image: string; // Use card_image for displaying images
  rowId?: string; // Add rowId for API operations
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
  image: string;
  card_image?: string;
  implementation: string[];
  overview: string;
  roiMetrics: string[];
  applicableRoutes: string[]; // Ensure this is string[]
  industry: string;
};

// Form validation schema
const editFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  category: z.string().min(1, "Category is required"),
  industry: z.string().min(1, "Industry is required"),
  telerivetUrl: z.string().url("Invalid URL").optional().or(z.literal("")),
  canvaUrl: z.string().url("Invalid URL").optional().or(z.literal("")),
  hubspotUrl: z.string().url("Invalid URL").optional().or(z.literal("")),
  liveUrl: z.string().url("Invalid URL").optional().or(z.literal("")),
  applicableRoutes: z.array(z.string()),
  card_image: z.string().url("Invalid image URL").optional().or(z.literal("")),
});

export default function Home() {
  // State management
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIndustries, setSelectedIndustries] = useState<string[]>([]);
  const [selectedChannels, setSelectedChannels] = useState<string[]>([]);
  const [showNewOnly, setShowNewOnly] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedProject, setSelectedProject] = useState<ProjectDetails | null>(
    null,
  );
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>("customer");
  const [expandedIndustries, setExpandedIndustries] = useState<{
    [key: string]: boolean;
  }>({});
  const [currentSlide, setCurrentSlide] = useState(0);

  // Edit functionality state
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Form handling
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<{
    title: string;
    description: string;
    category: string;
    industry: string;
    telerivetUrl: string;
    canvaUrl: string;
    hubspotUrl: string;
    liveUrl: string;
    applicableRoutes: string[];
    card_image: string;
  }>({
    resolver: zodResolver(editFormSchema),
    defaultValues: {
      title: "",
      description: "",
      category: "",
      industry: "",
      telerivetUrl: "",
      canvaUrl: "",
      hubspotUrl: "",
      liveUrl: "",
      applicableRoutes: [],
      card_image: "",
    },
  });

  const watchedRoutes = watch("applicableRoutes");

  // Keen Slider configuration
  const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>({
    initial: 0,
    slideChanged(slider) {
      setCurrentSlide(slider.track.details.rel);
    },
    loop: true,
    mode: "snap",
    slides: { perView: 1 },
  });

  // Auto-advance slides
  useEffect(() => {
    const interval = setInterval(() => {
      if (instanceRef.current) {
        instanceRef.current.next();
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [instanceRef]);

  // Fetch projects
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get("/api/telerivet");
        const projectsWithTime = response.data.map((project: any) => ({
          ...project,
          timeUpdated: project.timeUpdated || Date.now() / 1000,
        }));
        setProjects(projectsWithTime);
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

  // Fetch project details
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

  // Handle edit project
  const handleEditProject = (project: Project) => {
    setEditingProject(project);

    // Populate form with project data
    reset({
      title: project.title,
      description: project.description,
      category: project.category,
      industry: project.industry.join(", "),
      telerivetUrl:
        project.links.find((l) => l.name === "Telerivet Project")?.url || "",
      canvaUrl: project.links.find((l) => l.name === "Canva Decks")?.url || "",
      hubspotUrl:
        project.links.find((l) => l.name === "HubSpot Article")?.url || "",
      liveUrl: project.links.find((l) => l.name === "Live Project")?.url || "",
      applicableRoutes: project.applicableRoutes || [],
      card_image: project.card_image || "",
    });

    setEditDialogOpen(true);
  };

  // Handle save project
  const handleSaveProject = async (data: any) => {
    if (!editingProject) return;

    setIsUpdating(true);
    try {
      const updateData = {
        rowId: editingProject.rowId || editingProject.serialNo,
        vars: {
          title: data.title,
          description: data.description,
          category: data.category,
          industry: data.industry,
          telerivet_url: data.telerivetUrl,
          canva_url: data.canvaUrl,
          hubspot_url: data.hubspotUrl,
          live_url: data.liveUrl,
          applicable_route: data.applicableRoutes.join(","),
          card_image: data.card_image,
        },
      };

      console.log("Sending update data:", updateData);

      // Use POST method as fallback since PUT might not be working
      const response = await axios.post("/api/telerivet/update", updateData);

      console.log("Update response:", response.data);

      // Update local state
      setProjects((prev) =>
        prev.map((p) =>
          p.serialNo === editingProject.serialNo
            ? {
                ...p,
                title: data.title,
                description: data.description,
                category: data.category,
                industry: data.industry.split(",").map((i: string) => i.trim()),
                applicableRoutes: data.applicableRoutes,
                card_image: data.card_image,
                links: [
                  ...(data.telerivetUrl
                    ? [
                        {
                          name: "Telerivet Project",
                          url: data.telerivetUrl,
                          description: "Campaign automation and tracking",
                          icon: "📱",
                        },
                      ]
                    : []),
                  ...(data.canvaUrl
                    ? [
                        {
                          name: "Canva Decks",
                          url: data.canvaUrl,
                          description: "Brand-aligned visual assets",
                          icon: "🎨",
                        },
                      ]
                    : []),
                  ...(data.hubspotUrl
                    ? [
                        {
                          name: "HubSpot Article",
                          url: data.hubspotUrl,
                          description: "Performance metrics and leads",
                          icon: "📊",
                        },
                      ]
                    : []),
                  ...(data.liveUrl
                    ? [
                        {
                          name: "Live Project",
                          url: data.liveUrl,
                          description: "View the live project",
                          icon: "🌐",
                        },
                      ]
                    : []),
                ],
              }
            : p,
        ),
      );

      setEditDialogOpen(false);
      setEditingProject(null);
      setError(null);
    } catch (err: any) {
      console.error("Error updating project:", err);
      setError(
        `Failed to update project: ${err.response?.data?.error || err.message}`,
      );
    } finally {
      setIsUpdating(false);
    }
  };

  // Handle delete project
  const handleDeleteProject = async (project: Project) => {
    if (!confirm("Are you sure you want to delete this project?")) return;

    setIsDeleting(true);
    try {
      console.log("Deleting project with rowId:", project.rowId);

      // Use POST method as fallback
      await axios.post("/api/telerivet/delete", {
        rowId: project.rowId || project.serialNo,
      });

      // Remove from local state
      setProjects((prev) =>
        prev.filter((p) => p.serialNo !== project.serialNo),
      );
      setError(null);
    } catch (err: any) {
      console.error("Error deleting project:", err);
      setError(
        `Failed to delete project: ${err.response?.data?.error || err.message}`,
      );
    } finally {
      setIsDeleting(false);
    }
  };

  // Toggle functions
  const toggleIndustry = (industry: string) => {
    setSelectedIndustries((prev) =>
      prev.includes(industry)
        ? prev.filter((i) => i !== industry)
        : [...prev, industry],
    );
  };

  const toggleChannel = (channel: string) => {
    setSelectedChannels((prev) =>
      prev.includes(channel)
        ? prev.filter((c) => c !== channel)
        : [...prev, channel],
    );
  };

  const toggleViewMode = () => {
    setViewMode((prev) => (prev === "internal" ? "customer" : "internal"));
  };

  const toggleIndustryExpand = (serialNo: string) => {
    setExpandedIndustries((prev) => ({
      ...prev,
      [serialNo]: !prev[serialNo],
    }));
  };

  const isNewService = (timeUpdated: number) => {
    const threeDaysAgo = Date.now() / 1000 - 3 * 24 * 60 * 60;
    return timeUpdated > threeDaysAgo;
  };

  const getProjectImage = (project: Project) => {
    return (
      project.card_image ||
      categoryImages[project.category as keyof typeof categoryImages] ||
      categoryImages.Default
    );
  };

  // Filter and group projects
  const filteredProjects = projects
    .filter((project) => {
      const matchesSearch =
        project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.industry.some((ind) =>
          ind.toLowerCase().includes(searchQuery.toLowerCase()),
        );

      const matchesIndustry =
        selectedIndustries.length === 0 ||
        project.industry.some((ind) => selectedIndustries.includes(ind));

      const matchesChannels =
        selectedChannels.length === 0 ||
        project.applicableRoutes.some((route) =>
          selectedChannels.includes(route),
        );

      const matchesNewOnly = !showNewOnly || isNewService(project.timeUpdated);

      return (
        matchesSearch && matchesIndustry && matchesChannels && matchesNewOnly
      );
    })
    .sort((a, b) => {
      if (showNewOnly) {
        return b.timeUpdated - a.timeUpdated;
      }
      return 0;
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
        <div className="text-center">
          <div className="mb-4 text-2xl text-red-600">{error}</div>
          <Button onClick={() => window.location.reload()}>Retry</Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-blue-500/20 bg-black/80 backdrop-blur-sm">
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <div className="flex items-center gap-4">
            <Image src={Logo} alt="Telerivet Logo" width={200} height={200} />
          </div>
          <div className="flex items-center gap-6">
            <Link
              href="#solutions"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-blue-600 px-4 py-2 font-medium text-white transition-all hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-500/25"
            >
              Get Started
            </Link>
            <button
              onClick={toggleViewMode}
              className="flex h-12 w-12 items-center justify-center rounded-full border border-blue-500/30 bg-white shadow transition hover:border-blue-500 hover:bg-blue-500/10"
            >
              {viewMode === "internal" ? (
                <Users className="h-6 w-6 text-blue-600" />
              ) : (
                <User className="h-6 w-6 text-blue-600" />
              )}
            </button>
          </div>
        </nav>
      </header>

      <main className="min-h-screen bg-gradient-to-r from-blue-100 to-white pb-12">
        {/* Hero Slider */}
        <div className="relative h-full w-full">
          <div
            ref={sliderRef}
            className="keen-slider rounded-2xl bg-white shadow-xl"
          >
            {heroSlides.map((slide, index) => (
              <div
                key={index}
                className="keen-slider__slide relative flex min-h-[500px] items-center overflow-hidden"
              >
                <Image
                  src={slide.image}
                  alt={slide.title}
                  fill
                  className="object-cover opacity-20"
                />
                <div className="relative z-10 mx-auto max-w-3xl p-12 text-center">
                  <h1 className="mb-6 text-4xl font-bold text-gray-900">
                    {slide.title}
                  </h1>
                  <p className="text-lg text-gray-600">{slide.description}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Slider controls */}
          {instanceRef.current && (
            <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
              {[...Array(heroSlides.length)].map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => instanceRef.current?.moveToIdx(idx)}
                  className={`h-2 w-2 rounded-full transition-all ${
                    currentSlide === idx ? "w-6 bg-blue-600" : "bg-blue-300"
                  }`}
                />
              ))}
            </div>
          )}

          <button
            onClick={() => instanceRef.current?.prev()}
            className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-2 shadow-lg backdrop-blur-sm transition hover:bg-white"
          >
            <ChevronLeft className="h-6 w-6 text-blue-600" />
          </button>

          <button
            onClick={() => instanceRef.current?.next()}
            className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-2 shadow-lg backdrop-blur-sm transition hover:bg-white"
          >
            <ChevronRight className="h-6 w-6 text-blue-600" />
          </button>
        </div>

        {/* Search and Filters */}
        <div className="mx-auto mt-8 max-w-6xl px-4 py-4">
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

            <div className="mb-4 flex flex-wrap items-center justify-center gap-2">
              <Badge
                variant={showNewOnly ? "default" : "outline"}
                className={`cursor-pointer px-6 py-2.5 text-sm transition-all duration-200 ${
                  showNewOnly
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-500/25 hover:translate-y-[-2px] hover:bg-blue-700"
                    : "border-blue-500/30 text-blue-600 hover:translate-y-[-2px] hover:border-blue-500 hover:bg-blue-500/10"
                }`}
                onClick={() => setShowNewOnly(!showNewOnly)}
              >
                New Services
              </Badge>

              {channels.map((channel) => (
                <Badge
                  key={channel.name}
                  variant={
                    selectedChannels.includes(channel.name)
                      ? "default"
                      : "outline"
                  }
                  className={`cursor-pointer px-6 py-2.5 text-sm transition-all duration-200 ${
                    selectedChannels.includes(channel.name)
                      ? "bg-blue-600 text-white shadow-lg shadow-blue-500/25 hover:translate-y-[-2px] hover:bg-blue-700"
                      : "border-blue-500/30 text-blue-600 hover:translate-y-[-2px] hover:border-blue-500 hover:bg-blue-500/10"
                  }`}
                  onClick={() => toggleChannel(channel.name)}
                >
                  <div className="flex items-center gap-2">
                    {channel.icon}
                    {channel.name}
                  </div>
                </Badge>
              ))}
            </div>
          </div>

          {/* Projects Grid */}
          {sortedCategories.map((category) => (
            <div key={category} className="mb-12 w-full">
              <h2 className="mb-6 bg-gradient-to-r from-black via-blue-800 to-blue-500 bg-clip-text text-3xl font-bold text-transparent drop-shadow-sm">
                {category}
              </h2>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {groupedProjects[category].map((project) => (
                  <Card
                    key={project.serialNo}
                    className="group relative cursor-pointer overflow-hidden border-0 bg-white shadow-lg transition-all duration-200 hover:shadow-xl"
                    onClick={() => fetchProjectDetails(project.serialNo)}
                  >
                    {/* Project Image */}
                    <div className="relative h-48 w-full overflow-hidden">
                      <Image
                        src={getProjectImage(project)}
                        alt={project.title}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                      />

                      {/* Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>

                      {/* New Badge */}
                      {isNewService(project.timeUpdated) && (
                        <div className="absolute left-3 top-3 z-20">
                          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-500 text-xs font-bold text-white">
                            N
                          </div>
                        </div>
                      )}

                      {/* Edit/Delete Icons */}
                      {viewMode === "internal" && (
                        <div className="absolute right-3 top-3 z-20 flex gap-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEditProject(project);
                            }}
                            className="rounded-full bg-white/80 p-2 text-blue-600 hover:bg-white"
                            title="Edit"
                          >
                            <Pencil className="h-4 w-4" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteProject(project);
                            }}
                            className="rounded-full bg-white/80 p-2 text-red-600 hover:bg-white"
                            title="Delete"
                            disabled={isDeleting}
                          >
                            <Trash className="h-4 w-4" />
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Card Content */}
                    <CardHeader className="space-y-4 p-4">
                      <div className="space-y-2">
                        <CardTitle className="text-xl font-semibold text-gray-900">
                          {project.title}
                        </CardTitle>
                        <div className="flex flex-wrap gap-2">
                          {project.industry.slice(0, 2).map((ind) => (
                            <Badge
                              key={ind}
                              variant="secondary"
                              className="bg-blue-50 text-blue-700"
                            >
                              {ind}
                            </Badge>
                          ))}
                          {project.industry.length > 2 && (
                            <Badge
                              variant="secondary"
                              className="cursor-pointer bg-gray-50 text-gray-600 hover:bg-gray-100"
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleIndustryExpand(project.serialNo);
                              }}
                            >
                              +{project.industry.length - 2}
                            </Badge>
                          )}
                        </div>

                        {/* Expanded Industries */}
                        {expandedIndustries[project.serialNo] && (
                          <div className="flex flex-wrap gap-2 pt-2">
                            {project.industry.slice(2).map((ind) => (
                              <Badge
                                key={ind}
                                variant="secondary"
                                className="bg-blue-50 text-blue-700"
                              >
                                {ind}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>

                      <CardDescription className="text-gray-600">
                        {project.description}
                      </CardDescription>

                      <div className="flex gap-2">
                        {channels.map(
                          (channel) =>
                            project.applicableRoutes?.includes(
                              channel.name,
                            ) && (
                              <div
                                key={channel.name}
                                className="rounded-full bg-gray-50 p-2"
                                title={channel.name}
                              >
                                {channel.icon}
                              </div>
                            ),
                        )}
                      </div>
                    </CardHeader>
                  </Card>
                ))}
              </div>
            </div>
          ))}

          {/* Edit Dialog */}
          <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
            <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Edit Project</DialogTitle>
                <DialogDescription>
                  Update the project information below.
                </DialogDescription>
              </DialogHeader>

              <form
                onSubmit={handleSubmit(handleSaveProject)}
                className="space-y-4"
              >
                <div>
                  <Label htmlFor="title">Title</Label>
                  <Input id="title" {...register("title")} className="mt-1" />
                  {errors.title && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.title.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    {...register("description")}
                    className="mt-1"
                    rows={3}
                  />
                  {errors.description && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.description.message}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="category">Category</Label>
                    <Input
                      id="category"
                      {...register("category")}
                      className="mt-1"
                    />
                    {errors.category && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.category.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="card_image">Card Image URL</Label>
                    <Input
                      id="card_image"
                      {...register("card_image")}
                      className="mt-1"
                      placeholder="https://..."
                    />
                    {errors.card_image && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.card_image.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="industry">Industry (comma-separated)</Label>
                    <Input
                      id="industry"
                      {...register("industry")}
                      className="mt-1"
                      placeholder="Healthcare, Finance, Education"
                    />
                    {errors.industry && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.industry.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-3">
                  <Label>Project Links</Label>

                  <div>
                    <Label htmlFor="telerivetUrl" className="text-sm">
                      Telerivet URL
                    </Label>
                    <Input
                      id="telerivetUrl"
                      {...register("telerivetUrl")}
                      className="mt-1"
                      placeholder="https://..."
                    />
                  </div>

                  <div>
                    <Label htmlFor="canvaUrl" className="text-sm">
                      Canva URL
                    </Label>
                    <Input
                      id="canvaUrl"
                      {...register("canvaUrl")}
                      className="mt-1"
                      placeholder="https://..."
                    />
                  </div>

                  <div>
                    <Label htmlFor="hubspotUrl" className="text-sm">
                      HubSpot URL
                    </Label>
                    <Input
                      id="hubspotUrl"
                      {...register("hubspotUrl")}
                      className="mt-1"
                      placeholder="https://..."
                    />
                  </div>

                  <div>
                    <Label htmlFor="liveUrl" className="text-sm">
                      Live Project URL
                    </Label>
                    <Input
                      id="liveUrl"
                      {...register("liveUrl")}
                      className="mt-1"
                      placeholder="https://..."
                    />
                  </div>
                </div>

                <div>
                  <Label>Applicable Routes</Label>
                  <div className="mt-2 space-y-2">
                    {channels.map((channel) => (
                      <div
                        key={channel.name}
                        className="flex items-center space-x-2"
                      >
                        <Checkbox
                          id={channel.name}
                          checked={watchedRoutes?.includes(channel.name)}
                          onCheckedChange={(checked) => {
                            const current = watchedRoutes || [];
                            if (checked) {
                              setValue("applicableRoutes", [
                                ...current,
                                channel.name,
                              ]);
                            } else {
                              setValue(
                                "applicableRoutes",
                                current.filter((r) => r !== channel.name),
                              );
                            }
                          }}
                        />
                        <Label
                          htmlFor={channel.name}
                          className="flex items-center gap-2"
                        >
                          {channel.icon}
                          {channel.name}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setEditDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isUpdating}>
                    {isUpdating ? (
                      <>
                        <AlertCircle className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Save Changes
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>

          {/* Project Details Dialog */}
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogContent className="max-h-[90vh] max-w-4xl overflow-y-auto">
              {loadingDetails ? (
                <div className="flex items-center justify-center py-8">
                  <div className="text-xl text-blue-600">
                    Loading details...
                  </div>
                </div>
              ) : selectedProject ? (
                <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                  <div>
                    {(selectedProject.card_image || selectedProject.image) && (
                      <Image
                        src={
                          selectedProject.card_image &&
                          selectedProject.card_image.trim() !== ""
                            ? selectedProject.card_image
                            : selectedProject.image ||
                              "https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=400&h=500"
                        }
                        alt={selectedProject.title}
                        width={400}
                        height={500}
                        className="rounded-lg object-cover"
                      />
                    )}
                  </div>

                  <div className="space-y-6">
                    <DialogHeader className="space-y-4">
                      <DialogTitle className="text-2xl font-bold text-gray-900">
                        {selectedProject.title}
                      </DialogTitle>
                      <DialogDescription className="text-gray-600">
                        {selectedProject.description}
                      </DialogDescription>
                      <div className="flex flex-wrap gap-2">
                        {(selectedProject.industry?.split(", ") || [])
                          .slice(0, 3)
                          .map((ind) => (
                            <Badge
                              key={ind}
                              variant="secondary"
                              className="bg-blue-50 text-blue-700"
                            >
                              {ind}
                            </Badge>
                          ))}
                      </div>
                    </DialogHeader>

                    <section>
                      <h3 className="text-lg font-semibold text-gray-900">
                        Overview
                      </h3>
                      <p className="mt-2 text-gray-600">
                        {selectedProject.overview}
                      </p>
                    </section>

                    <section>
                      <h3 className="text-lg font-semibold text-gray-900">
                        Key Benefits
                      </h3>
                      <ul className="mt-2 space-y-2">
                        {selectedProject.benefits?.map((benefit, index) => (
                          <li
                            key={index}
                            className="flex items-start gap-2 text-gray-600"
                          >
                            <span className="text-blue-500">•</span>
                            {benefit}
                          </li>
                        ))}
                      </ul>
                    </section>

                    {selectedProject.applicableRoutes?.length > 0 && (
                      <section>
                        <h3 className="text-lg font-semibold text-gray-900">
                          Channels
                        </h3>
                        <div className="mt-2 flex flex-wrap gap-3">
                          {channels.map(
                            (channel) =>
                              selectedProject.applicableRoutes.includes(
                                channel.name,
                              ) && (
                                <div
                                  key={channel.name}
                                  className="flex items-center gap-2 rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-800"
                                >
                                  {channel.icon}
                                  <span>{channel.name}</span>
                                </div>
                              ),
                          )}
                        </div>
                      </section>
                    )}
                  </div>
                </div>
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
