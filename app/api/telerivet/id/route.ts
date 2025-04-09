import { NextResponse } from "next/server";
import axios from "axios";

const API_KEY = process.env.TELERIVET_API_KEY;
const PROJECT_ID = process.env.TELERIVET_PROJECT_ID;
const TABLE_ID = process.env.TELERIVET_TABLE_ID_ARTICLE;

export async function GET() {
  try {
    const response = await axios.get(
      `https://api.telerivet.com/v1/projects/${PROJECT_ID}/tables/${TABLE_ID}/rows?vars[s_n]=5`,
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
      usecase: row.vars.usecase || "No use case provided",
      benefits: row.vars.benefits?.split(",") || [],
      implementation: row.vars.implementation?.split(",") || [],
      overview: row.vars.overview || "No overview available",
      roiMetrics: row.vars.roi_metrics?.split(",") || [],
    }));

    console.log(projectsArticle);
    //  Find the specific project by serial number
    // const project = projects.find((p) => p.serialNo === params.id);

    // if (!project) {
    //   return NextResponse.json({ error: "Project not found" }, { status: 404 });
    // }

    return NextResponse.json(projectsArticle);
  } catch (error) {
    console.error("Error fetching data from Telerivet:", error);
    return NextResponse.json(
      { error: "Failed to fetch project details" },
      { status: 500 },
    );
  }
}
