"use client";
import { ScatterChart, Scatter, XAxis, YAxis, ZAxis, Tooltip, ResponsiveContainer, ReferenceLine, LabelList, Cell, CartesianGrid } from 'recharts';
import themeData from "../data.json";

export default function RotationMap() {
  const chartData = themeData.map(t => ({
    name: t.name,
    x: t.score,
    y: t.momentum,
    status: t.status
  }));

  return (
    // changed bg-slate-900 to bg-white and border color
    <div className="bg-white border border-slate-200 p-6 rounded-lg h-[600px] w-full relative shadow-sm">
      <h3 className="text-sm font-bold text-slate-900 uppercase mb-4 tracking-widest border-b pb-2">
        Relative Rotation Graph (RRG)
      </h3>
      
      {/* Updated Quadrant Labels for White Background */}
      <div className="absolute top-16 right-12 text-[11px] font-black text-green-600/40 uppercase">Leading</div>
      <div className="absolute top-16 left-16 text-[11px] font-black text-blue-600/40 uppercase">Improving</div>
      <div className="absolute bottom-12 left-16 text-[11px] font-black text-red-600/40 uppercase">Lagging</div>
      <div className="absolute bottom-12 right-12 text-[11px] font-black text-orange-600/40 uppercase">Weakening</div>

      <ResponsiveContainer width="100%" height="90%">
        <ScatterChart margin={{ top: 20, right: 40, bottom: 40, left: 40 }}>
          {/* Subtle grid lines */}
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
          
          {/* XAxis: Hard-coded to 95-105 to center 100 */}
          <XAxis 
            type="number" 
            dataKey="x" 
            domain={[95, 105]} 
            tickCount={11}
            tick={{fontSize: 10, fill: '#64748b'}}
            label={{ value: 'RS-Ratio (Strength)', position: 'bottom', offset: 20, fontSize: 12, fill: '#475569' }}
          />
          
          {/* YAxis: Hard-coded to 95-105 to center 100 */}
          <YAxis 
            type="number" 
            dataKey="y" 
            domain={[95, 105]} 
            tickCount={11}
            tick={{fontSize: 10, fill: '#64748b'}}
            label={{ value: 'RS-Momentum', angle: -90, position: 'left', offset: 20, fontSize: 12, fill: '#475569' }}
          />
          
          <ZAxis type="number" range={[100, 100]} />
          
          {/* Centered Crosshair at 100, 100 */}
          <ReferenceLine x={100} stroke="#94a3b8" strokeWidth={2} />
          <ReferenceLine y={100} stroke="#94a3b8" strokeWidth={2} />
          
          <Tooltip 
            cursor={{ strokeDasharray: '3 3' }} 
            contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', color: '#0f172a' }}
          />

          <Scatter name="Sectors" data={chartData}>
            {chartData.map((entry, index) => {
              const color = 
                entry.status === "Leading" ? "#16a34a" : 
                entry.status === "Improving" ? "#2563eb" :
                entry.status === "Weakening" ? "#ea580c" : "#dc2626";
              
              return <Cell key={`cell-${index}`} fill={color} />;
            })}
            {/* Darker labels for white background */}
            <LabelList dataKey="name" position="top" style={{ fill: '#334155', fontSize: '10px', fontWeight: 'bold' }} />
          </Scatter>
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
}