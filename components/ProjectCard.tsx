"use client";

import { useState } from "react";
import {
  ExternalLink,
  Users,
  MessageSquare,
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
      className="group overflow-hidden rounded-xl border font-serif tracking-wide text-4xl border-black/10 bg-white/40 p-6 shadow-md backdrop-blur-md transition-all duration-300 hover:scale-105 hover:shadow-xl dark:border-white/10 dark:bg-white/10"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Header */}
      <div className="relative flex items-center justify-between border-b border-black/10 px-6 py-4 dark:border-white/10">
        <div className="flex items-center space-x-2">
          <Globe className="h-5 w-5 text-white dark:text-white" />
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
      <div className="space-y-6 p-6">
        {/* Project Name */}
        <h3 className="text-2xl font-semibold tracking-tight text-gray-900 dark:text-white">
          {project.projectName}
        </h3>

        {/* Description */}
        <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-300">
          {project.projectDescription}
        </p>

        {/* Key Features */}
        <div>
          <h4 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-900 dark:text-gray-100">
            Key Features
          </h4>

          {project.keyFeatures && project.keyFeatures.length > 0 ? (
            <ol className="list-inside list-decimal space-y-2 text-xs text-gray-600 dark:text-gray-300">
              {project.keyFeatures
                // Since keyFeatures is an array of one string, take the first element
                .flatMap((featureStr) =>
                  // Split by pattern: number + dot + optional space
                  featureStr.split(/\d+\.\s+/).filter(Boolean),
                )
                .map((feature, index) => (
                  <li key={index}>{feature.trim()}</li>
                ))}
            </ol>
          ) : (
            <p className="text-xs text-gray-400 dark:text-gray-500">
              No features listed
            </p>
          )}
        </div>

        {/* Additional Info */}
        <div>
          <h4 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-900 dark:text-gray-100">
            Details
          </h4>
          <div className="grid grid-cols-2 gap-4 text-xs text-gray-600 dark:text-gray-300">
            {/* Routes */}
            <div className="flex flex-col space-y-1">
              <div className="flex items-center space-x-2">
                <Settings className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                <span>Routes:</span>
              </div>
              {project.routesAvailable ? (
                <ul className="ml-6 list-inside list-decimal space-y-1">
                  {project.routesAvailable
                    .split(",") // split by comma
                    .map((route, index) => (
                      <li key={index}>{route.trim()}</li>
                    ))}
                </ul>
              ) : (
                <span className="ml-6">N/A</span>
              )}
            </div>

            {/* Services */}
            <div className="flex flex-col space-y-1">
              <div className="flex items-center space-x-2">
                <Zap className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                <span>Services:</span>
              </div>
              {project.servicesAvailable ? (
                <ol className="ml-6 list-inside list-decimal space-y-1">
                  {project.servicesAvailable
                    .split(/\d+\.\s+/) // split by numbered pattern
                    .filter(Boolean)
                    .map((service, index) => (
                      <li key={index}>{service.trim()}</li>
                    ))}
                </ol>
              ) : (
                <span className="ml-6">N/A</span>
              )}
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
