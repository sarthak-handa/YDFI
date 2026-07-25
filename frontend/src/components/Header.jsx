import React from 'react';

export default function Header({ fileName, onCSVUpload }) {
    return (
        <>
            <header className="bg-white min-h-[64px] h-auto flex flex-wrap items-center justify-between py-2.5 px-4 sm:px-6 gap-3 border-b border-slate-200 sticky top-0 z-50 shadow-xs">
                <div className="flex items-center gap-3 sm:gap-[14px] shrink-0">
                    <img src="/src/assets/images/YDLOGO.png" alt="Yogiji Digi" className="h-8 sm:h-10 w-auto transition-all" />
                    <div>
                        <h1 className="text-[14px] sm:text-[16px] font-extrabold text-slate-900 tracking-[.04em] leading-tight">ACPPL GI FURNACE</h1>
                        <p className="text-[9px] sm:text-[10px] text-slate-400 font-semibold uppercase tracking-[.06em]">Industrial Furnace Analytics</p>
                    </div>
                </div>
                <div className="flex items-center gap-1 sm:gap-[6px] flex-wrap max-sm:w-full max-sm:justify-start">
                    <button className="bg-transparent border-none font-sans text-[12px] sm:text-[13px] font-semibold text-slate-600 py-1.5 px-2.5 sm:py-2 sm:px-4 rounded-md cursor-pointer flex items-center gap-1.5 sm:gap-[6px] transition-all duration-150 hover:bg-slate-100 hover:text-slate-900 whitespace-nowrap" title="Custom Trends">
                        <i className="fa-solid fa-chart-line"></i> <span className="hidden lg:inline">Custom Trends</span>
                    </button>
                    <button className="bg-transparent border-none font-sans text-[12px] sm:text-[13px] font-semibold text-slate-600 py-1.5 px-2.5 sm:py-2 sm:px-4 rounded-md cursor-pointer flex items-center gap-1.5 sm:gap-[6px] transition-all duration-150 hover:bg-slate-100 hover:text-slate-900 whitespace-nowrap" title="Reports">
                        <i className="fa-solid fa-file-lines"></i> <span className="hidden lg:inline">Reports</span>
                    </button>
                    <button className="bg-transparent border-none font-sans text-[12px] sm:text-[13px] font-semibold text-slate-600 py-1.5 px-2.5 sm:py-2 sm:px-4 rounded-md cursor-pointer flex items-center gap-1.5 sm:gap-[6px] transition-all duration-150 hover:bg-slate-100 hover:text-slate-900 whitespace-nowrap" title="Back to Live View">
                        <i className="fa-solid fa-bolt"></i> <span className="hidden lg:inline">Back to Live View</span>
                    </button>
                    <label className="cursor-pointer bg-blue-500 text-white font-sans text-[11px] sm:text-[12px] font-semibold py-1.5 px-3 sm:py-2 sm:px-4 rounded-md flex items-center gap-1.5 sm:gap-[6px] transition-colors duration-150 hover:bg-blue-600 whitespace-nowrap" htmlFor="csvFile" title="Load CSV">
                        <i className="fa-solid fa-upload"></i> <span className="hidden lg:inline">Load CSV</span>
                    </label>
                    <input type="file" id="csvFile" accept=".csv" style={{ display: 'none' }} onChange={onCSVUpload} />
                    <span className="text-[10px] text-slate-500 max-w-[100px] sm:max-w-[150px] overflow-hidden text-ellipsis whitespace-nowrap">{fileName}</span>
                </div>
            </header>

            <div className="bg-slate-900 py-2.5 sm:py-3 px-4 sm:px-6 flex items-center gap-3 sm:gap-4 flex-wrap">
                <div className="flex items-center gap-2 flex-1 min-w-[140px] max-sm:justify-between">
                    <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-[.05em]">Start</span>
                    <input type="date" className="filter-input bg-white/10 border border-white/15 text-white font-sans text-[11px] sm:text-[12px] py-[6px] sm:py-[7px] px-2.5 sm:px-3 rounded-md outline-none flex-1 max-sm:max-w-[160px]" defaultValue="2026-07-17" />
                </div>
                <div className="flex items-center gap-2 flex-1 min-w-[140px] max-sm:justify-between">
                    <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-[.05em]">End</span>
                    <input type="date" className="filter-input bg-white/10 border border-white/15 text-white font-sans text-[11px] sm:text-[12px] py-[6px] sm:py-[7px] px-2.5 sm:px-3 rounded-md outline-none flex-1 max-sm:max-w-[160px]" defaultValue="2026-07-20" />
                </div>
                <div className="flex gap-1.5 sm:gap-1 ml-auto max-sm:ml-0 max-sm:w-full max-sm:justify-between max-sm:mt-1">
                    <button className="bg-white/5 border border-white/10 text-slate-300 font-sans text-[11px] sm:text-[12px] font-semibold py-[6px] px-[12px] sm:px-[14px] rounded-md cursor-pointer transition-all duration-150 hover:bg-white/15 hover:text-white max-sm:flex-1 max-sm:text-center">1D</button>
                    <button className="bg-blue-500 border border-blue-500 text-white font-sans text-[11px] sm:text-[12px] font-semibold py-[6px] px-[12px] sm:px-[14px] rounded-md cursor-pointer transition-all duration-150 max-sm:flex-1 max-sm:text-center">7D</button>
                    <button className="bg-white/5 border border-white/10 text-slate-300 font-sans text-[11px] sm:text-[12px] font-semibold py-[6px] px-[12px] sm:px-[14px] rounded-md cursor-pointer transition-all duration-150 hover:bg-white/15 hover:text-white max-sm:flex-1 max-sm:text-center">30D</button>
                    <button className="bg-white/5 border border-white/10 text-slate-300 font-sans text-[11px] sm:text-[12px] font-semibold py-[6px] px-[12px] sm:px-[14px] rounded-md cursor-pointer transition-all duration-150 hover:bg-white/15 hover:text-white max-sm:flex-1 max-sm:text-center">6M</button>
                    <button className="bg-white/5 border border-white/10 text-slate-300 font-sans text-[11px] sm:text-[12px] font-semibold py-[6px] px-[12px] sm:px-[14px] rounded-md cursor-pointer transition-all duration-150 hover:bg-white/15 hover:text-white max-sm:flex-1 max-sm:text-center">1Y</button>
                </div>
            </div>
        </>
    );
}
