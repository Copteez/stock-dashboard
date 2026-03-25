import themeData from "../data.json";

export default function DashboardPage() {
  // Logic to calculate counts for the header
  const counts = {
    Leading: themeData.filter((t) => t.status === "Leading").length,
    Improving: themeData.filter((t) => t.status === "Improving").length,
    Lagging: themeData.filter((t) => t.status === "Lagging").length,
    Weakening: themeData.filter((t) => t.status === "Weakening").length,
  };

  return (
    <div className="p-8 space-y-8">
      {/* Header Section */}
      <header className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Action Queue</h2>
          <p className="text-slate-400 text-sm">Official S&P 500 Sector Rotation</p>
        </div>
        <div className="flex gap-4 text-xs font-mono">
          <span className="text-green-400">{counts.Leading} Leading</span>
          <span className="text-blue-400">{counts.Improving} Improving</span>
          <span className="text-orange-400">{counts.Weakening} Weakening</span>
          <span className="text-red-400">{counts.Lagging} Lagging</span>
        </div>
      </header>

      {/* The Dashboard Grid - Now Dynamic */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {themeData.map((theme) => {
          // Define status-specific colors
          const statusStyles = {
            Leading: "bg-green-900/30 text-green-400 border-green-500/20",
            Improving: "bg-blue-900/30 text-blue-400 border-blue-500/20",
            Weakening: "bg-orange-900/30 text-orange-400 border-orange-500/20",
            Lagging: "bg-red-900/30 text-red-400 border-red-500/20",
          };

          return (
            <div key={theme.ticker} className="bg-slate-900 border border-slate-800 p-5 rounded-lg shadow-xl hover:border-slate-700 transition-colors">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-bold text-lg uppercase">{theme.name}</h3>
                  <p className="text-xs text-slate-500">{theme.ticker}</p>
                </div>
                <span className={`px-2 py-1 rounded text-[10px] font-bold border uppercase tracking-tighter ${statusStyles[theme.status as keyof typeof statusStyles]}`}>
                  {theme.status}
                </span>
              </div>

              {/* Breadth Bar Section */}
              <div className="mb-4">
                <div className="flex justify-between text-[10px] uppercase font-mono text-slate-500 mb-1">
                   <span>Sector Breadth</span>
                   <span>{theme.breadth}%</span>
                </div>
                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div 
                    className="bg-blue-500 h-full rounded-full transition-all duration-1000" 
                    style={{ width: `${theme.breadth}%` }}
                  />
                </div>
              </div>

              <div className="flex justify-between items-end">
                <div className={`text-3xl font-bold tracking-tighter ${theme.score > 100 ? "text-white" : "text-slate-400"}`}>
                  {theme.score} <span className="text-xs text-slate-500 font-normal">SCORE</span>
                </div>
                <div className="text-right">
                  <div className={`font-bold ${theme.change >= 0 ? "text-green-400" : "text-red-400"}`}>
                    {theme.change >= 0 ? "+" : ""}{theme.change}%
                  </div>
                  <div className="text-[10px] text-slate-500 uppercase font-mono">Daily Change</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}