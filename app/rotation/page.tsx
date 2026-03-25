"use client";
import { ScatterChart, Scatter, XAxis, YAxis, ZAxis, Tooltip, ResponsiveContainer, ReferenceLine, LabelList, Cell, CartesianGrid, Line, ComposedChart } from 'recharts';
import themeData from "@/data.json";

export default function RotationMap() {
  return (
    <div className="bg-white border border-slate-200 p-6 rounded-lg h-[600px] w-full relative shadow-sm">
      {/* ... (Your existing Quadrant Labels: Leading, Improving, etc.) ... */}

      <ResponsiveContainer width="100%" height="90%">
        {/* We use ScatterChart still, but we will nest our logic */}
        <ScatterChart margin={{ top: 20, right: 40, bottom: 40, left: 40 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
          <XAxis type="number" dataKey="x" domain={[95, 105]} tick={{fontSize: 10}} />
          <YAxis type="number" dataKey="y" domain={[95, 105]} tick={{fontSize: 10}} />
          <ZAxis type="number" range={[100, 100]} />
          
          <ReferenceLine x={100} stroke="#94a3b8" strokeWidth={2} />
          <ReferenceLine y={100} stroke="#94a3b8" strokeWidth={2} />

          {/* 1. DRAW THE TRAILS FIRST (So they appear behind the dots) */}
          {themeData.map((sector, idx) => (
            <Scatter 
              key={`trail-${idx}`} 
              data={sector.trail} 
              line={{ stroke: '#cbd5e1', strokeWidth: 1, strokeDasharray: '4 4' }} 
              shape={() => null} // Hide dots for the trail history
            />
          ))}

          {/* 2. DRAW THE CURRENT POSITION DOTS */}
          <Scatter name="Sectors" data={themeData.map(t => ({ ...t, x: t.score, y: t.momentum }))}>
            {themeData.map((entry, index) => {
              const color = 
                entry.status === "Leading" ? "#16a34a" : 
                entry.status === "Improving" ? "#2563eb" :
                entry.status === "Weakening" ? "#ea580c" : "#dc2626";
              
              return <Cell key={`cell-${index}`} fill={color} stroke="#fff" strokeWidth={2} />;
            })}
            <LabelList dataKey="name" position="top" style={{ fill: '#334155', fontSize: '10px', fontWeight: 'bold' }} />
          </Scatter>
          
          <Tooltip cursor={{ strokeDasharray: '3 3' }} />
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
}