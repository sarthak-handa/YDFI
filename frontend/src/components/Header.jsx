import React from 'react';

export default function Header({ fileName, onCSVUpload }) {
    return (
        <>
            <header className="bg-white h-16 flex items-center justify-between px-6 border-b border-slate-200 sticky top-0 z-50">
                <div className="flex items-center gap-[14px]">
                    <img src="/src/assets/images/YDLOGO.png" alt="Yogiji Digi" className="h-10" />
                    <div>
                        <h1 className="text-[16px] font-extrabold text-slate-900 tracking-[.04em] leading-tight">ACPPL GI FURNACE</h1>
                        <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-[.06em]">Industrial Furnace Analytics</p>
                    </div>
                </div>
                <div className="flex items-center gap-[6px]">
                    <button className="bg-transparent border-none font-sans text-[13px] font-semibold text-slate-600 py-2 px-4 rounded-md cursor-pointer flex items-center gap-[6px] transition-all duration-150 hover:bg-slate-100 hover:text-slate-900"><i className="fa-solid fa-chart-line"></i> Custom Trends</button>
                    <button className="bg-transparent border-none font-sans text-[13px] font-semibold text-slate-600 py-2 px-4 rounded-md cursor-pointer flex items-center gap-[6px] transition-all duration-150 hover:bg-slate-100 hover:text-slate-900"><i className="fa-solid fa-file-lines"></i> Reports</button>
                    <button className="bg-transparent border-none font-sans text-[13px] font-semibold text-slate-600 py-2 px-4 rounded-md cursor-pointer flex items-center gap-[6px] transition-all duration-150 hover:bg-slate-100 hover:text-slate-900"><i className="fa-solid fa-bolt"></i> Back to Live View</button>
                    <label className="cursor-pointer bg-blue-500 text-white font-sans text-[12px] font-semibold py-2 px-4 rounded-md flex items-center gap-[6px] transition-colors duration-150 hover:bg-blue-600" htmlFor="csvFile"><i className="fa-solid fa-upload"></i> Load CSV</label>
                    <input type="file" id="csvFile" accept=".csv" style={{ display: 'none' }} onChange={onCSVUpload} />
                    <span className="text-[10px] text-slate-500 max-w-[150px] overflow-hidden text-ellipsis whitespace-nowrap">{fileName}</span>
                </div>
            </header>

            <div className="bg-slate-900 py-3 px-6 flex items-center gap-4 flex-wrap">
                <div className="flex items-center gap-2">
                    <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-[.05em]">Start</span>
                    <input type="date" className="filter-input bg-white/10 border border-white/15 text-white font-sans text-[12px] py-[7px] px-3 rounded-md outline-none" defaultValue="2026-07-17" />
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-[.05em]">End</span>
                    <input type="date" className="filter-input bg-white/10 border border-white/15 text-white font-sans text-[12px] py-[7px] px-3 rounded-md outline-none" defaultValue="2026-07-20" />
                </div>
                <div className="flex gap-1 ml-auto">
                    <button className="bg-white/5 border border-white/10 text-slate-300 font-sans text-[12px] font-semibold py-[6px] px-[14px] rounded-md cursor-pointer transition-all duration-150 hover:bg-white/15 hover:text-white">1D</button>
                    <button className="bg-blue-500 border border-blue-500 text-white font-sans text-[12px] font-semibold py-[6px] px-[14px] rounded-md cursor-pointer transition-all duration-150">7D</button>
                    <button className="bg-white/5 border border-white/10 text-slate-300 font-sans text-[12px] font-semibold py-[6px] px-[14px] rounded-md cursor-pointer transition-all duration-150 hover:bg-white/15 hover:text-white">30D</button>
                    <button className="bg-white/5 border border-white/10 text-slate-300 font-sans text-[12px] font-semibold py-[6px] px-[14px] rounded-md cursor-pointer transition-all duration-150 hover:bg-white/15 hover:text-white">6M</button>
                    <button className="bg-white/5 border border-white/10 text-slate-300 font-sans text-[12px] font-semibold py-[6px] px-[14px] rounded-md cursor-pointer transition-all duration-150 hover:bg-white/15 hover:text-white">1Y</button>
                </div>
            </div>
        </>
    );
}
