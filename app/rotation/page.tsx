// app/rotation/page.tsx
import RotationMap from "@/components/RotationMap";
import themeData from "@/data.json";

export default function RotationPage() {
  const counts = {
    Leading: themeData.filter((t) => t.status === "Leading").length,
    Improving: themeData.filter((t) => t.status === "Improving").length,
    Lagging: themeData.filter((t) => t.status === "Lagging").length,
    Weakening: themeData.filter((t) => t.status === "Weakening").length,
  };

  return (
    <div className="p-8 space-y-8 bg-slate-50 min-h-screen">
      <header className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Rotation Map</h2>
          <p className="text-slate-500 text-sm">Relative Strength vs. Momentum Visualization</p>
        </div>
        <div className="flex gap-4 text-xs font-mono font-bold">
          <span className="text-green-600">{counts.Leading} Leading</span>
          <span className="text-blue-600">{counts.Improving} Improving</span>
          <span className="text-red-600">{counts.Lagging} Lagging</span>
        </div>
      </header>

      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
        <RotationMap />
      </div>
    </div>
  );
}