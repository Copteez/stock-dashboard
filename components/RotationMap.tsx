"use client";
import { ScatterChart, Scatter, XAxis, YAxis, ZAxis, Tooltip, ResponsiveContainer, ReferenceLine, LabelList, Cell, CartesianGrid } from 'recharts';
import themeData from "../data.json";

export default function RotationMap() {
  // Ensure we are mapping the current position correctly
  const chartData = themeData.map(t => ({
    ...t,
    x: t.score,
    y: t.momentum,
  }));

  return (
    <div className="bg-white border border-slate-200 p-6 rounded-lg shadow-sm relative">
      <h3 className="text-sm font-bold text-slate-900 uppercase mb-4 tracking-widest border-b pb-2">
        Relative Rotation Graph (RRG)
      </h3>
      
      {/* Quadrant Labels */}
      <div className="absolute top-20 right-12 text-[11px] font-black text-green-600/30 uppercase pointer-events-none">Leading</div>
      <div className="absolute top-20 left-16 text-[11px] font-black text-blue-600/30 uppercase pointer-events-none">Improving</div>
      <div className="absolute bottom-16 left-16 text-[11px] font-black text-red-600/30 uppercase pointer-events-none">Lagging</div>
      <div className="absolute bottom-16 right-12 text-[11px] font-black text-orange-600/30 uppercase pointer-events-none">Weakening</div>

      {/* FIX: Parent container with fixed height and min-width to prevent Recharts errors */}
      <div className="h-[550px] w-full min-w-0">
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ top: 20, right: 40, bottom: 40, left: 40 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            
            <XAxis 
              type="number" 
              dataKey="x" 
              domain={[95, 105]} 
              tickCount={11}
              tick={{fontSize: 10, fill: '#64748b'}}
              label={{ value: 'RS-Ratio (Strength)', position: 'bottom', offset: 20, fontSize: 12, fill: '#475569' }}
            />
            
            <YAxis 
              type="number" 
              dataKey="y" 
              domain={[95, 105]} 
              tickCount={11}
              tick={{fontSize: 10, fill: '#64748b'}}
              label={{ value: 'RS-Momentum', angle: -90, position: 'left', offset: 20, fontSize: 12, fill: '#475569' }}
            />
            
            <ZAxis type="number" range={[100, 100]} />
            
            <ReferenceLine x={100} stroke="#94a3b8" strokeWidth={2} />
            <ReferenceLine y={100} stroke="#94a3b8" strokeWidth={2} />
            
            <Tooltip 
              cursor={{ strokeDasharray: '3 3' }} 
              contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', color: '#0f172a' }}
            />

            {/* 1. DRAW THE TRAILS FIRST (History) */}
            {themeData.map((sector, idx) => (
              <Scatter 
                key={`trail-${idx}`} 
                data={sector.trail} 
                line={{ stroke: '#cbd5e1', strokeWidth: 1.5, strokeDasharray: '4 4' }} 
                shape={() => null} // Hides the history points, shows only the line
                isAnimationActive={false}
              />
            ))}

            {/* 2. DRAW THE MAIN DOTS (Current Position) */}
            <Scatter name="Sectors" data={chartData}>
              {chartData.map((entry, index) => {
                const color = 
                  entry.status === "Leading" ? "#16a34a" : 
                  entry.status === "Improving" ? "#2563eb" :
                  entry.status === "Weakening" ? "#ea580c" : 
                  entry.status === "Extended" ? "#f59e0b" : "#dc2626";
                
                return <Cell key={`cell-${index}`} fill={color} stroke="#fff" strokeWidth={2} />;
              })}
              <LabelList 
                dataKey="name" 
                position="top" 
                style={{ fill: '#334155', fontSize: '10px', fontWeight: 'bold' }} 
              />
            </Scatter>
          </ScatterChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}