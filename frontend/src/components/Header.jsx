import React, { useEffect, useRef, useState } from 'react';
import logoImg from '../assets/images/YDLOGO.png';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';

export default function Header({ fileName, onCSVUpload }) {
    const pickerRef = useRef(null);
    const fpInstance = useRef(null);
    const [activePreset, setActivePreset] = useState('7D');
    const [dates, setDates] = useState(['2026-07-17', '2026-07-20']);

    useEffect(() => {
        if (pickerRef.current) {
            fpInstance.current = flatpickr(pickerRef.current, {
                mode: "range",
                dateFormat: "Y-m-d",
                altInput: true,
                altFormat: "d-m-Y",
                defaultDate: dates,
                onClose: (selectedDates) => {
                    if (selectedDates.length === 2) {
                        const start = selectedDates[0].toISOString().split('T')[0];
                        const end = selectedDates[1].toISOString().split('T')[0];
                        setDates([start, end]);
                        setActivePreset(''); // Clear preset highlight if user manually selects range
                    }
                }
            });
        }
        return () => {
            if (fpInstance.current) {
                fpInstance.current.destroy();
            }
        };
    }, []);

    const applyPresetRange = (preset) => {
        setActivePreset(preset);
        let endDate = new Date('2026-07-20');
        let startDate = new Date(endDate);
        switch (preset) {
            case '1D': startDate.setDate(endDate.getDate() - 1); break;
            case '7D': startDate.setDate(endDate.getDate() - 7); break;
            case '30D': startDate.setDate(endDate.getDate() - 30); break;
            case '6M': startDate.setMonth(endDate.getMonth() - 6); break;
            case '1Y': startDate.setFullYear(endDate.getFullYear() - 1); break;
            default: break;
        }
        const startStr = startDate.toISOString().split('T')[0];
        const endStr = endDate.toISOString().split('T')[0];
        setDates([startStr, endStr]);
        if (fpInstance.current) {
            fpInstance.current.setDate([startStr, endStr]);
        }
    };

    return (
        <>
            <header className="bg-white min-h-[64px] h-auto flex flex-wrap items-center justify-between py-2.5 px-4 sm:px-6 gap-3 border-b border-slate-200 sticky top-0 z-50 shadow-xs">
                <div className="flex items-center gap-3 sm:gap-[14px] shrink-0">
                    <img src={logoImg} alt="Yogiji Digi" className="h-8 sm:h-10 w-auto transition-all" />
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
                <div className="flex items-center gap-3 flex-1 min-w-[280px] max-sm:w-full">
                    <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-[.05em] whitespace-nowrap">Duration</span>
                    <div className="relative flex items-center flex-grow max-w-[320px]">
                        <input 
                            ref={pickerRef}
                            type="text" 
                            className="filter-input bg-white/10 border border-white/15 text-white font-sans text-[11px] sm:text-[12px] py-[6px] sm:py-[7px] pl-3 pr-9 rounded-md outline-none w-full cursor-pointer" 
                            placeholder="Select Date Range" 
                        />
                        <i className="fa-regular fa-calendar absolute right-3 text-slate-400 pointer-events-none"></i>
                    </div>
                </div>
                <div className="flex gap-1.5 sm:gap-1 ml-auto max-sm:ml-0 max-sm:w-full max-sm:justify-between max-sm:mt-1">
                    {['1D', '7D', '30D', '6M', '1Y'].map((preset) => (
                        <button 
                            key={preset}
                            onClick={() => applyPresetRange(preset)}
                            className={`font-sans text-[11px] sm:text-[12px] font-semibold py-[6px] px-[12px] sm:px-[14px] rounded-md cursor-pointer transition-all duration-150 max-sm:flex-1 max-sm:text-center ${
                                activePreset === preset 
                                ? 'bg-blue-500 border border-blue-500 text-white' 
                                : 'bg-white/5 border border-white/10 text-slate-300 hover:bg-white/15 hover:text-white'
                            }`}
                        >
                            {preset}
                        </button>
                    ))}
                </div>
            </div>
        </>
    );
}
