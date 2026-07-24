import React, { useState } from 'react';

const colorStyles = {
    slate: 'border-l-slate-500',
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
        <div className={`bg-white rounded-[10px] h-[80px] p-[20px] border-l-2 border-t border-r border-b border-t-slate-100 border-r-slate-100 border-b-slate-100 shadow-[0_2px_8px_rgba(0,0,0,0.06)] flex flex-col justify-center ${borderColor} relative group`}>
            <div className="flex justify-between items-center mb-[2px]">
                <div className="text-[12px] font-semibold text-slate-500 uppercase tracking-[.02em]">{label}</div>
                <button 
                    onClick={() => setShowInfo(!showInfo)}
                    className="text-slate-300 hover:text-slate-500 text-[12px] transition-colors cursor-pointer"
                    title={`Info: ${label}`}
                >
                    <i className="fa-solid fa-circle-info"></i>
                </button>
            </div>
            
            <div className="flex items-baseline gap-1 leading-none">
                <div className={`text-[42px] font-bold leading-none ${colorClass === 'slate' ? 'text-slate-900' : textColor}`}>
                    {value}
                </div>
                {unit && <span className="text-[18px] font-medium text-slate-500">{unit}</span>}
            </div>

            {/* QUICK INFO TOOLTIP / POPOVER */}
            {showInfo && (
                <div className="absolute top-full left-0 right-0 mt-2 z-30 bg-slate-900 text-white text-[12px] p-3 rounded-lg shadow-xl border border-slate-700 animate-in fade-in zoom-in-95 duration-100 flex items-center justify-between gap-2">
                    <span>{defaultInfo}</span>
                    <button onClick={() => setShowInfo(false)} className="text-slate-400 hover:text-white cursor-pointer">
                        <i className="fa-solid fa-xmark"></i>
                    </button>
                </div>
            )}
        </div>
    );
}
