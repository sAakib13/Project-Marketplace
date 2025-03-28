import { NextResponse } from "next/server";

// Mock detailed data - replace with actual API call
const getProjectDetails = (id: string) => ({
  title: "Loyalty Project",
  description: "Comprehensive SMS platform for enterprise communication",
  salesPitch: {
    overview:
      "Our Enterprise SMS Solution revolutionizes how businesses communicate with their customers, offering unparalleled scalability and reliability.",
    benefits: [
      "Reach millions of customers instantly",
      "99.9% delivery rate guarantee",
      "Real-time analytics and reporting",
      "Advanced segmentation capabilities",
      "Automated workflow integration",
    ],
    useCase:
      "Perfect for large-scale customer engagement, appointment reminders, and promotional campaigns. Our solution has helped companies achieve up to 40% increase in customer engagement.",
    implementation: [
      "Quick 48-hour setup process",
      "Dedicated support team",
      "Custom integration options",
      "Comprehensive training included",
    ],
    roi: {
      metrics: [
        "25% reduction in customer service costs",
        "35% increase in customer satisfaction",
        "50% faster response times",
        "ROI realized within 3 months",
      ],
    },
  },
});

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const details = getProjectDetails(params.id);
    return NextResponse.json(details);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch project details" },
      { status: 500 }
    );
  }
}
