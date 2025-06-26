import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

export const dynamic = "force-dynamic";

const API_KEY = process.env.TELERIVET_API_KEY;
const PROJECT_ID = process.env.TELERIVET_PROJECT_ID;
const TABLE_ID = process.env.TELERIVET_TABLE_ID;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { rowId, vars } = body;

    console.log("Update request received:", { rowId, vars });

    if (!rowId) {
      return NextResponse.json(
        { error: "Row ID is required" },
        { status: 400 },
      );
    }

    if (!API_KEY || !PROJECT_ID || !TABLE_ID) {
      return NextResponse.json(
        { error: "Missing API configuration" },
        { status: 500 },
      );
    }

    const telerivetUrl = `https://api.telerivet.com/v1/projects/${PROJECT_ID}/tables/${TABLE_ID}/rows/${rowId}`;

    console.log("Making request to:", telerivetUrl);

    const response = await axios.post(
      // Changed to POST
      telerivetUrl,
      { vars },
      {
        auth: {
          username: API_KEY,
          password: "",
        },
        headers: {
          "Content-Type": "application/json",
          "User-Agent": "Next.js Server", // Recommended header
        },
      },
    );

    console.log("Telerivet response:", response.data);

    return NextResponse.json({
      success: true,
      data: response.data,
    });
  } catch (error: any) {
    console.error("Error updating project:", error);

    if (error.response) {
      console.error("Telerivet API error:", error.response.data);
      return NextResponse.json(
        {
          error: "Failed to update project",
          details: error.response.data,
        },
        { status: error.response.status },
      );
    }

    return NextResponse.json(
      { error: "Failed to update project" },
      { status: 500 },
    );
  }
}
