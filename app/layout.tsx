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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full">
      {/* Changed bg-slate-950 to bg-slate-50 and text-slate-100 to text-slate-900 */}
      <body className="h-full flex bg-white text-slate-900">
        <Sidebar />
        <main className="flex-1 overflow-y-auto -ml-px bg-slate-50">
          <div className="max-w-[1600px] mx-auto min-h-screen">
            {children}
          </div>
        </main>
      </body>
    </html>
  );
}