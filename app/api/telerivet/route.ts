import { NextResponse } from "next/server";
import axios from "axios";

const API_KEY = process.env.TELERIVET_API_KEY;
const PROJECT_ID = process.env.TELERIVET_PROJECT_ID;
const TABLE_ID = process.env.TELERIVET_TABLE_ID;

export async function GET() {
  try {
    const response = await axios.get(
      `https://api.telerivet.com/v1/projects/${PROJECT_ID}/tables/${TABLE_ID}/rows`,
      {
        auth: {
          username: API_KEY || "",
          password: "",
        },
      },
    );

    // Transform the data to match our project structure
    const projects = response.data.data.map((row: any) => ({
      title: row.vars.title || "Untitled Project",
      description: row.vars.description || "No description available",
      serialNo: row.vars.s_n || "000",
      category: row.vars.category || "Uncategorized",
      timeUpdated: row.time_updated,
      rowId: row.id, // Add the actual row ID from Telerivet
      cardImage: row.vars.card_image || null, // Add dynamic card image
      applicableRoutes: row.vars.applicable_route
        ? row.vars.applicable_route
            .split(",")
            .map((route: string) => route.trim())
        : [],
      industry: row.vars.industry
        ? row.vars.industry.split(",").map((ind: string) => ind.trim())
        : ["Uncategorized"],
      links: [
        // Only include Telerivet link if URL exists
        ...(row.vars.telerivet_url
          ? [
              {
                name: "Telerivet Project",
                url: row.vars.telerivet_url,
                description:
                  row.vars.telerivet_description ||
                  "Campaign automation and tracking",
                icon: "📱",
              },
            ]
          : []),
        // Only include Canva link if URL exists
        ...(row.vars.canva_url
          ? [
              {
                name: "Canva Decks",
                url: row.vars.canva_url,
                description:
                  row.vars.canva_description || "Brand-aligned visual assets",
                icon: "🎨",
              },
            ]
          : []),
        // Only include HubSpot link if URL exists
        ...(row.vars.hubspot_url
          ? [
              {
                name: "HubSpot Article",
                url: row.vars.hubspot_url,
                description:
                  row.vars.hubspot_description ||
                  "Performance metrics and leads",
                icon: "📊",
              },
            ]
          : []),
        // Only include Live link if URL exists
        ...(row.vars.live_url
          ? [
              {
                name: "Live Project",
                url: row.vars.live_url || "www.google.com",
                description:
                  row.vars.live_description || "View the live project",
                icon: "🌐",
              },
            ]
          : []),
      ].filter(Boolean), // Remove any undefined entries
    }));

    return NextResponse.json(projects);
  } catch (error) {
    console.error("Error fetching data from Telerivet:", error);
    return NextResponse.json(
      { error: "Failed to fetch projects" },
      { status: 500 },
    );
  }
}
