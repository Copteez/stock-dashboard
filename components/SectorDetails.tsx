"use client";
import MiniCandleChart from './MiniCandleChart'; // Import the new component

export default function SectorDetails({ sector }: { sector: any }) {
  if (!sector || !sector.rankings || sector.rankings.length === 0) return null;

  return (
    <div className="overflow-x-auto bg-[#0f172a] rounded-b-lg border-t border-slate-800">
      <table className="w-full text-left border-collapse table-fixed">
        <thead>
          <tr className="text-[10px] text-slate-500 uppercase tracking-widest border-b border-slate-800/50">
            <th className="px-6 py-4 font-bold w-[20%]">Ticker</th>
            <th className="px-6 py-4 font-bold text-right w-[12%]">Close</th>
            <th className="px-6 py-4 font-bold text-center w-[10%] text-emerald-400">RS</th>
            <th className="px-6 py-4 font-bold text-right w-[12%]">1D%</th>
            <th className="px-6 py-4 font-bold text-right w-[12%]">Dist 52W</th>
            <th className="px-6 py-4 font-bold text-left pl-10">30D Candle History</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800/30">
          {sector.rankings.map((stock: any) => {
            if (!stock.ohlc) return null;
            const isPositive = stock.change_1d >= 0;

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
                  <span className="font-black text-emerald-400 text-sm">{Math.round(stock.rs_score)}</span>
                </td>
                
                <td className={`px-6 py-4 text-right font-mono text-sm font-bold ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
                  {isPositive ? '+' : ''}{stock.change_1d}%
                </td>
                
                <td className="px-6 py-4 text-right font-mono text-sm text-orange-400 font-medium">
                  {stock.dist_52w}%
                </td>
                
                {/* THE NEW CHART CELL */}
                <td className="px-6 py-2 pl-10">
                  {/* Give the div a fixed height and width so LWC can calculate its size immediately */}
                  <div className="h-14 w-[360px] overflow-hidden"> 
                    <MiniCandleChart data={stock.ohlc} />
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