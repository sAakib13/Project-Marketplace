import "./globals.css";
import type { Metadata } from "next";
import { Oxanium } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

const oxanium = Oxanium({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Project Marketplace",
  description: "Your centralized project management dashboard",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={oxanium.className}>
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
