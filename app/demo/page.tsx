// demo/page.tsx

import Header from "../../components/Header";
import ProjectsClient from "../../components/ProjectsClient";
import FlowchartSection from "../../components/FlowchartSection"; // <--- Import this
import { Project } from "../../types";

async function getProjects(): Promise<Project[]> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  try {
    const response = await fetch(`${baseUrl}/api/projects`, {
      cache: "no-store",
    });

    if (!response.ok) return [];
    const data = await response.json();
    return Array.isArray(data) ? data : data.projects || [];
  } catch (error) {
    console.error("Error fetching projects:", error);
    return [];
  }
}

export default async function Home() {
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
          {/* Title Section */}
          <div className="mb-12 text-center">
            <h1 className="mb-6 text-5xl font-extrabold tracking-tight text-white drop-shadow-lg sm:text-7xl">
              Project{" "}
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Hub
              </span>
            </h1>
            <p className="mx-auto max-w-2xl text-lg text-slate-400">
              Real-time monitoring of your communication infrastructure.
            </p>
          </div>

          {/* --- NEW FLOWCHART SECTION --- */}
          {/* We wrap it in a subtle container to separate it from the list */}
          <div className="mb-16 rounded-3xl border border-white/5 bg-white/5 p-6 backdrop-blur-sm">
            <h2 className="mb-4 text-center text-sm font-bold uppercase tracking-widest text-slate-500">
              Solution Architecture
            </h2>
            <FlowchartSection />
          </div>

          {/* Main Projects List */}
          <ProjectsClient />
        </div>
      </div>
    </main>
  );
}
