import React, { useState } from 'react';

const colorStyles = {
    slate: 'border-l-slate-600 text-slate-900',
    blue: 'border-l-blue-500 text-blue-600',
    green: 'border-l-emerald-500 text-emerald-600',
    orange: 'border-l-amber-500 text-amber-600',
    purple: 'border-l-violet-500 text-violet-600',
    cyan: 'border-l-cyan-500 text-cyan-600',
};

export default function KPICard({ label, value, unit, colorClass, info }) {
    const [showInfo, setShowInfo] = useState(false);
    const theme = colorStyles[colorClass] || colorStyles.slate;
    const borderColor = theme.split(' ')[0];
    const textColor = theme.split(' ')[1] || 'text-slate-900';

    const defaultInfo = info || `${label}: ${value} ${unit || ''}`;

    return (
        <div className={`bg-white rounded-xl py-3 px-3 sm:py-3.5 sm:px-4 md:py-4 md:px-[18px] border-l-4 border-t border-r border-b border-t-slate-100 border-r-slate-100 border-b-slate-100 shadow-sm transition-all duration-150 hover:shadow-md ${borderColor} relative group flex flex-col justify-between`}>
            <div className="flex justify-between items-start mb-1 gap-1">
                <div className="text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-[.06em] leading-tight">{label}</div>
                <button 
                    onClick={() => setShowInfo(!showInfo)}
                    className="text-slate-300 hover:text-slate-500 text-[10px] sm:text-[11px] transition-colors cursor-pointer shrink-0"
                    title={`Info: ${label}`}
                >
                    <i className="fa-solid fa-circle-info"></i>
                </button>
            </div>
            
            <div className={`text-[19px] sm:text-[22px] md:text-[24px] lg:text-[26px] font-extrabold leading-[1.1] whitespace-nowrap flex items-baseline gap-1 ${colorClass === 'slate' ? 'text-slate-900' : textColor}`}>
                <span>{value}</span>
                {unit && <span className="text-[11px] sm:text-[12px] md:text-[13px] font-bold text-slate-500 whitespace-nowrap">{unit}</span>}
            </div>

            {/* QUICK INFO TOOLTIP / POPOVER */}
            {showInfo && (
                <div className="absolute top-full left-0 right-0 mt-2 z-30 bg-slate-900 text-white text-[11px] p-2.5 rounded-lg shadow-xl border border-slate-700 animate-in fade-in zoom-in-95 duration-100 flex items-center justify-between gap-2">
                    <span>{defaultInfo}</span>
                    <button onClick={() => setShowInfo(false)} className="text-slate-400 hover:text-white cursor-pointer shrink-0">
                        <i className="fa-solid fa-xmark"></i>
                    </button>
                </div>
            )}
        </div>
    );
}
