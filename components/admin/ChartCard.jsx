import React from 'react';

const ChartCard = ({ title, children, className = '' }) => {
  return (
    <div className={`bg-zinc-900 border border-zinc-800 rounded-2xl p-6 ${className}`}>
      {title && (
        <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-6">{title}</h3>
      )}
      <div className="relative w-full h-[300px]">
        {children}
      </div>
    </div>
  );
};

export default ChartCard;
