import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

export const dynamic = "force-dynamic";
const API_KEY = process.env.TELERIVET_API_KEY;
const PROJECT_ID = process.env.TELERIVET_PROJECT_ID;
const DEMO_TELERIVET_TABLE_ID = process.env.DEMO_TELERIVET_TABLE_ID;

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { organizationName } = body;

  if (!organizationName) {
    return NextResponse.json(
      { error: "Organization name is required" },
      { status: 400 },
    );
  }

  try {
    const response = await axios.get(
      `https://api.telerivet.com/v1/projects/${PROJECT_ID}/tables/${DEMO_TELERIVET_TABLE_ID}/rows,
      )}`,
      {
        auth: {
          username: API_KEY || "",
          password: "",
        },
      },
    );

    const projectData = response.data.data.map((row: any) => ({
      organizationName: row.vars.organization_name || "Unknown Organization",
      projectName: row.vars.project_name || "Untitled Project",
      projectDescription:
        row.vars.project_description || "No description available",
      status: typeof row.vars.status === "boolean" ? row.vars.status : false,
      keyFeatures: row.vars.key_features || "No key features listed",
      projectUrl: row.vars.project_url || "",
      routesAvailable: row.vars.routes_available || "Not specified",
      servicesAvailable:
        row.vars.services_available || "No services information",
    }));

    return NextResponse.json(projectData);
  } catch (error) {
    console.error("Error fetching data from Telerivet:", error);
    return NextResponse.json(
      { error: "Failed to fetch project details" },
      { status: 500 },
    );
  }
}
