"use client";

import { useState } from "react";
import {
  ExternalLink,
  Settings,
  Users,
  MessageSquare,
  Calendar,
  Activity,
  BarChart3,
  Phone,
  Mail,
} from "lucide-react";

interface Project {
  projectId: string;
  projectName: string;
  useCase: string;
  description: string;
  features: string[];
  organization: string;
  timezone: string;
  metrics: {
    messagesSent: number;
    contactsManaged: number;
    activeGroups: number;
  };
  status: string;
  servicePlanLimit: {
    monthlyMessageCap: number;
    currentMonthUsage: number;
  };
  managementActions: {
    switchProjectUrl: string;
    manageContactsUrl: string;
    configureRoutesUrl: string;
    viewAnalyticsUrl: string;
  };
}

interface ProjectCardProps {
  project: Project;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const usagePercentage =
    (project.servicePlanLimit.currentMonthUsage /
      project.servicePlanLimit.monthlyMessageCap) *
    100;

  const getUsageColor = (percentage: number) => {
    if (percentage >= 90) return "text-red-600 bg-red-100";
    if (percentage >= 70) return "text-yellow-600 bg-yellow-100";
    return "text-green-600 bg-green-100";
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
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
      className="group overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-md transition-all duration-300 hover:shadow-xl"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Header */}
      <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="mb-2 flex items-center space-x-2">
              <MessageSquare className="h-5 w-5" />
              <span className="text-sm font-medium opacity-90">
                {project.organization}
              </span>
            </div>
            <h3 className="mb-2 text-xl font-semibold">
              {project.projectName}
            </h3>
            <p className="text-sm opacity-90">{project.useCase}</p>
          </div>
          <div className="flex items-center space-x-2">
            <span
              className={`rounded-full px-2 py-1 text-xs font-medium ${getStatusColor(project.status)}`}
            >
              {project.status}
            </span>
          </div>
        </div>

        {/* Usage Bar */}
        <div className="mt-4">
          <div className="mb-1 flex justify-between text-xs">
            <span>Monthly Usage</span>
            <span>
              {project.servicePlanLimit.currentMonthUsage.toLocaleString()} /{" "}
              {project.servicePlanLimit.monthlyMessageCap.toLocaleString()}
            </span>
          </div>
          <div className="h-2 w-full rounded-full bg-white/20">
            <div
              className="h-2 rounded-full bg-white transition-all duration-300"
              style={{ width: `${Math.min(usagePercentage, 100)}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Description */}
        <p className="mb-4 text-sm leading-relaxed text-gray-600">
          {project.description}
        </p>

        {/* Metrics */}
        <div className="mb-6 grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
              <Mail className="h-5 w-5 text-blue-600" />
            </div>
            <div className="text-lg font-semibold text-gray-900">
              {project.metrics.messagesSent.toLocaleString()}
            </div>
            <div className="text-xs text-gray-500">Messages Sent</div>
          </div>
          <div className="text-center">
            <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-green-100">
              <Users className="h-5 w-5 text-green-600" />
            </div>
            <div className="text-lg font-semibold text-gray-900">
              {project.metrics.contactsManaged.toLocaleString()}
            </div>
            <div className="text-xs text-gray-500">Contacts</div>
          </div>
          <div className="text-center">
            <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100">
              <Activity className="h-5 w-5 text-purple-600" />
            </div>
            <div className="text-lg font-semibold text-gray-900">
              {project.metrics.activeGroups}
            </div>
            <div className="text-xs text-gray-500">Active Groups</div>
          </div>
        </div>

        {/* Features */}
        <div className="mb-6">
          <h4 className="mb-3 text-sm font-medium text-gray-900">
            Key Features:
          </h4>
          <div className="grid grid-cols-2 gap-2">
            {project.features.map((feature, index) => (
              <div
                key={index}
                className="flex items-center text-xs text-gray-600"
              >
                <span className="mr-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-blue-600"></span>
                {feature}
              </div>
            ))}
          </div>
        </div>

        {/* Management Actions */}
        <div className="border-t border-gray-100 pt-4">
          <div className="grid grid-cols-2 gap-2">
            <a
              href={project.managementActions.viewAnalyticsUrl}
              className="flex items-center justify-center space-x-2 rounded-lg bg-blue-50 px-3 py-2 text-sm text-blue-600 transition-colors duration-200 hover:bg-blue-100"
            >
              <BarChart3 className="h-4 w-4" />
              <span>Analytics</span>
            </a>
            <a
              href={project.managementActions.manageContactsUrl}
              className="flex items-center justify-center space-x-2 rounded-lg bg-green-50 px-3 py-2 text-sm text-green-600 transition-colors duration-200 hover:bg-green-100"
            >
              <Users className="h-4 w-4" />
              <span>Contacts</span>
            </a>
            <a
              href={project.managementActions.configureRoutesUrl}
              className="flex items-center justify-center space-x-2 rounded-lg bg-purple-50 px-3 py-2 text-sm text-purple-600 transition-colors duration-200 hover:bg-purple-100"
            >
              <Settings className="h-4 w-4" />
              <span>Routes</span>
            </a>
            <a
              href={project.managementActions.switchProjectUrl}
              className="flex items-center justify-center space-x-2 rounded-lg bg-gray-50 px-3 py-2 text-sm text-gray-600 transition-colors duration-200 hover:bg-gray-100"
            >
              <ExternalLink className="h-4 w-4" />
              <span>Manage</span>
            </a>
          </div>
        </div>

        {/* Timezone Info */}
        <div className="mt-4 flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center space-x-1">
            <Calendar className="h-3 w-3" />
            <span>Timezone: {project.timezone}</span>
          </div>
          <div
            className={`rounded-full px-2 py-1 text-xs font-medium ${getUsageColor(usagePercentage)}`}
          >
            {usagePercentage.toFixed(1)}% used
          </div>
        </div>
      </div>
    </div>
  );
}
