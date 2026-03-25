// app/page.tsx
export default function DashboardPage() {
  return (
    <div className="p-8 space-y-8">
      {/* Header Section */}
      <header className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Action Queue</h2>
          <p className="text-slate-400 text-sm">Highest-priority themes today</p>
        </div>
        <div className="flex gap-4 text-xs font-mono">
          <span className="text-green-400">2 Actionable</span>
          <span className="text-blue-400">3 Emerging</span>
          <span className="text-red-400">4 Broken</span>
        </div>
      </header>

      {/* The Dashboard Grid (Just 2 cards for now) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* Card 1: Oil Services */}
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-lg shadow-xl">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="font-bold text-lg">OIL SERVICES</h3>
              <p className="text-xs text-slate-500">OIH / CRAK / MLPX</p>
            </div>
            <span className="px-2 py-1 rounded bg-green-900/30 text-green-400 text-[10px] font-bold border border-green-500/20 uppercase tracking-tighter">
              Actionable
            </span>
          </div>
          <div className="flex justify-between items-end">
             <div className="text-3xl font-bold tracking-tighter">75 <span className="text-xs text-slate-500 font-normal">SCORE</span></div>
             <div className="text-right">
                <div className="text-green-400 font-bold">+5.7%</div>
                <div className="text-[10px] text-slate-500 uppercase font-mono">1M AVG</div>
             </div>
          </div>
        </div>

        {/* Card 2: Cybersecurity */}
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-lg shadow-xl">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="font-bold text-lg">CYBERSECURITY</h3>
              <p className="text-xs text-slate-500">CIBR / HACK / BUG</p>
            </div>
            <span className="px-2 py-1 rounded bg-blue-900/30 text-blue-400 text-[10px] font-bold border border-blue-500/20 uppercase tracking-tighter">
              Emerging
            </span>
          </div>
          <div className="flex justify-between items-end">
             <div className="text-3xl font-bold tracking-tighter text-slate-400">34 <span className="text-xs text-slate-500 font-normal">SCORE</span></div>
             <div className="text-right">
                <div className="text-green-400 font-bold">+3.6%</div>
                <div className="text-[10px] text-slate-500 uppercase font-mono">1M AVG</div>
             </div>
          </div>
        </div>

      </div>
    </div>
  );
}