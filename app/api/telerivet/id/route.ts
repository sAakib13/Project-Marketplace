import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

export const dynamic = "force-dynamic";
const API_KEY = process.env.TELERIVET_API_KEY;
const PROJECT_ID = process.env.TELERIVET_PROJECT_ID;
const TABLE_ID = process.env.TELERIVET_TABLE_ID;

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { serialNo } = body;

  if (!serialNo) {
    return NextResponse.json(
      { error: "Serial number is required" },
      { status: 400 },
    );
  }

  try {
    const response = await axios.get(
      `https://api.telerivet.com/v1/projects/${PROJECT_ID}/tables/${TABLE_ID}/rows?vars[s_n]=${serialNo}`,
      {
        auth: {
          username: API_KEY || "",
          password: "",
        },
      },
    );

    const projectsArticle = response.data.data.map((row: any) => ({
      title: row.vars.title || "Untitled Project",
      description: row.vars.description || "No description available",
      serialNo: row.vars.s_n || "000",
      implementation: row.vars.implementation?.split(",") || [],
      overview: row.vars.overview || "No overview available",
      card_image: row.vars.card_image || "no-image.png",
      industry: row.vars.industry || [],
      applicableRoutes: row.vars.applicable_route || [],
      // usecase: row.vars.usecase || "No use case provided",
      // benefits: row.vars.benefits?.split(",") || [],
      // roiMetrics: row.vars.roi_metrics?.split(",") || [],
    }));

    return NextResponse.json(projectsArticle);
  } catch (error) {
    console.error("Error fetching data from Telerivet:", error);
    return NextResponse.json(
      { error: "Failed to fetch project details" },
      { status: 500 },
    );
  }
}
