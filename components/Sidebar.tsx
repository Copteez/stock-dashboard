"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUpRight, ArrowDownRight, Activity, Zap } from "lucide-react";
import themeData from "@/data.json";

export default function Sidebar() {
  const pathname = usePathname();

  // --- DATA LOGIC ---
  const sortedByChange = [...themeData].sort((a, b) => b.change - a.change);
  const topPerformers = sortedByChange.slice(0, 3);
  const worstPerformers = sortedByChange.slice(-3).reverse();

  const leadingCount = themeData.filter((t) => t.status === "Leading").length;
  const marketMood = leadingCount > 5 ? "Risk-On" : "Risk-Off";
  const moodColor = leadingCount > 5 ? "text-green-600" : "text-orange-600";

  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col h-full sticky top-0 shadow-sm overflow-y-auto">
      {/* Header */}
      <div className="p-6 border-b border-slate-100">
        <h1 className={`text-xl font-black ${moodColor} uppercase tracking-wider italic`}>
          {marketMood}
        </h1>
        <p className="text-[10px] text-slate-400 mt-1 font-mono uppercase">
          System Status: Active
        </p>
      </div>

      <nav className="flex-1 p-4 space-y-6">
        {/* Navigation Section */}
        <div>
          <div className="text-[10px] font-bold text-slate-400 uppercase px-3 mb-2 tracking-widest">
            Navigation
          </div>
          <div className="space-y-1">
            <Link href="/">
              <div className={`w-full text-left px-3 py-2 rounded text-sm transition cursor-pointer ${
                pathname === '/' ? 'bg-slate-100 text-slate-900 font-bold border border-slate-200' : 'text-slate-500 hover:bg-slate-50'
              }`}>
                Dashboard
              </div>
            </Link>
            <Link href="/rotation">
              <div className={`w-full text-left px-3 py-2 rounded text-sm transition cursor-pointer ${
                pathname === '/rotation' ? 'bg-slate-100 text-slate-900 font-bold border border-slate-200' : 'text-slate-500 hover:bg-slate-50'
              }`}>
                Rotation Map
              </div>
            </Link>
          </div>
        </div>

        {/* TOP PERFORMERS - 1D */}
        <div>
          <div className="flex items-center gap-2 text-[10px] font-bold text-green-600 uppercase px-3 mb-3 tracking-widest">
            <ArrowUpRight size={14} /> Top 1D
          </div>
          <div className="space-y-2 px-1">
            {topPerformers.map((theme) => (
              <div key={theme.ticker} className="flex justify-between items-center p-2 rounded hover:bg-green-50/50 transition-colors">
                <div>
                  <div className="text-xs font-bold text-slate-900">{theme.ticker}</div>
                  <div className="text-[10px] text-slate-400 truncate w-24">{theme.name}</div>
                </div>
                <div className="text-xs font-mono font-bold text-green-600">
                  +{theme.change}%
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* WORST PERFORMERS - 1D */}
        <div>
          <div className="flex items-center gap-2 text-[10px] font-bold text-red-600 uppercase px-3 mb-3 tracking-widest">
            <ArrowDownRight size={14} /> Worst 1D
          </div>
          <div className="space-y-2 px-1">
            {worstPerformers.map((theme) => (
              <div key={theme.ticker} className="flex justify-between items-center p-2 rounded hover:bg-red-50/50 transition-colors">
                <div>
                  <div className="text-xs font-bold text-slate-900">{theme.ticker}</div>
                  <div className="text-[10px] text-slate-400 truncate w-24">{theme.name}</div>
                </div>
                <div className="text-xs font-mono font-bold text-red-600">
                  {theme.change}%
                </div>
              </div>
            ))}
          </div>
        </div>
      </nav>

      {/* Market Pulse Footer */}
      <div className="p-4 border-t border-slate-100 bg-slate-50/50">
        <div className="flex justify-between items-center text-[10px] font-mono text-slate-400">
          <span className="uppercase">Market Pulse</span>
          <div className="flex items-center gap-2">
            <Activity size={12} className="text-blue-500" />
            <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
          </div>
        </div>
      </div>
    </aside>
  );
}