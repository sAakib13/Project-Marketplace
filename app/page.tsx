"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import axios from "axios";
import Logo from "../public/TR-white-logo.png";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import {
  Eye,
  Edit,
  Trash2,
  Plus,
  ExternalLink,
  Building2,
  Tag,
  Calendar,
  Hash,
  Globe,
  Palette,
  BarChart3,
  Smartphone,
  Loader2,
  X,
  AlertCircle,
  Search,
  ChevronLeft,
  ChevronRight,
  Users,
  User,
  MessageSquare,
  Mail,
  Phone,
  Bell,
  ShoppingCart,
  Heart,
  Star,
  TrendingUp,
  Filter,
  ChevronDown,
} from "lucide-react";

// Types
interface Project {
  title: string;
  description: string;
  serialNo: string;
  category: string;
  timeUpdated: number;
  rowId: string;
  cardImage?: string;
  applicableRoutes: string[];
  industry: string[];
  links: {
    name: string;
    url: string;
    description: string;
    icon: string;
  }[];
}

interface ProjectArticle {
  title: string;
  description: string;
  serialNo: string;
  usecase: string;
  benefits: string[];
  implementation: string[];
  roiMetrics: string[];
  image: string;
}

// Form schemas
const editProjectSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  category: z.string().min(1, "Category is required"),
  industry: z.array(z.string()).min(1, "At least one industry is required"),
  applicableRoutes: z
    .array(z.string())
    .min(1, "At least one route is required"),
  cardImage: z.string().optional(),
  telerivetUrl: z.string().optional(),
  canvaUrl: z.string().optional(),
  hubspotUrl: z.string().optional(),
  liveUrl: z.string().optional(),
  videoUrl: z.string().optional(),
});

const addProjectSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  category: z.string().min(1, "Category is required"),
  industry: z.array(z.string()).min(1, "At least one industry is required"),
  telerivetUrl: z.string().optional(),
  canvaUrl: z.string().optional(),
  hubspotUrl: z.string().optional(),
  liveUrl: z.string().optional(),
  videoUrl: z.string().optional(),
  applicableRoutes: z
    .array(z.string())
    .min(1, "At least one route is required"),
  cardImage: z.string().optional(),
  serialNo: z.string().optional(),
});

type EditProjectForm = z.infer<typeof editProjectSchema>;
type AddProjectForm = z.infer<typeof addProjectSchema>;

const categories = [
  "Marketing & Communications",
  "Security & Authentication",
  "Polls & Feedback",
  "Communications & Customer Interactions",
];

const industries = [
  "Technology",
  "Healthcare",
  "Finance",
  "Education",
  "Retail",
  "Manufacturing",
  "Real Estate",
  "Hospitality",
  "Logistics",
  "Entertainment",
  "Government",
  "Non-profit",
  "FMCG",
  "Telecom",
  "Banking",
  "Insurance",
  "Automotive",
  "Media",
  "Travel",
  "Food & Beverage",
];

// Updated routes - only SMS, WhatsApp, Viber, Voice
const routes = ["SMS", "WhatsApp", "Viber", "Voice", "Messenger"];

// Hero slides data
const heroSlides = [
  {
    title: "Transform Your Business Communication",
    description:
      "Powerful SMS solutions that drive engagement and deliver results across all industries.",
    image:
      "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=1200&h=600&fit=crop",
  },
  {
    title: "Reach Customers Instantly",
    description:
      "Connect with your audience through reliable, scalable SMS campaigns that convert.",
    image:
      "https://images.unsplash.com/photo-1556761175-b413da4baf72?w=1200&h=600&fit=crop",
  },
  {
    title: "Automate Your Success",
    description:
      "Streamline workflows with intelligent automation that saves time and increases efficiency.",
    image:
      "https://images.unsplash.com/photo-1551434678-e076c223a692?w=1200&h=600&fit=crop",
  },
];

// Utility functions
const getProjectImage = (project: Project): string => {
  // First priority: dynamic card image from Telerivet
  if (project.cardImage && project.cardImage.trim() !== "") {
    return project.cardImage;
  }

  // Fallback to category-based stock images
  const categoryImages: { [key: string]: string } = {
    "Marketing & Communications":
      "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400&h=250&fit=crop",
    "Security & Authentication":
      "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=400&h=250&fit=crop",
    "Polls & Feedback":
      "https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=400&h=250&fit=crop",
    "E-commerce":
      "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=250&fit=crop",
    Healthcare:
      "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=250&fit=crop",
    Education:
      "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400&h=250&fit=crop",
    Finance:
      "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=250&fit=crop",
    "Real Estate":
      "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&h=250&fit=crop",
    Retail:
      "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=250&fit=crop",
    Hospitality:
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=250&fit=crop",
    Logistics:
      "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=400&h=250&fit=crop",
    Entertainment:
      "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400&h=250&fit=crop",
  };

  return (
    categoryImages[project.category] ||
    "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=250&fit=crop"
  );
};

