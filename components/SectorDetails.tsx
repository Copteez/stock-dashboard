"use client";
import { 
  ComposedChart, 
  Bar, 
  Line, // Import Line for wicks
  XAxis, 
  YAxis, 
  ResponsiveContainer, 
  Cell 
} from 'recharts';

export default function SectorDetails({ sector }: { sector: any }) {
  if (!sector || !sector.rankings || sector.rankings.length === 0) {
    return (
      <div className="p-8 text-center text-slate-500 text-xs italic">
        No symbol data available. Run script to update.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto bg-[#0f172a] rounded-b-lg border-t border-slate-800">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="text-[10px] text-slate-500 uppercase tracking-widest border-b border-slate-800/50">
            <th className="px-6 py-4 font-bold">Ticker</th>
            <th className="px-6 py-4 font-bold text-right">Close</th>
            <th className="px-6 py-4 font-bold text-center text-emerald-400">RS</th>
            <th className="px-6 py-4 font-bold text-right">1D%</th>
            <th className="px-6 py-4 font-bold text-right">Dist 52W</th>
            <th className="px-6 py-4 font-bold text-center">30D Candle History</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800/30">
          {sector.rankings.map((stock: any) => {
            const isPositive = stock.change_1d >= 0;
            
            // Format data for Candlestick rendering
            const candleData = stock.ohlc.map((d: any) => {
              const isUp = d.c >= d.o;
              return {
                ...d,
                // The 'body' of the candle is the range between Open and Close
                // We provide it as a single 'body' value for coloring logic
                body: [d.o, d.c],
                // We create separate fields for the wick (High/Low)
                // Recharts ComposedChart can map these to a Line
                wick: [d.l, d.h] 
              };
            });

            return (
              <tr key={stock.symbol} className="hover:bg-slate-800/40 transition-colors group">
                <td className="px-6 py-4">
                  <div className="flex flex-col">
                    <span className="font-black text-slate-100 text-sm tracking-tight">{stock.symbol}</span>
                    <span className="text-[9px] text-slate-500 uppercase font-mono">S&P 500 Component</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-right font-mono text-slate-300 text-sm">
                  {stock.close.toFixed(2)}
                </td>
                <td className="px-6 py-4 text-center">
                  <span className="font-black text-emerald-400 text-sm">
                    {Math.round(stock.rs_score)}
                  </span>
                </td>
                <td className={`px-6 py-4 text-right font-mono text-sm font-bold ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
                  {isPositive ? '+' : ''}{stock.change_1d}%
                </td>
                <td className="px-6 py-4 text-right font-mono text-sm text-orange-400 font-medium">
                  {stock.dist_52w}%
                </td>
                <td className="px-6 py-2 min-w-[200px]">
                  {/* Candlestick Container */}
                  <div className="h-12 w-full max-w-[250px] ml-auto">
                    <ResponsiveContainer width="100%" height="100%">
                      <ComposedChart data={candleData} margin={{ top: 5, bottom: 5 }}>
                        <XAxis dataKey="time" hide />
                        {/* We scale the YAxis to dataMin/dataMax for best fit */}
                        <YAxis domain={['dataMin', 'dataMax']} hide />
                        
                        {/* THE CANDLESTICK LOGIC (Line behind Bar) */}
                        
                        {/* 1. The Wick (Straight Vertical Line for High-Low range) */}
                        <Line 
                          type="monotone" 
                          dataKey="wick" 
                          stroke="#64748b" 
                          strokeWidth={1} 
                          dot={false} // Important: Hide default dots
                          isAnimationActive={false}
                        />

                        {/* 2. The Body (Bar for Open-Close range) */}
                        <Bar dataKey="body" isAnimationActive={false} barSize={4}>
                          {/* Candle Colors */}
                          {candleData.map((entry: any, index: number) => (
                            <Cell 
                              key={`cell-${index}`} 
                              fill={entry.c >= entry.o ? "#10b981" : "#ef4444"} 
                            />
                          ))}
                        </Bar>
                      </ComposedChart>
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