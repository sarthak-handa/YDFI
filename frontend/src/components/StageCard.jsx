import React from 'react';

const accents = {
    'accent-phf': { iconBg: 'bg-blue-500', text: 'text-blue-500' },
    'accent-rtf': { iconBg: 'bg-emerald-500', text: 'text-emerald-500' },
    'accent-sf': { iconBg: 'bg-amber-500', text: 'text-amber-500' },
    'accent-jcf': { iconBg: 'bg-violet-500', text: 'text-violet-500' },
    'accent-gas': { iconBg: 'bg-cyan-500', text: 'text-cyan-500' },
};

export default function StageCard({ title, accentClass, iconNode, mode, children, colsClass = "cols-1" }) {
    const theme = accents[accentClass] || { iconBg: 'bg-slate-500', text: 'text-slate-500' };
    
    // Normalize mode text (AUTO, MANUAL, SEMI-AUTO)
    let modeText = '';
    let modeBadgeStyle = '';
    let modeDotStyle = '';
    
    if (mode) {
        const m = mode.toUpperCase().trim();
        if (m === 'AUTO') {
            modeText = 'AUTO';
            modeBadgeStyle = 'bg-emerald-50 text-emerald-700 border-emerald-200';
            modeDotStyle = 'bg-emerald-500';
        } else if (m === 'SEMI-AUTO' || m === 'SEMI_AUTO' || m === 'SEMI AUTO') {
            modeText = 'SEMI-AUTO';
            modeBadgeStyle = 'bg-sky-50 text-sky-700 border-sky-200';
            modeDotStyle = 'bg-sky-500';
        } else {
            modeText = 'MANUAL';
            modeBadgeStyle = 'bg-amber-50 text-amber-700 border-amber-200';
            modeDotStyle = 'bg-amber-500';
        }
    }

    const gridClass = colsClass === 'cols-2' ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1';

    return (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col transition-all duration-150 hover:shadow-md">
            <div className="p-[14px_20px] flex items-center gap-[10px] border-b border-slate-100 bg-slate-50/50">
                <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-[14px] text-white shrink-0 shadow-xs ${theme.iconBg}`}>
                    {iconNode}
                </span>
                <h2 className="text-[14px] font-extrabold text-slate-900 uppercase tracking-[.04em] flex items-center gap-2">
                    {title}
                </h2>
                {modeText && (
                    <span className={`text-[11px] font-bold py-1 px-3 rounded-full ml-auto tracking-[.03em] inline-flex items-center gap-[6px] border ${modeBadgeStyle}`}>
                        <span className={`w-[7px] h-[7px] rounded-full inline-block ${modeDotStyle}`}></span> {modeText}
                    </span>
                )}
            </div>
            <div className={`p-4 grid gap-4 flex-grow ${gridClass}`}>
                {children}
            </div>
        </div>
    );
}
