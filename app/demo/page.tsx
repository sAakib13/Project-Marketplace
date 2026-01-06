import Header from "../../components/Header";
import ProjectsClient from "../../components/ProjectsClient";
import { Project } from "../../types";

async function getProjects(): Promise<Project[]> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  try {
    // 1. REAL API CALL RESTORED
    // cache: 'no-store' ensures we get fresh data every time the page loads
    const response = await fetch(`${baseUrl}/api/projects`, {
      cache: "no-store",
    });

    if (!response.ok) {
      console.error(`API Error: ${response.status} ${response.statusText}`);
      // Return empty array instead of crashing, but log the error
      return [];
    }

    const data = await response.json();

    // Handle cases where API returns { projects: [...] } vs just [...]
    return Array.isArray(data) ? data : data.projects || [];
  } catch (error) {
    console.error("Error fetching projects:", error);
    return [];
  }
}

export default async function Home() {
  // Fetch data on the server for instant load
  const projects = await getProjects();

  return (
    <main className="relative min-h-screen bg-slate-950 text-slate-200">
      {/* Background Ambience */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute left-[-10%] top-[-10%] h-[600px] w-[600px] rounded-full bg-blue-600/20 mix-blend-screen blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] h-[500px] w-[500px] rounded-full bg-purple-600/20 mix-blend-screen blur-[120px]" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150" />
      </div>

      <div className="relative z-10">
        <Header />
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          {/* Pass server data to client */}
          <ProjectsClient />
        </div>
      </div>
    </main>
  );
}
