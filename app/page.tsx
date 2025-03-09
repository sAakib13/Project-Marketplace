'use client';

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Search, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

const projectsData = [
  {
    title: "Marketing Campaign Hub",
    description: "Centralized marketing campaign management and analytics platform for Q2 2024 initiatives.",
    industry: ["FMCG", "Health"],
    links: [
      {
        name: "Telerivet Campaign",
        url: "https://telerivet.com/dashboard",
        description: "SMS campaign automation and tracking",
        icon: "📱"
      },
      {
        name: "Canva Templates",
        url: "https://www.canva.com/",
        description: "Brand-aligned visual assets and templates",
        icon: "🎨"
      },
      {
        name: "HubSpot Analytics",
        url: "https://app.hubspot.com/",
        description: "Campaign performance metrics and leads",
        icon: "📊"
      }
    ]
  },
  {
    title: "Customer Success Portal",
    description: "Dedicated platform for managing customer onboarding, support, and success metrics.",
    industry: ["Health", "NGO"],
    links: [
      {
        name: "Telerivet Support",
        url: "https://telerivet.com/dashboard",
        description: "Customer communication channels",
        icon: "💬"
      },
      {
        name: "Success Playbooks",
        url: "https://www.canva.com/",
        description: "Visual guides and documentation",
        icon: "📚"
      },
      {
        name: "HubSpot CRM",
        url: "https://app.hubspot.com/",
        description: "Customer relationship tracking",
        icon: "🤝"
      }
    ]
  },
  {
    title: "Product Launch Workspace",
    description: "Collaborative space for coordinating new product launches and feature releases.",
    industry: ["FMCG"],
    links: [
      {
        name: "Launch Announcements",
        url: "https://telerivet.com/dashboard",
        description: "Product launch communication",
        icon: "🚀"
      },
      {
        name: "Marketing Materials",
        url: "https://www.canva.com/",
        description: "Launch graphics and presentations",
        icon: "✨"
      },
      {
        name: "Lead Tracking",
        url: "https://app.hubspot.com/",
        description: "Launch campaign performance",
        icon: "📈"
      }
    ]
  },
  {
    title: "Sales Enablement Hub",
    description: "Resources and tools for empowering the sales team with latest materials and insights.",
    industry: ["FMCG", "Health"],
    links: [
      {
        name: "Sales Scripts",
        url: "https://telerivet.com/dashboard",
        description: "Automated sales messaging",
        icon: "📝"
      },
      {
        name: "Pitch Decks",
        url: "https://www.canva.com/",
        description: "Sales presentation templates",
        icon: "🎯"
      },
      {
        name: "Deal Pipeline",
        url: "https://app.hubspot.com/",
        description: "Sales pipeline management",
        icon: "💼"
      }
    ]
  },
  {
    title: "Event Management Center",
    description: "Comprehensive platform for planning and executing virtual and in-person events.",
    industry: ["NGO"],
    links: [
      {
        name: "Event Communications",
        url: "https://telerivet.com/dashboard",
        description: "Attendee messaging system",
        icon: "📅"
      },
      {
        name: "Event Branding",
        url: "https://www.canva.com/",
        description: "Event materials and badges",
        icon: "🎪"
      },
      {
        name: "Registration Data",
        url: "https://app.hubspot.com/",
        description: "Attendee tracking and follow-up",
        icon: "📋"
      }
    ]
  }
];

const industries = ["FMCG", "Health", "NGO"];

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIndustries, setSelectedIndustries] = useState<string[]>([]);

  const toggleIndustry = (industry: string) => {
    setSelectedIndustries(prev =>
      prev.includes(industry)
        ? prev.filter(i => i !== industry)
        : [...prev, industry]
    );
  };

  const filteredProjects = projectsData.filter(project => {
    const matchesSearch = 
      project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.links.some(link => 
        link.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        link.description.toLowerCase().includes(searchQuery.toLowerCase())
      ) ||
      project.industry.some(ind => 
        ind.toLowerCase().includes(searchQuery.toLowerCase())
      );

    const matchesIndustry = 
      selectedIndustries.length === 0 ||
      project.industry.some(ind => selectedIndustries.includes(ind));

    return matchesSearch && matchesIndustry;
  });

  return (
    <main className="min-h-screen bg-gradient-to-b from-background via-secondary/30 to-background pb-12">
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Search Section */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="relative mb-4">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-blue-400" />
            </div>
            <Input
              type="search"
              placeholder="Search projects, tools, or descriptions..."
              className="pl-10 h-12 text-lg bg-background/50 backdrop-blur-sm border-blue-500/20 focus-visible:ring-blue-500/50"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          {/* Industry Filter */}
          <div className="flex flex-wrap gap-2 justify-center">
            {industries.map((industry) => (
              <Badge
                key={industry}
                variant={selectedIndustries.includes(industry) ? "default" : "outline"}
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
          </div>
        </div>

        {/* Project Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filteredProjects.map((project, projectIndex) => (
            <Card 
              key={projectIndex} 
              className="bg-card/50 backdrop-blur-sm border-2 border-blue-500/20 hover:border-blue-500/40 transition-all duration-200 hover:translate-y-[-4px] hover:shadow-xl hover:shadow-blue-500/10"
            >
              <CardHeader>
                <div className="flex flex-wrap gap-2 mb-3">
                  {project.industry.map((ind) => (
                    <Badge key={ind} variant="secondary" className="bg-blue-500/10 text-blue-400 border-blue-500/30">
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
                      >
                        <span className="text-2xl">{link.icon}</span>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h3 className="text-base font-semibold text-blue-400">{link.name}</h3>
                            <ExternalLink className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity text-blue-400" />
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">{link.description}</p>
                        </div>
                      </Link>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* No Results Message */}
        {filteredProjects.length === 0 && (
          <div className="text-center mt-12">
            <p className="text-xl text-muted-foreground">No projects found matching your search.</p>
          </div>
        )}
      </div>
    </main>
  );
}