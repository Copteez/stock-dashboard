import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Sidebar from "@/components/Sidebar";
import "./globals.css";

// Setting up the professional fonts
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Market Rotation Dashboard",
  description: "Daily Sector Rotation and Market Breadth Analysis",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="h-full flex bg-slate-950 text-slate-100 font-sans">
        
        {/* Fixed Sidebar: Stays on the left while you scroll the dashboard */}
        <Sidebar />
        
        {/* Main Content: This area scrolls independently */}
        <main className="flex-1 h-full overflow-y-auto custom-scrollbar">
          {/* Max-width container keeps the dashboard from stretching too wide on big monitors */}
          <div className="max-w-[1600px] mx-auto min-h-screen">
            {children}
          </div>
        </main>

      </body>
    </html>
  );
}