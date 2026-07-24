import React, { useState } from 'react';
import { Chart } from 'react-chartjs-2';
import 'chart.js/auto';

export default function ZoneTemperatureChart({ 
    title, 
    subtitle, 
    iconNode, 
    iconColor = '#3b82f6', 
    accentClass = 'border-t-blue-500',
    mode,
    configFactory, 
    labels, 
    spData, 
    pvData, 
    yTitle,
    infoText,
    isJcfHbr = false,
    jcfHbrArgs = null
}) {
    const [isZoomed, setIsZoomed] = useState(false);
    const [showInfo, setShowInfo] = useState(false);

    // Build chart config
    const config = isJcfHbr && jcfHbrArgs
        ? configFactory(jcfHbrArgs.jcfLabels, jcfHbrArgs.jcfSp, jcfHbrArgs.jcfPv, jcfHbrArgs.hbrLabel, jcfHbrArgs.hbrSp, jcfHbrArgs.hbrPv, yTitle)
        : configFactory(labels, spData, pvData, yTitle);

    const defaultInfo = infoText || `${title}: Monitors real-time process set points (SP) and actual process values (PV) in ${yTitle.includes('°C') ? '°C' : yTitle}.`;

    // Mode Badge Logic
    let modeClass = 'bg-amber-50 text-amber-700 border-amber-200';
    let modeDotClass = 'bg-amber-500';
    let modeText = 'MANUAL';
    
    if (mode) {
        const m = mode.toUpperCase().trim();
        if (m === 'AUTO') {
            modeClass = 'bg-emerald-50 text-emerald-700 border-emerald-200';
            modeDotClass = 'bg-emerald-500';
            modeText = 'AUTO';
        } else if (m === 'SEMI-AUTO' || m === 'SEMI_AUTO' || m === 'SEMI AUTO') {
            modeClass = 'bg-sky-50 text-sky-700 border-sky-200';
            modeDotClass = 'bg-sky-500';
            modeText = 'SEMI-AUTO';
        }
    }

    return (
        <>
            {/* STANDARD CRM CARD VIEW */}
            <div className={`bg-white rounded-[10px] border-t-2 border-l border-r border-b border-l-slate-100 border-r-slate-100 border-b-slate-100 shadow-[0_2px_8px_rgba(0,0,0,0.06)] flex flex-col ${accentClass}`}>
                
                {/* CHART HEADER (52px height) */}
                <div className="h-[52px] px-[16px] flex justify-between items-center border-b border-slate-100">
                    <div className="flex items-center gap-2">
                        <span className="w-[24px] h-[24px] rounded-[6px] text-[12px] flex items-center justify-center text-white shadow-sm" style={{ backgroundColor: iconColor }}>
                            {iconNode}
                        </span>
                        <h3 className="text-[13px] font-semibold text-slate-800 uppercase tracking-[.02em] m-0">
                            {title}
                        </h3>
                        {subtitle && (
                            <span className="text-[12px] text-slate-500 font-normal ml-1 hidden sm:inline-block">
                                {subtitle}
                            </span>
                        )}
                    </div>
                    
                    <div className="flex items-center gap-3">
                        {mode && (
                            <div className={`text-[11px] font-bold px-[10px] py-[4px] rounded-[6px] tracking-[.03em] inline-flex items-center gap-[6px] border ${modeClass}`}>
                                <span className={`w-[6px] h-[6px] rounded-full ${modeDotClass}`}></span> 
                                <span>{modeText}</span>
                            </div>
                        )}
                        <div className="flex items-center gap-1">
                            {/* INFO BUTTON */}
                            <button 
                                onClick={() => setShowInfo(true)}
                                title="Stage Information"
                                className="w-[28px] h-[28px] rounded-[6px] bg-transparent text-slate-400 hover:bg-slate-100 hover:text-slate-900 transition-colors flex items-center justify-center text-[12px] cursor-pointer"
                            >
                                <i className="fa-solid fa-circle-info"></i>
                            </button>
                            {/* ZOOM / FULLSCREEN BUTTON */}
                            <button 
                                onClick={() => setIsZoomed(true)}
                                title="Full Screen View"
                                className="w-[28px] h-[28px] rounded-[6px] bg-transparent text-slate-400 hover:bg-slate-100 hover:text-slate-900 transition-colors flex items-center justify-center text-[12px] cursor-pointer"
                            >
                                <i className="fa-solid fa-expand"></i>
                            </button>
                        </div>
                    </div>
                </div>

                {/* CHART CONTENT AREA */}
                <div className="p-[20px] flex flex-col flex-grow">
                    <div className="h-[320px] w-full relative">
                        <Chart type={config.type} data={config.data} options={config.options} />
                    </div>
                </div>
            </div>

            {/* INFO MODAL */}
            {showInfo && (
                <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-white rounded-[10px] max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-150">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
                            <div className="flex items-center gap-3">
                                <span className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center text-[14px]">
                                    <i className="fa-solid fa-circle-info"></i>
                                </span>
                                <div>
                                    <h4 className="text-[14px] font-bold text-slate-900 uppercase tracking-wide">{title}</h4>
                                    <p className="text-[11px] text-slate-500 font-medium">Stage Documentation</p>
                                </div>
                            </div>
                            <button 
                                onClick={() => setShowInfo(false)}
                                className="w-8 h-8 rounded-lg bg-slate-100 text-slate-500 hover:bg-slate-200 flex items-center justify-center text-sm cursor-pointer"
                            >
                                <i className="fa-solid fa-xmark"></i>
                            </button>
                        </div>
                        <div className="text-[13px] text-slate-600 leading-relaxed mb-6 space-y-3">
                            <p>{defaultInfo}</p>
                            <div className="bg-slate-50 rounded-[10px] p-4 border border-slate-200/80 text-[12px]">
                                <div className="font-semibold text-slate-700 mb-2">Key Specifications:</div>
                                <ul className="list-none space-y-1 text-slate-600">
                                    <li><strong>Unit of Measure:</strong> {yTitle.includes('°C') ? 'Degree Celsius (°C)' : yTitle}</li>
                                    <li><strong>Control Mode:</strong> Real-time SP vs PV tracking</li>
                                    <li><strong>Scale:</strong> Dynamic height optimization</li>
                                </ul>
                            </div>
                        </div>
                        <button 
                            onClick={() => setShowInfo(false)}
                            className="w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold py-2.5 rounded-[10px] text-[13px] transition-colors"
                        >
                            Close Info
                        </button>
                    </div>
                </div>
            )}

            {/* ZOOM MODAL (FULLSCREEN) */}
            {isZoomed && (
                <div className="fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-white rounded-[10px] w-full max-w-6xl h-[88vh] p-6 flex flex-col shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-150 relative">
                        
                        <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4 shrink-0">
                            <div className="flex items-center gap-3">
                                <span className="w-9 h-9 rounded-[10px] shadow-sm text-white flex items-center justify-center text-[16px]" style={{ backgroundColor: iconColor }}>
                                    <i className="fa-solid fa-expand"></i>
                                </span>
                                <div>
                                    <h3 className="text-[16px] font-bold text-slate-900 uppercase tracking-wide">{title} — Full Screen View</h3>
                                    <p className="text-[11px] text-slate-500 font-medium">Detailed Parameter Analysis</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <button 
                                    onClick={() => setShowInfo(true)}
                                    className="px-4 h-[36px] rounded-[8px] bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-[12px] flex items-center gap-2 transition-colors"
                                >
                                    <i className="fa-solid fa-circle-info"></i> Info
                                </button>
                                <button 
                                    onClick={() => setIsZoomed(false)}
                                    title="Close Fullscreen"
                                    className="w-9 h-9 rounded-[10px] bg-slate-100 text-slate-600 hover:bg-red-50 hover:text-red-600 flex items-center justify-center text-lg transition-colors cursor-pointer"
                                >
                                    <i className="fa-solid fa-xmark"></i>
                                </button>
                            </div>
                        </div>

                        <div className="flex-grow w-full relative bg-slate-50/50 rounded-[10px] p-5 border border-slate-100 min-h-0">
                            <Chart type={config.type} data={config.data} options={config.options} />
                        </div>
                        
                        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[12px] text-slate-500 shrink-0 font-medium">
                            <span>Press <kbd className="px-1.5 py-0.5 bg-slate-100 border border-slate-300 rounded-[6px] font-mono text-[11px]">ESC</kbd> or click Close to return</span>
                            <span className="font-semibold text-slate-700">ACPPL GI Furnace High-Precision Analytics</span>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
