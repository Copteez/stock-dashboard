"use client";
import { LineChart, Line, ResponsiveContainer, YAxis } from 'recharts';

export default function SectorDetails({ sector }: { sector: any }) {
  // Guard clause: If no rankings exist in data.json, show a message
  if (!sector || !sector.rankings || sector.rankings.length === 0) {
    return (
      <div className="p-8 text-center text-slate-500 text-xs italic">
        No symbol data available for this sector. Run Python script to update.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto bg-[#0f172a] rounded-b-lg border-t border-slate-800">
      <table className="w-full text-left border-collapse min-w-[600px]">
        <thead>
          <tr className="text-[10px] text-slate-500 uppercase tracking-widest border-b border-slate-800/50">
            <th className="px-4 py-3 font-bold">Ticker</th>
            <th className="px-4 py-3 font-bold text-right">Close</th>
            <th className="px-4 py-3 font-bold text-center text-emerald-400">RS</th>
            <th className="px-4 py-3 font-bold text-right">1D%</th>
            <th className="px-4 py-3 font-bold text-right">Dist 52W</th>
            <th className="px-4 py-3 font-bold text-center">30D Candle</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800/30">
          {sector.rankings.map((stock: any) => {
            const isPositive = stock.change_1d >= 0;
            
            return (
              <tr key={stock.symbol} className="hover:bg-slate-800/40 transition-colors group">
                <td className="px-4 py-3">
                  <div className="flex flex-col">
                    <span className="font-black text-slate-100 text-sm tracking-tight">{stock.symbol}</span>
                    <span className="text-[9px] text-slate-500 uppercase font-mono">Equity</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-right font-mono text-slate-300 text-sm">
                  {stock.close ? stock.close.toFixed(2) : "0.00"}
                </td>
                <td className="px-4 py-3 text-center">
                  <span className="font-black text-emerald-400 text-sm">
                    {Math.round(stock.rs_score)}
                  </span>
                </td>
                <td className={`px-4 py-3 text-right font-mono text-sm font-bold ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
                  {isPositive ? '+' : ''}{stock.change_1d}%
                </td>
                <td className="px-4 py-3 text-right font-mono text-sm text-orange-400 font-medium">
                  {stock.dist_52w}%
                </td>
                <td className="px-4 py-2">
                  {/* Fixed container for Sparkline */}
                  <div className="h-10 w-32 ml-auto mr-auto">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={stock.sparkline?.map((val: number, i: number) => ({ val, i })) || []}>
                        <YAxis domain={[0, 1]} hide />
                        <Line 
                          type="monotone" 
                          dataKey="val" 
                          stroke={isPositive ? "#10b981" : "#ef4444"} 
                          strokeWidth={2} 
                          dot={false}
                          isAnimationActive={false} 
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}