"use client";
import { LineChart, Line, ResponsiveContainer } from 'recharts';

export default function SectorDetails({ sector }: { sector: any }) {
  if (!sector || !sector.rankings) return null;

  return (
    <div className="mt-2 overflow-x-auto bg-slate-900 rounded-b-lg border-t border-slate-800">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="text-[10px] text-slate-500 uppercase tracking-wider border-b border-slate-800">
            <th className="px-4 py-3 font-medium">Ticker</th>
            <th className="px-4 py-3 font-medium text-right">Close</th>
            <th className="px-4 py-3 font-medium text-center text-emerald-400">RS</th>
            <th className="px-4 py-3 font-medium text-right">1D%</th>
            <th className="px-4 py-3 font-medium text-right">Dist 52W</th>
            <th className="px-4 py-3 font-medium text-center w-32">30D Trend</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800/50">
          {sector.rankings.map((stock: any) => (
            <tr key={stock.symbol} className="hover:bg-slate-800/40 transition-colors">
              <td className="px-4 py-3">
                <span className="font-bold text-slate-200 text-sm">{stock.symbol}</span>
              </td>
              <td className="px-4 py-3 text-right font-mono text-slate-300 text-sm">
                {stock.close.toFixed(2)}
              </td>
              <td className="px-4 py-3 text-center">
                <span className="font-bold text-emerald-400">{Math.round(stock.rs_score)}</span>
              </td>
              <td className={`px-4 py-3 text-right font-mono text-sm ${stock.change_1d >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {stock.change_1d >= 0 ? '+' : ''}{stock.change_1d}%
              </td>
              <td className="px-4 py-3 text-right font-mono text-sm text-orange-400">
                {stock.dist_52w}%
              </td>
              <td className="px-4 py-3 h-10">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={stock.sparkline.map((val: number, i: number) => ({ val, i }))}>
                    <Line 
                      type="monotone" 
                      dataKey="val" 
                      stroke={stock.change_1d >= 0 ? "#10b981" : "#ef4444"} 
                      strokeWidth={2} 
                      dot={false} 
                    />
                  </LineChart>
                </ResponsiveContainer>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}