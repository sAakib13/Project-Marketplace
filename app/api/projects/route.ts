import { NextResponse } from "next/server";

const mockProjects = {
  projects: [
    {
      projectId: "proj_12345",
      projectName: "Health Awareness Campaign",
      useCase: "Sending health tips and reminders to registered patients",
      description:
        "A project designed to deliver automated health advice and appointment reminders via SMS.",
      features: [
        "Two-way SMS messaging",
        "Scheduled messages",
        "Automated response rules",
        "Contact segmentation",
      ],
      organization: "Health Org",
      timezone: "America/New_York",
      metrics: {
        messagesSent: 12500,
        contactsManaged: 4500,
        activeGroups: 5,
      },
      status: "active",
      servicePlanLimit: {
        monthlyMessageCap: 20000,
        currentMonthUsage: 12500,
      },
      managementActions: {
        switchProjectUrl: "/projects/proj_12345",
        manageContactsUrl: "/projects/proj_12345/contacts",
        configureRoutesUrl: "/projects/proj_12345/routes",
        viewAnalyticsUrl: "/projects/proj_12345/analytics",
      },
    },
    {
      projectId: "proj_67890",
      projectName: "Customer Support Hotline",
      useCase: "Handling customer queries via voice and SMS channels",
      description:
        "A support system for managing incoming voice calls and SMS from customers using IVR and messaging features.",
      features: [
        "IVR voice menus",
        "SMS ticket creation",
        "Call forwarding",
        "Multi-agent support",
      ],
      organization: "Retail Co",
      timezone: "Europe/London",
      metrics: {
        messagesSent: 8700,
        contactsManaged: 3200,
        activeGroups: 3,
      },
      status: "active",
      servicePlanLimit: {
        monthlyMessageCap: 15000,
        currentMonthUsage: 8700,
      },
      managementActions: {
        switchProjectUrl: "/projects/proj_67890",
        manageContactsUrl: "/projects/proj_67890/contacts",
        configureRoutesUrl: "/projects/proj_67890/routes",
        viewAnalyticsUrl: "/projects/proj_67890/analytics",
      },
    },
  ],
};

export async function GET() {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 100));

  return NextResponse.json(mockProjects);
}
