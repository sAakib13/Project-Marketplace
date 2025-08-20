import { NextResponse } from "next/server";
import axios from "axios";

export const dynamic = "force-dynamic";
const API_KEY = process.env.TELERIVET_API_KEY;
const PROJECT_ID = process.env.TELERIVET_PROJECT_ID;
const DEMO_TELERIVET_TABLE_ID = process.env.DEMO_TELERIVET_TABLE_ID;

export async function GET() {
  try {
    const response = await axios.get(
      `https://api.telerivet.com/v1/projects/${PROJECT_ID}/tables/${DEMO_TELERIVET_TABLE_ID}/rows`,
      {
        auth: {
          username: API_KEY || "",
          password: "",
        },
      },
    );

    if (!response.data || !response.data.data) {
      return NextResponse.json({ error: "No data found" }, { status: 404 });
    }

    const projectData = response.data.data.map((row: any) => ({
      projectId: row.id,
      organizationName: row.vars.organization_name || "Unknown Organization",
      projectName: row.vars.project_name || "Untitled Project",
      projectDescription:
        row.vars.project_description || "No description available",
      status: row.vars.status || "unknown",
      keyFeatures: Array.isArray(row.vars.key_features)
        ? row.vars.key_features
        : row.vars.key_features
          ? [row.vars.key_features]
          : [],
      projectUrl: row.vars.project_url || "",
      routesAvailable: row.vars.routes_available || "",
      servicesAvailable: row.vars.services_available || "",
    }));

    return NextResponse.json(projectData);
  } catch (error) {
    if (axios.isAxiosError?.(error)) {
      console.error("Axios error:", error.response?.data || error.message);
    } else {
      console.error("Unexpected error:", error);
    }
    return NextResponse.json(
      { error: "Failed to fetch project details" },
      { status: 500 },
    );
  }
}
