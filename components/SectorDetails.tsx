"use client";

export default function SectorDetails({ sector }: { sector: any }) {
  if (!sector) return null;

  return (
    <div className="mt-4 p-4 bg-slate-50 border-t border-slate-200 rounded-b-lg">
      <h4 className="text-[10px] font-bold text-slate-400 uppercase mb-3 tracking-widest">
        Top 10 Performers (vs 50MA)
      </h4>
      <div className="space-y-2">
        {sector.rankings.map((stock: any, index: number) => (
          <div key={stock.symbol} className="flex justify-between items-center text-sm">
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-slate-300 font-mono w-4">{index + 1}</span>
              <span className="font-bold text-slate-700">{stock.symbol}</span>
            </div>
            <span className={`font-mono font-bold ${stock.rs_score > 100 ? 'text-green-600' : 'text-red-600'}`}>
              {stock.rs_score}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}