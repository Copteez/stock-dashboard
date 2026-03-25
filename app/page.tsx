import themeData from "../data.json";
import RotationMap from "@/components/RotationMap";

export default function DashboardPage() {
  const counts = {
    Leading: themeData.filter((t) => t.status === "Leading").length,
    Improving: themeData.filter((t) => t.status === "Improving").length,
    Lagging: themeData.filter((t) => t.status === "Lagging").length,
    Weakening: themeData.filter((t) => t.status === "Weakening").length,
  };

  return (
    // Main background changed to white/slate-50
    <div className="p-8 space-y-8 bg-slate-50 min-h-screen">
      
      {/* Header Section */}
      <header className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Action Queue</h2>
          <p className="text-slate-500 text-sm">Official S&P 500 Sector Rotation</p>
        </div>
        <div className="flex gap-4 text-xs font-mono font-bold">
          <span className="text-green-600">{counts.Leading} Leading</span>
          <span className="text-blue-600">{counts.Improving} Improving</span>
          <span className="text-orange-600">{counts.Weakening} Weakening</span>
          <span className="text-red-600">{counts.Lagging} Lagging</span>
        </div>
      </header>

      <section>
        <RotationMap />
      </section>

      {/* The Dashboard Grid - Updated for Light Mode */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {themeData.map((theme) => {
          // Adjusted status colors for better readability on light backgrounds
          const statusStyles = {
            Leading: "bg-green-100 text-green-700 border-green-200",
            Improving: "bg-blue-100 text-blue-700 border-blue-200",
            Weakening: "bg-orange-100 text-orange-700 border-orange-200",
            Lagging: "bg-red-100 text-red-700 border-red-200",
          };

          return (
            <div key={theme.ticker} className="bg-white border border-slate-200 p-5 rounded-lg shadow-sm hover:shadow-md transition-all">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-bold text-lg uppercase text-slate-900">{theme.name}</h3>
                  <p className="text-xs text-slate-400 font-mono">{theme.ticker}</p>
                </div>
                <span className={`px-2 py-1 rounded text-[10px] font-bold border uppercase tracking-tighter ${statusStyles[theme.status as keyof typeof statusStyles]}`}>
                  {theme.status}
                </span>
              </div>

              {/* Breadth Bar Section */}
              <div className="mb-4">
                <div className="flex justify-between text-[10px] uppercase font-mono text-slate-400 mb-1">
                   <span>Sector Breadth</span>
                   <span className="text-slate-600">{theme.breadth}%</span>
                </div>
                <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                  <div 
                    className="bg-blue-600 h-full rounded-full transition-all duration-1000" 
                    style={{ width: `${theme.breadth}%` }}
                  />
                </div>
              </div>

              <div className="flex justify-between items-end">
                <div className="text-3xl font-bold tracking-tighter text-slate-900">
                  {theme.score} <span className="text-xs text-slate-400 font-normal">SCORE</span>
                </div>
                <div className="text-right">
                  <div className={`font-bold ${theme.change >= 0 ? "text-green-600" : "text-red-600"}`}>
                    {theme.change >= 0 ? "+" : ""}{theme.change}%
                  </div>
                  <div className="text-[10px] text-slate-400 uppercase font-mono">Daily Change</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}