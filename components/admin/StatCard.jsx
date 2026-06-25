import React from 'react';

const StatCard = ({ title, value, icon: Icon, description, trend, trendType = 'neutral' }) => {
  const trendColors = {
    up: 'text-emerald-400 bg-emerald-500/10',
    down: 'text-rose-400 bg-rose-500/10',
    neutral: 'text-zinc-400 bg-zinc-800',
  };

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 flex items-center gap-5">
      <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800/80 text-accent text-xl flex-shrink-0">
        <Icon />
      </div>
      
      <div className="flex-1 min-w-0">
        <span className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1">{title}</span>
        <span className="block text-2xl font-bold text-zinc-100 mb-1">{value}</span>
        <div className="flex items-center gap-2">
          {trend && (
            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${trendColors[trendType]}`}>
              {trend}
            </span>
          )}
          {description && (
            <span className="text-xs text-zinc-500 truncate">{description}</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default StatCard;
