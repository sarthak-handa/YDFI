import React from 'react';

const colorStyles = {
    slate: 'border-l-slate-600 text-slate-900', // Value color override inside component if needed, but default is slate-900
    blue: 'border-l-blue-500 text-blue-600',
    green: 'border-l-emerald-500 text-emerald-600',
    orange: 'border-l-amber-500 text-amber-600',
    purple: 'border-l-violet-500 text-violet-600',
    cyan: 'border-l-cyan-500 text-cyan-600',
};

export default function KPICard({ label, value, unit, colorClass }) {
    const theme = colorStyles[colorClass] || colorStyles.slate;
    const borderColor = theme.split(' ')[0];
    const textColor = theme.split(' ')[1] || 'text-slate-900';

    return (
        <div className={`bg-white rounded-xl py-4 px-[18px] border-l-4 border-t border-r border-b border-t-slate-100 border-r-slate-100 border-b-slate-100 shadow-sm transition-shadow duration-150 hover:shadow-md ${borderColor}`}>
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-[.06em] mb-1">{label}</div>
            <div className={`text-[26px] font-extrabold leading-[1.1] ${colorClass === 'slate' ? 'text-slate-900' : textColor}`}>
                {value}
                {unit && <span className="text-[12px] font-medium text-slate-400 ml-1">{unit}</span>}
            </div>
        </div>
    );
}
