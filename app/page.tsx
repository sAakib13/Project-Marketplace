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
} from "lucide-react";
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
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Link from "next/link";
import axios from "axios";
import Logo from "./TR-white-logo.png";
import Hero from "./Hero.png";
import Image from "next/image";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";

type Project = {
  title: string;
  description: string;
  industry: string[];
  serialNo: string;
  category: string;
  timeUpdated: number;
  applicableRoutes: string[];
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

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  organization: z.string().min(2, "Organization must be at least 2 characters"),
});

export default function Home() {
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
  const [showRegistration, setShowRegistration] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>({
    initial: 0,
    slideChanged(slider) {
      setCurrentSlide(slider.track.details.rel);
    },
    loop: true,
    mode: "snap",
    slides: { perView: 1 },
  });

  useEffect(() => {
    const interval = setInterval(() => {
      if (instanceRef.current) {
        instanceRef.current.next();
      }
    }, 5000);

    return () => {
      clearInterval(interval);
    };
  }, [instanceRef]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const showThreshold = window.innerHeight * 0.5;

      if (scrollPosition > showThreshold && !hasScrolled && !formSubmitted) {
        setHasScrolled(true);
        setShowRegistration(true);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [hasScrolled, formSubmitted]);

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

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      console.log("Form submitted:", data);
      setFormSubmitted(true);
      setShowRegistration(false);
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  const filteredProjects = projects
    .filter((project) => {
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
              className="font-medium text-white transition-colors hover:text-blue-600"
            >
              Solutions
            </Link>
            <Link
              href="https://telerivet.com/signup"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-white transition-colors hover:text-blue-600"
            >
              Sign Up
            </Link>
            <Link
              href="https://telerivet.com/login"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-blue-600 px-4 py-2 font-medium text-white transition-all hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-500/25"
            >
              Login
            </Link>
          </div>
        </nav>
      </header>

      <main className="min-h-screen bg-gradient-to-r from-blue-100 to-white pb-12">
        <div className="mx-auto max-w-6xl px-4 py-4">
          <div className="relative my-16">
            <div
              ref={sliderRef}
              className="keen-slider rounded-2xl bg-white shadow-2xl"
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
                  <div className="relative z-10 grid grid-cols-1 items-center gap-8 p-12 md:grid-cols-2">
                    <div className="text-center md:text-left">
                      <h1 className="mb-6 bg-gradient-to-r from-gray-900 via-gray-500 to-black bg-clip-text text-5xl font-bold text-transparent">
                        {slide.title}
                      </h1>
                      <p className="mb-8 text-lg leading-relaxed text-gray-700">
                        {slide.description}
                      </p>
                      <div className="flex justify-center gap-4 md:justify-start">
                        <a href="#solutions">
                          <button className="rounded-full bg-blue-600 px-6 py-3 font-semibold text-white shadow-lg transition hover:bg-blue-700">
                            Get Started
                          </button>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {instanceRef.current && (
              <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
                {[...Array(heroSlides.length)].map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      instanceRef.current?.moveToIdx(idx);
                    }}
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

            <div className="absolute right-4 top-4">
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
          </div>

          <div className="pb-20" id="solutions">
            <hr className="rounded-full border-t-2 border-black opacity-80" />
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
              <h2 className="mb-6 bg-gradient-to-r from-black via-blue-800 to-blue-500 bg-clip-text text-3xl font-bold text-transparent drop-shadow-sm">
                {category}
              </h2>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {groupedProjects[category].map((project) => (
                  <Card
                    key={project.serialNo}
                    className="group relative cursor-pointer border-2 border-blue-500/20 bg-white transition-all duration-200 hover:translate-y-[-4px] hover:border-blue-500/40 hover:shadow-xl hover:shadow-blue-500/10"
                    onClick={() => fetchProjectDetails(project.serialNo)}
                  >
                    {isNewService(project.timeUpdated) && (
                      <div className="absolute -right-2 -top-2 z-10">
                        <Badge className="rounded-full bg-green-500 px-2 py-1 text-xs font-semibold text-white shadow-lg">
                          New
                        </Badge>
                      </div>
                    )}

                    <CardHeader className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-500">
                          #{project.serialNo}
                        </span>
                      </div>

                      <div className="space-y-3">
                        <CardTitle className="bg-gradient-to-r from-blue-900 via-blue-600 to-black bg-clip-text text-2xl font-bold text-transparent">
                          {project.title}
                        </CardTitle>

                        <div className="flex flex-wrap gap-2">
                          {(expandedIndustries[project.serialNo]
                            ? project.industry
                            : project.industry.slice(0, 3)
                          ).map((ind) => (
                            <Badge
                              key={ind}
                              variant="secondary"
                              className="border-blue-500/30 bg-blue-500/10 text-blue-600"
                            >
                              {ind}
                            </Badge>
                          ))}
                          {!expandedIndustries[project.serialNo] &&
                            project.industry.length > 3 && (
                              <Badge
                                variant="secondary"
                                className="cursor-pointer border-blue-500/30 bg-blue-500/10 text-blue-600 hover:bg-blue-500/20"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleIndustryExpand(project.serialNo);
                                }}
                              >
                                +{project.industry.length - 3}
                              </Badge>
                            )}
                        </div>

                        <div className="flex gap-2">
                          {channels.map(
                            (channel) =>
                              project.applicableRoutes?.includes(
                                channel.name,
                              ) && (
                                <div
                                  key={channel.name}
                                  className="group/channel relative"
                                >
                                  <div className="rounded-full border border-blue-500/30 bg-white p-2 transition-all duration-200 group-hover/channel:border-blue-500 group-hover/channel:bg-blue-500/10">
                                    {channel.icon}
                                  </div>
                                  <div className="absolute -top-8 left-1/2 hidden -translate-x-1/2 rounded bg-gray-800 px-2 py-1 text-xs text-white group-hover/channel:block">
                                    {channel.name}
                                  </div>
                                </div>
                              ),
                          )}
                        </div>
                      </div>

                      <CardDescription className="text-base text-gray-600">
                        {project.description}
                      </CardDescription>
                    </CardHeader>

                    {viewMode === "internal" && (
                      <CardContent>
                        <div className="space-y-4">
                          {project.links.map((link, linkIndex) => (
                            <div key={linkIndex} className="group/link">
                              <Link
                                href={link.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-start space-x-4 rounded-lg p-3 transition-all duration-200 hover:translate-x-2 hover:bg-blue-500/10"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <span className="text-2xl">{link.icon}</span>
                                <div className="flex-1">
                                  <div className="flex items-center gap-2">
                                    <h3 className="text-base font-semibold text-blue-600">
                                      {link.name}
                                    </h3>
                                    <ExternalLink className="h-4 w-4 text-blue-600 opacity-0 transition-opacity group-hover/link:opacity-100" />
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
            <DialogContent className="max-h-[90vh] max-w-4xl overflow-y-auto border-blue-500/20 bg-white p-6">
              {loadingDetails ? (
                <div className="flex items-center justify-center py-8">
                  <div className="text-xl text-blue-600">
                    Loading details...
                  </div>
                </div>
              ) : selectedProject ? (
                <>
                  <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                    <div className="lg:col-span-2">
                      <DialogHeader className="mb-6">
                        <DialogTitle className="text-3xl font-bold text-blue-600">
                          {selectedProject.title}
                        </DialogTitle>
                        <DialogDescription className="mt-2 text-lg text-gray-600">
                          {selectedProject.description}
                        </DialogDescription>
                      </DialogHeader>

                      <div className="space-y-8">
                        <section>
                          <h3 className="mb-4 text-xl font-semibold text-blue-600">
                            Overview
                          </h3>
                          <p className="text-gray-700">
                            {selectedProject.overview}
                          </p>
                        </section>

                        <section>
                          <h3 className="mb-4 text-xl font-semibold text-blue-600">
                            Key Benefits
                          </h3>
                          <ul className="grid gap-3">
                            {selectedProject.benefits.map((benefit, index) => (
                              <li
                                key={index}
                                className="flex items-start gap-3"
                              >
                                <span className="mt-1 text-blue-500">•</span>
                                <span className="text-gray-700">{benefit}</span>
                              </li>
                            ))}
                          </ul>
                        </section>

                        <section>
                          <h3 className="mb-4 text-xl font-semibold text-blue-600">
                            Use Case
                          </h3>
                          <p className="text-gray-700">
                            {selectedProject.usecase}
                          </p>
                        </section>

                        <section>
                          <h3 className="mb-4 text-xl font-semibold text-blue-600">
                            Implementation Steps
                          </h3>
                          <ul className="grid gap-3">
                            {selectedProject.implementation.map(
                              (step, index) => (
                                <li
                                  key={index}
                                  className="flex items-start gap-3"
                                >
                                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm font-medium text-blue-600">
                                    {index + 1}
                                  </span>
                                  <span className="text-gray-700">{step}</span>
                                </li>
                              ),
                            )}
                          </ul>
                        </section>

                        <section>
                          <h3 className="mb-4 text-xl font-semibold text-blue-600">
                            ROI & Metrics
                          </h3>
                          <ul className="grid gap-3">
                            {selectedProject.roiMetrics.map((metric, index) => (
                              <li
                                key={index}
                                className="flex items-start gap-3"
                              >
                                <span className="mt-1 text-green-500">✓</span>
                                <span className="text-gray-700">{metric}</span>
                              </li>
                            ))}
                          </ul>
                        </section>
                      </div>
                    </div>

                    <div className="lg:col-span-1">
                      <div className="sticky top-6">
                        <div className="overflow-hidden rounded-lg border border-blue-500/20 bg-blue-50/50 p-4">
                          {selectedProject.image && (
                            <Image
                              src={selectedProject.image}
                              alt={selectedProject.title}
                              width={400}
                              height={400}
                              className="mb-4 rounded-lg"
                            />
                          )}
                          <div className="space-y-4">
                            <div>
                              <h4 className="text-sm font-medium text-gray-500">
                                Service ID
                              </h4>
                              <p className="text-lg font-semibold text-blue-600">
                                #{selectedProject.serialNo}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              ) : null}
            </DialogContent>
          </Dialog>

          <Dialog open={showRegistration} onOpenChange={setShowRegistration}>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold text-blue-600">
                  Get Access to More Features
                </DialogTitle>
                <DialogDescription>
                  Join our community to unlock exclusive content and features.
                </DialogDescription>
              </DialogHeader>
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="space-y-4 pt-4"
              >
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    {...register("name")}
                    className="border-blue-500/20"
                    placeholder="John Doe"
                  />
                  {errors.name && (
                    <p className="text-sm text-red-500">
                      {errors.name.message as string}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    {...register("email")}
                    className="border-blue-500/20"
                    placeholder="john@example.com"
                  />
                  {errors.email && (
                    <p className="text-sm text-red-500">
                      {errors.email.message as string}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="organization">Organization</Label>
                  <Input
                    id="organization"
                    {...register("organization")}
                    className="border-blue-500/20"
                    placeholder="Your Company"
                  />
                  {errors.organization && (
                    <p className="text-sm text-red-500">
                      {errors.organization.message as string}
                    </p>
                  )}
                </div>

                <Button
                  type="submit"
                  className="w-full bg-blue-600 text-white hover:bg-blue-700"
                >
                  Register
                </Button>
              </form>
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
