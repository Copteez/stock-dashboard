// components/Sidebar.tsx
export default function Sidebar() {
  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col h-full">
      <div className="p-6 border-b border-slate-800">
        <h1 className="text-xl font-bold text-white uppercase tracking-wider italic">
          Risk-Off
        </h1>
        <p className="text-xs text-slate-400 mt-1">Selective Momentum</p>
      </div>
      
      <nav className="flex-1 p-4 space-y-2">
        <div className="text-xs font-semibold text-slate-500 uppercase px-2 mb-2">Navigation</div>
        <button className="w-full text-left px-3 py-2 rounded bg-blue-600 text-white text-sm">Dashboard</button>
        <button className="w-full text-left px-3 py-2 rounded hover:bg-slate-800 text-slate-300 text-sm transition">Rotation Map</button>
        <button className="w-full text-left px-3 py-2 rounded hover:bg-slate-800 text-slate-300 text-sm transition">Themes</button>
      </nav>

      <div className="p-4 border-t border-slate-800 bg-slate-950/50">
        <div className="flex justify-between items-center text-xs text-slate-400">
          <span>Market Status</span>
          <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
        </div>
      </div>
    </aside>
  );
}