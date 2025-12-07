import React from 'react';

interface InfoCardProps {
  label: string;
  value: string | number | null;
  unit?: string;
  icon: React.ReactNode;
  highlight?: boolean;
}

export const InfoCard: React.FC<InfoCardProps> = ({ label, value, unit, icon, highlight }) => {
  const displayValue = value !== null ? value : "--";
  
  return (
    <div className={`
      relative overflow-hidden rounded-xl border p-4 backdrop-blur-sm transition-all duration-300
      ${highlight 
        ? "border-cyan-500/50 bg-cyan-950/20 shadow-[0_0_15px_rgba(6,182,212,0.15)]" 
        : "border-slate-800 bg-slate-900/40 hover:border-slate-700"}
    `}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-500">{label}</span>
        <div className={`p-1.5 rounded-lg ${highlight ? "bg-cyan-500/10 text-cyan-400" : "bg-slate-800 text-slate-400"}`}>
          {icon}
        </div>
      </div>
      <div className="flex items-baseline gap-1">
        <span className={`text-2xl font-mono font-bold ${highlight ? "text-white" : "text-slate-200"}`}>
          {displayValue}
        </span>
        {unit && <span className="text-sm font-medium text-slate-500">{unit}</span>}
      </div>
      
      {/* Decoration line */}
      <div className={`absolute bottom-0 left-0 h-0.5 w-full ${highlight ? "bg-cyan-500/30" : "bg-transparent"}`} />
    </div>
  );
};