import themeData from "../data.json";

export default function Sidebar() {
  // Find the sector with the highest score automatically
  const topSector = [...themeData].sort((a, b) => b.score - a.score)[0];
  
  // Count how many are 'Leading' to determine the overall market mood
  const leadingCount = themeData.filter(t => t.status === "Leading").length;
  const marketMood = leadingCount > 5 ? "Risk-On" : "Risk-Off";
  
  // Adjusted for light background visibility
  const moodColor = leadingCount > 5 ? "text-green-600" : "text-orange-600";

  return (
    // Background changed to white, border to light slate
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col h-full sticky top-0 shadow-sm">
      <div className="p-6 border-b border-slate-100">
        <h1 className={`text-xl font-black ${moodColor} uppercase tracking-wider italic`}>
          {marketMood}
        </h1>
        <p className="text-[10px] text-slate-400 mt-1 font-mono uppercase">
          System Status: Active
        </p>
      </div>
      
      <nav className="flex-1 p-4 space-y-1">
        <div className="text-[10px] font-bold text-slate-400 uppercase px-3 mb-2 tracking-widest">
          Navigation
        </div>
        
        {/* Active Button Style */}
        <button className="w-full text-left px-3 py-2 rounded bg-slate-100 text-slate-900 text-sm font-bold border border-slate-200">
          Dashboard
        </button>
        
        <button className="w-full text-left px-3 py-2 rounded hover:bg-slate-50 text-slate-500 hover:text-slate-900 text-sm transition">
          Rotation Map
        </button>
        
        <button className="w-full text-left px-3 py-2 rounded hover:bg-slate-50 text-slate-500 hover:text-slate-900 text-sm transition">
          Sector Analysis
        </button>

        {/* Top Mover Shortcut: Light Version */}
        <div className="mt-8 px-3">
          <div className="text-[10px] font-bold text-slate-400 uppercase mb-3 tracking-widest">
            Top Momentum
          </div>
          <div className="p-3 bg-slate-50 rounded border border-slate-200">
            <div className="text-[10px] text-green-600 font-bold uppercase">{topSector?.status}</div>
            <div className="text-sm font-bold text-slate-900 truncate">{topSector?.name}</div>
            <div className="text-xs text-slate-500 font-mono">{topSector?.ticker} • {topSector?.score}</div>
          </div>
        </div>
      </nav>

      {/* Market Status Footer: Light Version */}
      <div className="p-4 border-t border-slate-100 bg-slate-50/50">
        <div className="flex justify-between items-center text-[10px] font-mono text-slate-400">
          <span className="uppercase tracking-tight">Data Sync</span>
          <div className="flex items-center gap-2">
            <span className="text-slate-500 font-bold uppercase">OK</span>
            <span className="h-2 w-2 rounded-full bg-green-500 shadow-[0_0_6px_rgba(34,197,94,0.4)] animate-pulse"></span>
          </div>
        </div>
      </div>
    </aside>
  );
}