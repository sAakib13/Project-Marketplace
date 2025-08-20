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
    className="group overflow-hidden rounded-2xl border border-black/10 bg-white/40 backdrop-blur-md shadow-md transition-all duration-300 hover:shadow-xl dark:border-white/10 dark:bg-white/10"
    onMouseEnter={() => setIsHovered(true)}
    onMouseLeave={() => setIsHovered(false)}
  >
    {/* Header */}
    <div className="relative flex items-center justify-between px-6 py-4 border-b border-black/10 dark:border-white/10">
      <div className="flex items-center space-x-2">
        <MessageSquare className="h-5 w-5 text-blue-600 dark:text-blue-300" />
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {project.organizationName}
        </span>
      </div>
      <span
        className={`rounded-full px-3 py-1 text-xs font-medium ${getStatusColor(
          project.status,
        )}`}
      >
        {project.status}
      </span>
    </div>

    {/* Body */}
    <div className="p-6 space-y-6">
      {/* Project Name */}
      <h3 className="text-2xl font-semibold text-gray-900 dark:text-white tracking-tight">
        {project.projectName}
      </h3>

      {/* Description */}
      <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-300">
        {project.projectDescription}
      </p>

      {/* Key Features */}
      <div>
        <h4 className="mb-3 text-sm font-semibold text-gray-900 dark:text-gray-100 uppercase tracking-wide">
          Key Features
        </h4>
        {project.keyFeatures.length > 0 ? (
          <div className="grid grid-cols-2 gap-2">
            {project.keyFeatures.map((feature, index) => (
              <div
                key={index}
                className="flex items-center text-xs text-gray-600 dark:text-gray-300"
              >
                <span className="mr-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-blue-500 dark:bg-blue-400" />
                {feature}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-gray-400 dark:text-gray-500">
            No features listed
          </p>
        )}
      </div>

      {/* Additional Info */}
      <div>
        <h4 className="mb-3 text-sm font-semibold text-gray-900 dark:text-gray-100 uppercase tracking-wide">
          Details
        </h4>
        <div className="grid grid-cols-2 gap-4 text-xs text-gray-600 dark:text-gray-300">
          <div className="flex items-center space-x-2">
            <Settings className="h-4 w-4 text-purple-600 dark:text-purple-400" />
            <span>Routes: {project.routesAvailable || "N/A"}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Zap className="h-4 w-4 text-orange-600 dark:text-orange-400" />
            <span>Services: {project.servicesAvailable || "N/A"}</span>
          </div>
        </div>
      </div>

      {/* Actions */}
      {project.projectUrl && (
        <a
          href={project.projectUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex w-full items-center justify-center space-x-2 rounded-lg bg-blue-600/10 px-4 py-2 text-sm font-medium text-blue-700 transition-colors duration-200 hover:bg-blue-600/20 dark:bg-blue-500/20 dark:text-blue-200 dark:hover:bg-blue-500/30"
        >
          <ExternalLink className="h-4 w-4" />
          <span>View Project</span>
        </a>
      )}
    </div>
  </div>
);

}
