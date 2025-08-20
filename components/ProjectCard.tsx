"use client";

import { useState } from "react";
import {
  ExternalLink,
  Users,
  MessageSquare,
  Calendar,
  Settings,
  Zap,
  Globe,
} from "lucide-react";

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

interface ProjectCardProps {
  project: Project;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "inactive":
        return "bg-gray-100 text-gray-800";
      case "paused":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div
      className="group overflow-hidden rounded-2xl border border-white/20 bg-white/20 shadow-md backdrop-blur-md transition-all duration-300 hover:shadow-xl"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Header */}
      <div className="relative p-6 text-white">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="mb-2 flex items-center space-x-2">
              <MessageSquare className="h-5 w-5 text-white/90" />
              <span className="text-sm font-medium opacity-90">
                {project.organizationName}
              </span>
            </div>
            <h3 className="mb-2 text-xl font-semibold">
              {project.projectName}
            </h3>
          </div>
          <div>
            <span
              className={`rounded-full px-2 py-1 text-xs font-medium ${getStatusColor(
                project.status,
              )}`}
            >
              {project.status}
            </span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Description */}
        <p className="mb-4 text-sm leading-relaxed text-gray-200">
          {project.projectDescription}
        </p>

        {/* Key Features */}
        <div className="mb-6">
          <h4 className="mb-3 text-sm font-medium text-white/90">
            Key Features:
          </h4>
          {project.keyFeatures.length > 0 ? (
            <div className="grid grid-cols-2 gap-2">
              {project.keyFeatures.map((feature, index) => (
                <div
                  key={index}
                  className="flex items-center text-xs text-gray-200"
                >
                  <span className="mr-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-blue-400"></span>
                  {feature}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-gray-400">No features listed</p>
          )}
        </div>

        {/* Additional Info */}
        <div className="mb-6 grid grid-cols-2 gap-4 text-xs text-gray-200">
          <div className="flex items-center space-x-2">
            <Settings className="h-4 w-4 text-purple-400" />
            <span>Routes: {project.routesAvailable || "N/A"}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Zap className="h-4 w-4 text-orange-400" />
            <span>Services: {project.servicesAvailable || "N/A"}</span>
          </div>
        </div>

        {/* Actions */}
        {project.projectUrl && (
          <a
            href={project.projectUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex w-full items-center justify-center space-x-2 rounded-lg bg-blue-500/20 px-3 py-2 text-sm text-blue-200 transition-colors duration-200 hover:bg-blue-500/30"
          >
            <ExternalLink className="h-4 w-4" />
            <span>View Project</span>
          </a>
        )}
      </div>
    </div>
  );
}
