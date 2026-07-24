import React from 'react';

const accents = {
    'accent-phf': { border: 'border-t-blue-500', icon: 'bg-blue-500' },
    'accent-rtf': { border: 'border-t-emerald-500', icon: 'bg-emerald-500' },
    'accent-sf': { border: 'border-t-amber-500', icon: 'bg-amber-500' },
    'accent-jcf': { border: 'border-t-violet-500', icon: 'bg-violet-500' },
    'accent-gas': { border: 'border-t-cyan-500', icon: 'bg-cyan-500' },
};

export default function StageCard({ title, accentClass, iconNode, mode, children, colsClass = "cols-1" }) {
    const isAuto = mode && mode.toUpperCase() === 'AUTO';
    const theme = accents[accentClass] || { border: 'border-t-slate-300', icon: 'bg-slate-400' };
    
    // cols-2 logic with responsive breakpoint (lg: 1024px equivalent)
    const gridClass = colsClass === 'cols-2' ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1';

    return (
        <div className={`bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col border-t-4 ${theme.border}`}>
            <div className="p-[14px_20px] flex items-center gap-[10px] border-b border-slate-100">
                <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-[14px] text-white shrink-0 ${theme.icon}`}>
                    {iconNode}
                </span>
                <h2 className="text-[14px] font-extrabold text-slate-900 uppercase tracking-[.04em]">{title}</h2>
                {mode && (
                    <span className={`text-[11px] font-bold py-1 px-3 rounded-full ml-auto tracking-[.03em] inline-flex items-center gap-[6px] ${isAuto ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-orange-100 text-orange-700 border border-orange-200'}`}>
                        <span className={`w-[7px] h-[7px] rounded-full inline-block ${isAuto ? 'bg-green-600' : 'bg-orange-600'}`}></span> {isAuto ? 'AUTO' : 'MANUAL'}
                    </span>
                )}
            </div>
            <div className={`p-4 grid gap-4 flex-grow ${gridClass}`}>
                {children}
            </div>
        </div>
    );
}
