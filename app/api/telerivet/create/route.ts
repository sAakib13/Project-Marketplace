import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

export const dynamic = "force-dynamic";

const API_KEY = process.env.TELERIVET_API_KEY;
const PROJECT_ID = process.env.TELERIVET_PROJECT_ID;
const TABLE_ID = process.env.TELERIVET_TABLE_ID;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      title,
      description,
      category,
      industry,
      telerivetUrl,
      canvaUrl,
      hubspotUrl,
      liveUrl,
      applicableRoutes,
      cardImage,
      serialNo,
    } = body;

    console.log("Create request received:", body);

    if (!title || !description) {
      return NextResponse.json(
        { error: "Title and description are required" },
        { status: 400 },
      );
    }

    if (!API_KEY || !PROJECT_ID || !TABLE_ID) {
      return NextResponse.json(
        { error: "Missing API configuration" },
        { status: 500 },
      );
    }

    const telerivetApiUrl = `https://api.telerivet.com/v1/projects/${PROJECT_ID}/tables/${TABLE_ID}/rows`;

    console.log("Making create request to:", telerivetApiUrl);

    // Prepare the data for Telerivet API
    const telerivetData = {
      vars: {
        title: title,
        description: description,
        category: category || "Uncategorized",
        industry: industry || "General",
        s_n: serialNo || `SN${Date.now()}`, // Generate serial number if not provided
        telerivet_url: telerivetUrl || "",
        canva_url: canvaUrl || "",
        hubspot_url: hubspotUrl || "",
        live_url: liveUrl || "",
        applicable_route: Array.isArray(applicableRoutes)
          ? applicableRoutes.join(",")
          : applicableRoutes || "",
        card_image: cardImage || "",
      },
    };

    console.log("Sending data to Telerivet:", telerivetData);

    const response = await axios.post(telerivetApiUrl, telerivetData, {
      auth: {
        username: API_KEY,
        password: "",
      },
      headers: {
        "Content-Type": "application/json",
        "User-Agent": "Next.js Server",
      },
    });

    console.log("Telerivet create response:", response.data);

    return NextResponse.json({
      success: true,
      data: response.data,
      message: "Project created successfully",
    });
  } catch (error: any) {
    console.error("Error creating project:", error);

    if (error.response) {
      console.error("Telerivet API error:", error.response.data);
      return NextResponse.json(
        {
          error: "Failed to create project",
          details: error.response.data,
        },
        { status: error.response.status },
      );
    }

    return NextResponse.json(
      { error: "Failed to create project" },
      { status: 500 },
    );
  }
}
