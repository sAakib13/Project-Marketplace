"use client";

import { useState } from "react";
import {
  ExternalLink,
  Settings,
  Zap,
  Globe,
  Route,
  Server,
} from "lucide-react";
import { clsx } from "clsx";

interface Project {
  projectId: string;
  projectName: string;
  projectDescription: string;
  keyFeatures: string[];
  organizationName: string;
  routesAvailable: string; // e.g. "SMS, Voice"
  servicesAvailable: string; // e.g. "1. Auto-reply"
  projectUrl: string;
  status: boolean;
}

interface ProjectCardProps {
  project: Project;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const getStatusColor = (status: boolean) => {
    return status
      ? "bg-green-500/10 text-green-700 border-green-200 dark:text-green-400 dark:border-green-500/30"
      : "bg-gray-100 text-gray-600 border-gray-200 dark:bg-white/5 dark:text-gray-400 dark:border-white/10";
  };

  // Helper to parse your string data into clean arrays
  const parseItems = (text: string, type: "routes" | "services") => {
    if (!text) return [];

    // Split logic based on your data structure
    const separator = type === "services" ? /\d+\.\s+/ : ",";

    return text
      .split(separator)
      .map((item) => item.trim())
      .filter((item) => item.length > 0);
  };

  const routes = parseItems(project.routesAvailable, "routes");
  const services = parseItems(project.servicesAvailable, "services");

  return (
    <div
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-black/5 bg-white/60 p-0 shadow-lg backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl dark:border-white/10 dark:bg-slate-900/60"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* --- Header Section --- */}
      <div className="relative flex items-center justify-between border-b border-black/5 bg-white/40 px-6 py-4 dark:border-white/5 dark:bg-white/5">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500/10 text-blue-600 dark:bg-blue-400/10 dark:text-blue-400">
            <Globe className="h-4 w-4" />
          </div>
          <span className="text-sm font-semibold tracking-wide text-gray-700 dark:text-gray-200">
            {project.organizationName}
          </span>
        </div>
        <span
          className={clsx(
            "rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-wider",
            getStatusColor(project.status),
          )}
        >
          {project.status ? "Active" : "Inactive"}
        </span>
      </div>

      {/* --- Body Section --- */}
      <div className="flex flex-1 flex-col p-6">
        {/* Title & Description */}
        <div className="mb-6">
          <h3 className="mb-3 font-serif text-3xl text-gray-900 dark:text-white">
            {project.projectName}
          </h3>
          <p className="line-clamp-3 text-sm leading-relaxed text-gray-600 dark:text-gray-300">
            {project.projectDescription}
          </p>
        </div>

        {/* Key Features (Pills) */}
        {project.keyFeatures && project.keyFeatures.length > 0 && (
          <div className="mb-8">
            <h4 className="mb-3 text-xs font-bold uppercase tracking-wider text-gray-400">
              Highlights
            </h4>
            <div className="flex flex-wrap gap-2">
              {project.keyFeatures
                .flatMap((f) => f.split(/\d+\.\s+/).filter(Boolean))
                .map((feature, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center rounded-md bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600 dark:bg-white/5 dark:text-gray-300"
                  >
                    {feature.trim()}
                  </span>
                ))}
            </div>
          </div>
        )}

        {/* --- WOW Details Section (Two Columns) --- */}
        <div className="mt-auto grid grid-cols-1 gap-4 sm:grid-cols-1">
          {/* Column 1: Routes */}
          <div className="rounded-xl border border-indigo-100 bg-indigo-50/50 p-4 dark:border-indigo-500/20 dark:bg-indigo-900/20">
            <div className="mb-3 flex items-center gap-2 text-indigo-700 dark:text-indigo-300">
              <Route className="h-4 w-4" />
              <span className="text-xs font-bold uppercase tracking-wide">
                Routes
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {routes.length > 0 ? (
                routes.map((route, i) => (
                  <span
                    key={i}
                    className="rounded-md bg-white px-2 py-1 text-xs font-semibold text-indigo-600 shadow-sm dark:bg-indigo-500/20 dark:text-indigo-200"
                  >
                    {route}
                  </span>
                ))
              ) : (
                <span className="text-xs italic text-indigo-400/70">
                  No routes configured
                </span>
              )}
            </div>
          </div>

          {/* Column 2: Services */}
          <div className="rounded-xl border border-amber-100 bg-amber-50/50 p-4 dark:border-amber-500/20 dark:bg-amber-900/20">
            <div className="mb-3 flex items-center gap-2 text-amber-700 dark:text-amber-300">
              <Server className="h-4 w-4" />
              <span className="text-xs font-bold uppercase tracking-wide">
                Services
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {services.length > 0 ? (
                services.map((service, i) => (
                  <span
                    key={i}
                    className="rounded-md bg-white px-2 py-1 text-xs font-semibold text-amber-700 shadow-sm dark:bg-amber-500/20 dark:text-amber-200"
                  >
                    {service}
                  </span>
                ))
              ) : (
                <span className="text-xs italic text-amber-400/70">
                  No services active
                </span>
              )}
            </div>
          </div>
        </div>

        {/* --- Action Footer --- */}
        {project.projectUrl && (
          <div className="mt-6 border-t border-black/5 pt-6 dark:border-white/5">
            <a
              href={project.projectUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group/btn flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 py-3 text-sm font-semibold text-white transition-all hover:bg-blue-600 hover:shadow-lg hover:shadow-blue-500/20 dark:bg-white dark:text-slate-900 dark:hover:bg-blue-400"
            >
              <span>Launch Dashboard</span>
              <ExternalLink className="h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
