import Header from "../../components/Header";
import ProjectsClient from "../../components/ProjectsClient";

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

async function getProjects() {
  try {
    // In production, this would be an external API call
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    const response = await fetch(`${baseUrl}/api/projects`, {
      cache: "no-store", // Ensure fresh data
    });

    if (!response.ok) {
      throw new Error("Failed to fetch projects");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching projects:", error);
    // Return fallback data
    return {
      projects: [],
    };
  }
}

export default async function Home() {
  const data = await getProjects();

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <Header />
      <ProjectsClient />
    </main>
  );
}
