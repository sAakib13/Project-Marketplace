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

    // Find the maximum serial number
    const serialNumbers = response.data.data
      .map((row: any) => row.vars.s_n)
      .filter((sn: string) => sn && !isNaN(parseInt(sn)))
      .map((sn: string) => parseInt(sn))
      .sort((a: number, b: number) => b - a);

    const maxSerialNo = serialNumbers.length > 0 ? serialNumbers[0] : 0;

    return NextResponse.json({ maxSerialNo: maxSerialNo.toString() });
  } catch (error) {
    console.error("Error fetching max serial number:", error);
    return NextResponse.json(
      { error: "Failed to fetch max serial number" },
      { status: 500 },
    );
  }
}
