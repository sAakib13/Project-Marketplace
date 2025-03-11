import './globals.css';
import type { Metadata } from 'next';
import { Oxanium } from 'next/font/google';

const oxanium = Oxanium({ 
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Project Marketplace',
  description: 'Your centralized project management dashboard',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={oxanium.className}>{children}</body>
    </html>
  );
}