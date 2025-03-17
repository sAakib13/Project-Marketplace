import { NextResponse } from "next/server";
import axios from "axios";

export const dynamic = "force-dynamic"; // Required for cron jobs

const API_KEY = process.env.TELERIVET_API_KEY;
const PROJECT_ID = process.env.TELERIVET_PROJECT_ID;
const TABLE_ID = process.env.TELERIVET_TABLE_ID;

export async function GET() {
  try {
    const response = await axios.get(
      `https://api.telerivet.com/v1/projects/${PROJECT_ID}/tables/${TABLE_ID}/rows`,
      { auth: { username: API_KEY || "", password: "" } }
    );

    const projects = response.data.data.map((row: any) => ({
      title: row.vars.title || "Untitled Project",
      // ... rest of your existing transformation logic
    }));

    return NextResponse.json({
      success: true,
      updatedAt: new Date().toISOString(),
      projectCount: projects.length,
    });
  } catch (error) {
    console.error("Cron job error:", error);
    return NextResponse.json(
      { error: "Cron execution failed" },
      { status: 500 }
    );
  }
}