const formatDate = (timestamp: number): string => {
  return new Date(timestamp * 1000).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const getLinkIcon = (iconString: string) => {
  const iconMap: { [key: string]: React.ReactNode } = {
    "📱": <Smartphone className="h-4 w-4" />,
    "🎨": <Palette className="h-4 w-4" />,
    "📊": <BarChart3 className="h-4 w-4" />,
    "🌐": <Globe className="h-4 w-4" />,
  };
  return iconMap[iconString] || <ExternalLink className="h-4 w-4" />;
};

// Utility function to format descriptions with numbered lists
const formatDescription = (description: string) => {
  // Check if description contains numbered items (1. 2. 3. etc.)
  const numberedPattern = /(\d+\.\s)/g;
  const hasNumberedItems = numberedPattern.test(description);

  if (!hasNumberedItems) {
    return <p className="text-sm text-gray-600">{description}</p>;
  }

  // Split by numbered items and process
  const parts = description.split(/(\d+\.\s)/);
  const introText = parts[0].trim();
  const listItems = [];

  // Group numbered items
  for (let i = 1; i < parts.length; i += 2) {
    if (parts[i] && parts[i + 1]) {
      const number = parts[i].trim();
      const text = parts[i + 1].trim();
      if (text) {
        listItems.push({ number, text });
      }
    }
  }

  return (
    <div className="text-sm">
      {introText && <p className="mb-2 text-gray-600">{introText}</p>}
      {listItems.length > 0 && (
        <ul className="ml-4 space-y-1 text-gray-600">
          {listItems.map((item, index) => (
            <li key={index} className="flex items-start">
              <span className="mr-2 flex-shrink-0 font-medium text-blue-600">
                {item.number}
              </span>
              <span>{item.text}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

// Enhanced function to parse description with multiple sections
const parseDescriptionWithSections = (description: string) => {
  if (!description) return { intro: "", sections: {} };

  // Define section keywords
  const sectionKeywords = [
    "Key Features",
    "Benefits",
    "When to Use",
    "Pain Points To Solve",
    "Usecase",
  ];

  // Create regex pattern to match any section keyword followed by colon or content
  const sectionPattern = new RegExp(
    `(${sectionKeywords.join("|")})\\s*:?\\s*`,
    "gi",
  );

  // Split by section keywords
  const parts = description.split(sectionPattern);

  let intro = "";
  const sections: { [key: string]: string[] } = {};
  let currentSection = "";

  for (let i = 0; i < parts.length; i++) {
    const part = parts[i]?.trim();
    if (!part) continue;

    // Check if this part is a section keyword
    const isKeyword = sectionKeywords.some(
      (keyword) => part.toLowerCase() === keyword.toLowerCase(),
    );

    if (isKeyword) {
      currentSection = part;
    } else if (currentSection) {
      // This is content for the current section
      sections[currentSection] = parseListItems(part);
    } else {
      // This is intro content (before any sections)
      intro += part + " ";
    }
  }

  // If no sections found but has numbered/bullet lists, treat as Usecase
  if (Object.keys(sections).length === 0) {
    const listResult = parseListItems(description);
    if (
      listResult.length > 1 ||
      (listResult.length === 1 && listResult[0] !== description.trim())
    ) {
      // Has list items, separate intro from list
      const hasNumberedList = /\d+\./.test(description);
      const hasBulletList = /[*#]/.test(description);

      if (hasNumberedList || hasBulletList) {
        const beforeList =
          description.split(/(?=\d+\.)|(?=[*#])/)[0]?.trim() || "";
        const listPart = description.replace(beforeList, "").trim();

        return {
          intro: beforeList,
          sections: {
            Usecase: parseListItems(listPart),
          },
        };
      }
    }
  }

  return {
    intro: intro.trim(),
    sections,
  };
};

// Function to parse list items from text
const parseListItems = (text: string): string[] => {
  if (!text) return [];

  // Check for numbered lists (1., 2., 3., etc.)
  const numberedMatches = text.match(/\d+\.\s*[^0-9]*?(?=\d+\.|$)/g);
  if (numberedMatches && numberedMatches.length > 1) {
    return numberedMatches
      .map((item) => item.replace(/^\d+\.\s*/, "").trim())
      .filter(Boolean);
  }

  // Check for bullet points with *, #, &, or @
  const bulletMatches = text.match(/[*#&@]\s*[^*#&@]*?(?=[*#&@]|$)/g);
  if (bulletMatches && bulletMatches.length > 1) {
    return bulletMatches
      .map((item) => item.replace(/^[*#&@]\s*/, "").trim())
      .filter(Boolean);
  }

  // If no list pattern found, return as single item
  return [text.trim()];
};

// Component to render formatted sections
const FormattedDescription = ({ description }: { description: string }) => {
  const { intro, sections } = parseDescriptionWithSections(description);

  return (
    <div className="space-y-4">
      {intro && <p className="leading-relaxed text-gray-600">{intro}</p>}

      {Object.entries(sections).map(([sectionTitle, items]) => (
        <div key={sectionTitle} className="space-y-2">
          <h4 className="text-sm font-semibold uppercase tracking-wide text-blue-600">
            {sectionTitle}:
          </h4>
          <ul className="ml-4 list-disc space-y-1">
            {items.map((item, index) => (
              <li key={index} className="text-sm leading-relaxed text-gray-600">
                {item}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

const CardDescription = ({ description }: { description: string }) => {
  const { intro, sections } = parseDescriptionWithSections(description);
  const usecaseItems = sections["Usecase"] || [];

  return (
    <div className="space-y-4 text-sm text-gray-700">
      {intro && <p className="leading-relaxed text-white">{intro}</p>}

      {usecaseItems.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-white">
            Usecase
          </h4>
          <ul className="list-inside list-disc space-y-1 pl-2">
            {usecaseItems.map((item, index) => (
              <li key={index} className="leading-snug text-white">
                {item}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default function ProjectHub() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [projectArticle, setProjectArticle] = useState<ProjectArticle | null>(
    null,
  );
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedIndustry, setSelectedIndustry] = useState("All");
  const [viewMode, setViewMode] = useState<"internal" | "external">("external");
  const [maxSerialNo, setMaxSerialNo] = useState<string>("0");
  const [currentSlide, setCurrentSlide] = useState(0);

  // Keen Slider setup
  const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>(
    {
      loop: true,
      slides: {
        perView: 1,
      },
      slideChanged(slider) {
        setCurrentSlide(slider.track.details.rel);
      },
    },
    [
      (slider) => {
        let timeout: ReturnType<typeof setTimeout>;
        let mouseOver = false;
        function clearNextTimeout() {
          clearTimeout(timeout);
        }
        function nextTimeout() {
          clearTimeout(timeout);
          if (mouseOver) return;
          timeout = setTimeout(() => {
            slider.next();
          }, 4000);
        }
        slider.on("created", () => {
          slider.container.addEventListener("mouseover", () => {
            mouseOver = true;
            clearNextTimeout();
          });
          slider.container.addEventListener("mouseout", () => {
            mouseOver = false;
            nextTimeout();
          });
          nextTimeout();
        });
        slider.on("dragStarted", clearNextTimeout);
        slider.on("animationEnded", nextTimeout);
        slider.on("updated", nextTimeout);
      },
    ],
  );

  // Form hooks
  const editForm = useForm<EditProjectForm>({
    resolver: zodResolver(editProjectSchema),
    defaultValues: {
      title: "",
      description: "",
      category: "",
      industry: [],
      applicableRoutes: [],
      cardImage: "",
    },
  });

  const addForm = useForm<AddProjectForm>({
    resolver: zodResolver(addProjectSchema),
    defaultValues: {
      title: "",
      description: "",
      category: "",
      industry: [],
      telerivetUrl: "",
      canvaUrl: "",
      hubspotUrl: "",
      liveUrl: "",
      videoUrl: "",
      applicableRoutes: [],
      cardImage: "",
      serialNo: "",
    },
  });

  // Toggle functions
  const toggleViewMode = () => {
    setViewMode(viewMode === "internal" ? "external" : "internal");
  };

  // Fetch projects and max serial number
  const fetchProjects = async (serialNo: string) => {
    try {
      setIsLoading(true);
      const response = await axios.get(`/api/telerivet/${serialNo}`);
      const projectsData = response.data;
      setProjects(projectsData);
      setFilteredProjects(projectsData);

      // Find max serial number
      if (projectsData.length > 0) {
        const serialNumbers = projectsData
          .map((p: Project) => p.serialNo)
          .filter((sn: string) => sn && !isNaN(parseInt(sn)))
          .map((sn: string) => parseInt(sn))
          .sort((a: number, b: number) => b - a);

        if (serialNumbers.length > 0) {
          setMaxSerialNo(serialNumbers[0].toString());
        }
      }
    } catch (error) {
      console.error("Error fetching projects:", error);
      toast.error("Failed to fetch projects");
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch project article details
  const fetchProjectArticle = async (serialNo: string) => {
    try {
      const response = await axios.get(`/api/telerivet/${serialNo}`);
      if (response.data && response.data.length > 0) {
        setProjectArticle(response.data[0]);
      } else {
        setProjectArticle(null);
      }
    } catch (error) {
      console.error("Error fetching project article:", error);
      setProjectArticle(null);
    }
  };

  // Handle view project
  const handleViewProject = async (project: Project) => {
    setSelectedProject(project);
    await fetchProjectArticle(project.serialNo);
    setIsViewDialogOpen(true);
  };

  // Handle edit project
  const handleEditProject = (project: Project) => {
    setSelectedProject(project);
    editForm.reset({
      title: project.title,
      description: project.description,
      category: project.category,
      industry: Array.isArray(project.industry)
        ? project.industry
        : [project.industry],
      applicableRoutes: project.applicableRoutes,
      cardImage: project.cardImage || "",
      telerivetUrl:
        project.links.find((link) => link.name === "Telerivet Project")?.url ||
        "",
      canvaUrl:
        project.links.find((link) => link.name === "Canva Decks")?.url || "",
      hubspotUrl:
        project.links.find((link) => link.name === "HubSpot Article")?.url ||
        "",
      liveUrl:
        project.links.find((link) => link.name === "Live Project")?.url || "",
      videoUrl: project.links.find((link) => link.name === "Video")?.url || "",
    });
    setIsEditDialogOpen(true);
  };

  // Handle save project (edit)
  const handleSaveProject = async (data: EditProjectForm) => {
    if (!selectedProject) return;

    try {
      setIsUpdating(true);
      const updateData = {
        rowId: selectedProject.rowId,
        vars: {
          title: data.title,
          description: data.description,
          category: data.category,
          industry: data.industry.join(","),
          applicable_route: data.applicableRoutes.join(","),
          card_image: data.cardImage || "",
          telerivet_url: data.telerivetUrl || "",
          canva_url: data.canvaUrl || "",
          hubspot_url: data.hubspotUrl || "",
          live_url: data.liveUrl || "",
          video_url: data.videoUrl || "",
        },
      };

      await axios.post("/api/telerivet/update", updateData);
      toast.success("Project updated successfully!");
      setIsEditDialogOpen(false);
      // Automatically refresh the project list
      await fetchProjects(selectedProject.serialNo);
    } catch (error) {
      console.error("Error updating project:", error);
      toast.error("Failed to update project");
    } finally {
      setIsUpdating(false);
    }
  };

  // Handle add project
  const handleAddProject = async (data: AddProjectForm) => {
    try {
      setIsAdding(true);
      const createData = {
        title: data.title,
        description: data.description,
        category: data.category,
        industry: data.industry.join(","),
        telerivetUrl: data.telerivetUrl,
        canvaUrl: data.canvaUrl,
        hubspotUrl: data.hubspotUrl,
        liveUrl: data.liveUrl,
        videoUrl: data.videoUrl,
        applicableRoutes: data.applicableRoutes,
        cardImage: data.cardImage,
        serialNo: data.serialNo || (parseInt(maxSerialNo) + 1).toString(),
      };

      await axios.post("/api/telerivet/create", createData);
      toast.success("Project created successfully!");
      setIsAddDialogOpen(false);
      addForm.reset();
      // Automatically refresh the project list
      await fetchProjects(
        data.serialNo || (parseInt(maxSerialNo) + 1).toString(),
      );
    } catch (error) {
      console.error("Error creating project:", error);
      toast.error("Failed to create project");
    } finally {
      setIsAdding(false);
    }
  };

  // Handle delete project
  const handleDeleteProject = async (project: Project) => {
    if (!confirm("Are you sure you want to delete this project?")) return;

    try {
      setIsDeleting(project.rowId);
      await axios.delete("/api/telerivet/delete", {
        data: { rowId: project.rowId },
      });
      toast.success("Project deleted successfully!");
      // Automatically refresh the project list
      await fetchProjects(project.serialNo);
    } catch (error) {
      console.error("Error deleting project:", error);
      toast.error("Failed to delete project");
    } finally {
      setIsDeleting(null);
    }
  };

  // Filter projects
  useEffect(() => {
    let filtered = projects;

    if (searchQuery) {
      filtered = filtered.filter(
        (project) =>
          project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          project.description.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }

    if (selectedCategory !== "All") {
      filtered = filtered.filter(
        (project) => project.category === selectedCategory,
      );
    }

    if (selectedIndustry !== "All") {
      filtered = filtered.filter((project) =>
        Array.isArray(project.industry)
          ? project.industry.includes(selectedIndustry)
          : project.industry === selectedIndustry,
      );
    }

    setFilteredProjects(filtered);
  }, [projects, searchQuery, selectedCategory, selectedIndustry]);

  // Load projects on mount
  useEffect(() => {
    fetchProjects(maxSerialNo);
  }, []);

  // Get unique categories and industries
  const uniqueCategories = Array.from(new Set(projects.map((p) => p.category)));
  const uniqueIndustries = Array.from(
    new Set(
      projects.flatMap((p) =>
        Array.isArray(p.industry) ? p.industry : [p.industry],
      ),
    ),
  );

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-r from-blue-100 to-white">
        <div className="text-center">
          <Loader2 className="mx-auto mb-4 h-8 w-8 animate-spin text-blue-600" />
          <p className="text-blue-800">Loading services...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-100 to-white">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-blue-500/20 bg-black/80 backdrop-blur-sm">
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <div className="flex items-center gap-4">
            <Image src={Logo} alt="Telerivet Logo" width={200} height={50} />
          </div>
          <div className="flex items-center gap-6">
            <div className="text-sm font-medium text-white">
              {maxSerialNo && `Latest S.N: ${maxSerialNo} • `}
              {filteredProjects.length} services available
            </div>
            <Link
              href="#solutions"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-blue-600 px-4 py-2 font-medium text-white transition-all hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-500/25"
            >
              Get Started
            </Link>
            {viewMode === "internal" && (
              <button
                onClick={() => setIsAddDialogOpen(true)}
                className="flex h-12 w-12 items-center justify-center rounded-full border border-green-500/30 bg-white shadow transition hover:border-green-500 hover:bg-green-500/10"
                title="Add New Service"
              >
                <Plus className="h-6 w-6 text-green-600" />
              </button>
            )}
            <button
              onClick={toggleViewMode}
              className="flex h-12 w-12 items-center justify-center rounded-full border border-blue-500/30 bg-white shadow transition hover:border-blue-500 hover:bg-blue-500/10"
              title={
                viewMode === "internal"
                  ? "Switch to External View"
                  : "Switch to Internal View"
              }
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

      <main className="relative min-h-screen pb-12">
        <Image
          src="/background.jpg"
          alt="Background"
          fill
          className="object-cover object-center"
          priority={true} // change to true if above-the-fold and critical
        />
        {/* Hero Slider */}
        <div className="relative mx-auto max-w-6xl px-4 py-8">
          <div
            ref={sliderRef}
            className="keen-slider overflow-hidden rounded-2xl bg-white shadow-xl"
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
          <div className="mb-8 rounded-2xl border border-white/20 bg-black/30 p-6 shadow-lg backdrop-blur-md">
            <div className="flex flex-col items-center gap-4 lg:flex-row">
              {/* Search Bar */}
              <div className="relative min-w-0 flex-1">
                <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center">
                  <Search className="h-5 w-5 text-white/80" />
                </div>
                <Input
                  type="search"
                  placeholder="Search services or descriptions..."
                  className="h-12 rounded-xl border-white/20 bg-black/20 pl-10 text-lg text-white placeholder-white/60 backdrop-blur-sm focus-visible:ring-white/40"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              {/* Category Filter */}
              <div className="flex items-center gap-2">
                <Filter className="h-5 w-5 text-white/80" />
                <Select
                  value={selectedCategory}
                  onValueChange={setSelectedCategory}
                >
                  <SelectTrigger className="h-12 w-48 rounded-xl border-white/20 bg-black/20 text-white backdrop-blur-sm">
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-white/20 bg-black/30 text-white backdrop-blur-md">
                    <SelectItem value="All">All Categories</SelectItem>
                    {uniqueCategories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Industry Filter */}
              <div className="flex items-center gap-2">
                <Building2 className="h-5 w-5 text-white/80" />
                <Select
                  value={selectedIndustry}
                  onValueChange={setSelectedIndustry}
                >
                  <SelectTrigger className="h-12 w-48 rounded-xl border-white/20 bg-black/20 text-white backdrop-blur-sm">
                    <SelectValue placeholder="All Industries" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-white/20 bg-black/30 text-white backdrop-blur-md">
                    <SelectItem value="All">All Industries</SelectItem>
                    {uniqueIndustries.map((industry) => (
                      <SelectItem key={industry} value={industry}>
                        {industry}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Projects Grid */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredProjects.map((project) => (
              <Card
                key={project.rowId}
                className="rounded-2xl border border-white/20 bg-black/30 text-white shadow-lg shadow-blue-500/10 backdrop-blur-md transition-all duration-300 hover:translate-y-[-2px] hover:shadow-xl hover:shadow-blue-500/20"
              >
                <div className="relative">
                  <img
                    src={getProjectImage(project)}
                    alt={project.title}
                    className="h-48 w-full rounded-t-2xl object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src =
                        "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=250&fit=crop";
                    }}
                  />
                  <div className="absolute right-2 top-2">
                    <Badge
                      variant="secondary"
                      className="bg-blue-600/80 text-white backdrop-blur-sm"
                    >
                      #{project.serialNo}
                    </Badge>
                  </div>
                </div>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-lg text-white drop-shadow">
                      {project.title}
                    </CardTitle>
                  </div>
                  <CardDescription description={project.description} />
                </CardHeader>
                <CardContent>
                  <div className="mb-4 flex flex-wrap gap-2">
                    <Badge
                      variant="outline"
                      className="border-blue-300/50 bg-blue-500/10 text-blue-100 backdrop-blur-sm"
                    >
                      <Tag className="mr-1 h-3 w-3" />
                      {project.category}
                    </Badge>
                    {Array.isArray(project.industry) ? (
                      project.industry.slice(0, 2).map((ind, idx) => (
                        <Badge
                          key={idx}
                          variant="outline"
                          className="border-green-300/50 bg-green-500/10 text-green-100 backdrop-blur-sm"
                        >
                          <Building2 className="mr-1 h-3 w-3" />
                          {ind}
                        </Badge>
                      ))
                    ) : (
                      <Badge
                        variant="outline"
                        className="border-green-300/50 bg-green-500/10 text-green-100 backdrop-blur-sm"
                      >
                        <Building2 className="mr-1 h-3 w-3" />
                        {project.industry}
                      </Badge>
                    )}
                    {Array.isArray(project.industry) &&
                      project.industry.length > 2 && (
                        <Badge
                          variant="outline"
                          className="border-gray-300/50 bg-gray-500/10 text-gray-100 backdrop-blur-sm"
                        >
                          +{project.industry.length - 2} more
                        </Badge>
                      )}
                  </div>
                  <div className="mb-4 flex items-center justify-between text-sm text-white/70">
                    <span className="flex items-center">
                      <Calendar className="mr-1 h-4 w-4" />
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
                      className="flex-1 border-white/30 text-black backdrop-blur-sm hover:bg-black/20 hover:text-white"
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
                          className="border-white/30 text-black backdrop-blur-sm hover:bg-black/20 hover:text-white"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDeleteProject(project)}
                          disabled={isDeleting === project.rowId}
                          className="border-red-300/50 text-red-600 backdrop-blur-sm hover:bg-red-500 hover:text-white"
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

          {filteredProjects.length === 0 && (
            <div className="py-12 text-center">
              <AlertCircle className="mx-auto mb-4 h-12 w-12 text-blue-400" />
              <h3 className="mb-2 text-xl font-semibold text-gray-900">
                No services found
              </h3>
              <p className="text-gray-600">
                Try adjusting your search or filter criteria.
              </p>
            </div>
          )}
        </div>
      </main>

      {/* View Project Dialog - Simplified without use case/benefits/implementation/ROI */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-h-[90vh] max-w-4xl overflow-y-auto">
          {selectedProject && (
            <>
              <DialogHeader aria-describedby="project-description">
                <div className="flex items-center justify-between">
                  <DialogTitle className="text-2xl">
                    {selectedProject.title}
                  </DialogTitle>
                  <Badge variant="secondary" className="bg-blue-600 text-white">
                    #{selectedProject.serialNo}
                  </Badge>
                </div>
              </DialogHeader>

              <Tabs defaultValue="overview" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="links">Resources</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-4">
                  <div className="relative">
                    <img
                      src={getProjectImage(selectedProject)}
                      alt={selectedProject.title}
                      className="h-64 w-full rounded-lg object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src =
                          "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=400&fit=crop";
                      }}
                    />
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h3 className="mb-2 font-semibold text-gray-900">
                        Description
                      </h3>
                      <FormattedDescription
                        description={selectedProject.description}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h4 className="mb-2 font-medium">Category</h4>
                        <Badge
                          variant="outline"
                          className="border-blue-400 text-blue-600"
                        >
                          {selectedProject.category}
                        </Badge>
                      </div>
                      <div>
                        <h4 className="mb-2 font-medium">Industries</h4>
                        <div className="flex flex-wrap gap-1">
                          {Array.isArray(selectedProject.industry) ? (
                            selectedProject.industry.map((ind, idx) => (
                              <Badge
                                key={idx}
                                variant="outline"
                                className="border-green-400 text-green-600"
                              >
                                {ind}
                              </Badge>
                            ))
                          ) : (
                            <Badge
                              variant="outline"
                              className="border-green-400 text-green-600"
                            >
                              {selectedProject.industry}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="mb-2 font-medium">
                        Communication Channels
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedProject.applicableRoutes.map((route, idx) => (
                          <Badge
                            key={idx}
                            variant="secondary"
                            className="bg-blue-100 text-blue-800"
                          >
                            {route}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="links" className="space-y-4">
                  {selectedProject.links && selectedProject.links.length > 0 ? (
                    <div className="grid gap-4">
                      {selectedProject.links.map((link, idx) => (
                        <Card key={idx} className="border-blue-200 p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              {getLinkIcon(link.icon)}
                              <div>
                                <h4 className="font-medium">{link.name}</h4>
                                <p className="text-sm text-gray-600">
                                  {link.description}
                                </p>
                              </div>
                            </div>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => window.open(link.url, "_blank")}
                              className="border-blue-200 text-blue-600 hover:bg-blue-50"
                            >
                              <ExternalLink className="mr-2 h-4 w-4" />
                              Open
                            </Button>
                          </div>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="py-8 text-center">
                      <Globe className="mx-auto mb-4 h-12 w-12 text-gray-400" />
                      <p className="text-gray-500">
                        No resource links available for this project.
                      </p>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Project Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
          <DialogHeader aria-describedby="edit-project-form">
            <DialogTitle>Edit Project</DialogTitle>
          </DialogHeader>
          <form
            onSubmit={editForm.handleSubmit(handleSaveProject)}
            className="space-y-4"
          >
            <div>
              <Label htmlFor="edit-title">Title *</Label>
              <Input
                id="edit-title"
                {...editForm.register("title")}
                placeholder="Project title"
              />
              {editForm.formState.errors.title && (
                <p className="mt-1 text-sm text-red-500">
                  {editForm.formState.errors.title.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="edit-description">Description *</Label>
              <Textarea
                id="edit-description"
                {...editForm.register("description")}
                placeholder="Project description"
                rows={10}
              />
              {editForm.formState.errors.description && (
                <p className="mt-1 text-sm text-red-500">
                  {editForm.formState.errors.description.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="edit-category">Category *</Label>
              <Select
                onValueChange={(value) => editForm.setValue("category", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {editForm.formState.errors.category && (
                <p className="mt-1 text-sm text-red-500">
                  {editForm.formState.errors.category.message}
                </p>
              )}
            </div>

            <div>
              <Label>Industries * (Select multiple)</Label>
              <div className="mt-2 grid max-h-40 grid-cols-3 gap-2 overflow-y-auto rounded border p-2">
                {industries.map((industry) => (
                  <label key={industry} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      value={industry}
                      defaultChecked={selectedProject?.industry.includes(
                        industry,
                      )}
                      onChange={(e) => {
                        const currentIndustries =
                          editForm.getValues("industry");
                        if (e.target.checked) {
                          editForm.setValue("industry", [
                            ...currentIndustries,
                            industry,
                          ]);
                        } else {
                          editForm.setValue(
                            "industry",
                            currentIndustries.filter((ind) => ind !== industry),
                          );
                        }
                      }}
                      className="rounded"
                    />
                    <span className="text-sm">{industry}</span>
                  </label>
                ))}
              </div>
              {editForm.formState.errors.industry && (
                <p className="mt-1 text-sm text-red-500">
                  {editForm.formState.errors.industry.message}
                </p>
              )}
            </div>

            <div>
              <Label>Communication Channels *</Label>
              <div className="mt-2 grid grid-cols-2 gap-2">
                {routes.map((route) => (
                  <label key={route} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      value={route}
                      defaultChecked={selectedProject?.applicableRoutes.includes(
                        route,
                      )}
                      onChange={(e) => {
                        const currentRoutes =
                          editForm.getValues("applicableRoutes");
                        if (e.target.checked) {
                          editForm.setValue("applicableRoutes", [
                            ...currentRoutes,
                            route,
                          ]);
                        } else {
                          editForm.setValue(
                            "applicableRoutes",
                            currentRoutes.filter((r) => r !== route),
                          );
                        }
                      }}
                      className="rounded"
                    />
                    <span className="text-sm">{route}</span>
                  </label>
                ))}
              </div>
              {editForm.formState.errors.applicableRoutes && (
                <p className="mt-1 text-sm text-red-500">
                  {editForm.formState.errors.applicableRoutes.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="edit-cardImage">Card Image URL</Label>
              <Input
                id="edit-cardImage"
                {...editForm.register("cardImage")}
                placeholder="https://..."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-telerivetUrl">Telerivet URL</Label>
                <Input
                  id="edit-telerivetUrl"
                  {...editForm.register("telerivetUrl")}
                  placeholder="https://..."
                />
              </div>
              <div>
                <Label htmlFor="edit-canvaUrl">Canva URL</Label>
                <Input
                  id="edit-canvaUrl"
                  {...editForm.register("canvaUrl")}
                  placeholder="https://..."
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-hubspotUrl">HubSpot URL</Label>
                <Input
                  id="edit-hubspotUrl"
                  {...editForm.register("hubspotUrl")}
                  placeholder="https://..."
                />
              </div>
              <div>
                <Label htmlFor="edit-liveUrl">Live URL</Label>
                <Input
                  id="edit-liveUrl"
                  {...editForm.register("liveUrl")}
                  placeholder="https://..."
                />
              </div>
            </div>

            <div>
              <Label htmlFor="edit-videoUrl">Video URL</Label>
              <Input
                id="edit-videoUrl"
                {...editForm.register("videoUrl")}
                placeholder="https://..."
              />
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsEditDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isUpdating}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {isUpdating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  "Update Project"
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Add Project Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
          <DialogHeader aria-describedby="add-project-form">
            <DialogTitle>Add New Service</DialogTitle>
          </DialogHeader>
          <form
            onSubmit={addForm.handleSubmit(handleAddProject)}
            className="space-y-4"
          >
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="add-title">Title *</Label>
                <Input
                  id="add-title"
                  {...addForm.register("title")}
                  placeholder="Service title"
                />
                {addForm.formState.errors.title && (
                  <p className="mt-1 text-sm text-red-500">
                    {addForm.formState.errors.title.message}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="add-serialNo">Serial Number</Label>
                <Input
                  id="add-serialNo"
                  {...addForm.register("serialNo")}
                  placeholder="Auto-generated if empty"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="add-description">Description *</Label>
              <Textarea
                id="add-description"
                {...addForm.register("description")}
                placeholder="Service description"
                rows={10}
              />
              {addForm.formState.errors.description && (
                <p className="mt-1 text-sm text-red-500">
                  {addForm.formState.errors.description.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="add-category">Category *</Label>
              <Select
                onValueChange={(value) => addForm.setValue("category", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {addForm.formState.errors.category && (
                <p className="mt-1 text-sm text-red-500">
                  {addForm.formState.errors.category.message}
                </p>
              )}
            </div>

            <div>
              <Label>Industries * (Select multiple)</Label>
              <div className="mt-2 grid max-h-40 grid-cols-3 gap-2 overflow-y-auto rounded border p-2">
                {industries.map((industry) => (
                  <label key={industry} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      value={industry}
                      onChange={(e) => {
                        const currentIndustries = addForm.getValues("industry");
                        if (e.target.checked) {
                          addForm.setValue("industry", [
                            ...currentIndustries,
                            industry,
                          ]);
                        } else {
                          addForm.setValue(
                            "industry",
                            currentIndustries.filter((ind) => ind !== industry),
                          );
                        }
                      }}
                      className="rounded"
                    />
                    <span className="text-sm">{industry}</span>
                  </label>
                ))}
              </div>
              {addForm.formState.errors.industry && (
                <p className="mt-1 text-sm text-red-500">
                  {addForm.formState.errors.industry.message}
                </p>
              )}
            </div>

            <div>
              <Label>Communication Channels *</Label>
              <div className="mt-2 grid grid-cols-2 gap-2">
                {routes.map((route) => (
                  <label key={route} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      value={route}
                      onChange={(e) => {
                        const currentRoutes =
                          addForm.getValues("applicableRoutes");
                        if (e.target.checked) {
                          addForm.setValue("applicableRoutes", [
                            ...currentRoutes,
                            route,
                          ]);
                        } else {
                          addForm.setValue(
                            "applicableRoutes",
                            currentRoutes.filter((r) => r !== route),
                          );
                        }
                      }}
                      className="rounded"
                    />
                    <span className="text-sm">{route}</span>
                  </label>
                ))}
              </div>
              {addForm.formState.errors.applicableRoutes && (
                <p className="mt-1 text-sm text-red-500">
                  {addForm.formState.errors.applicableRoutes.message}
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="add-telerivetUrl">Telerivet URL</Label>
                <Input
                  id="add-telerivetUrl"
                  {...addForm.register("telerivetUrl")}
                  placeholder="https://..."
                />
              </div>
              <div>
                <Label htmlFor="add-canvaUrl">Canva URL</Label>
                <Input
                  id="add-canvaUrl"
                  {...addForm.register("canvaUrl")}
                  placeholder="https://..."
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="add-hubspotUrl">HubSpot URL</Label>
                <Input
                  id="add-hubspotUrl"
                  {...addForm.register("hubspotUrl")}
                  placeholder="https://..."
                />
              </div>
              <div>
                <Label htmlFor="add-liveUrl">Live URL</Label>
                <Input
                  id="add-liveUrl"
                  {...addForm.register("liveUrl")}
                  placeholder="https://..."
                />
              </div>
            </div>

            <div>
              <Label htmlFor="add-videoUrl">Video URL</Label>
              <Input
                id="add-videoUrl"
                {...addForm.register("videoUrl")}
                placeholder="https://..."
              />
            </div>

            <div>
              <Label htmlFor="add-cardImage">Card Image URL</Label>
              <Input
                id="add-cardImage"
                {...addForm.register("cardImage")}
                placeholder="https://..."
              />
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsAddDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isAdding}
                className="bg-green-600 hover:bg-green-700"
              >
                {isAdding ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create Service"
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
