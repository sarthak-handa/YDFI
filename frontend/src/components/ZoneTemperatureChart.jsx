import React, { useState } from 'react';
import { Chart } from 'react-chartjs-2';
import 'chart.js/auto';

export default function ZoneTemperatureChart({ 
    title, 
    subtitle, 
    iconNode, 
    iconColor = '#3b82f6', 
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

    return (
        <>
            {/* STANDARD CARD VIEW */}
            <div className="bg-white rounded-xl border border-slate-200 p-3 sm:p-[14px_16px] flex flex-col shadow-sm transition-all duration-150 hover:border-slate-300 hover:shadow-md w-full min-w-0">
                <div className="flex justify-between items-center mb-2 flex-wrap gap-2">
                    <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-[11px] sm:text-[12px] font-extrabold text-slate-800 uppercase tracking-[.04em] flex items-center gap-1 sm:gap-[6px] break-words">
                            <span style={{ color: iconColor }}>{iconNode}</span> {title}
                        </h3>
                        {subtitle && (
                            <span className="text-[9px] sm:text-[10px] text-slate-500 font-semibold bg-slate-100 py-[2px] px-2 rounded hidden md:inline-block whitespace-nowrap">
                                {subtitle}
                            </span>
                        )}
                    </div>
                    <div className="flex items-center gap-1 shrink-0 ml-auto">
                        {/* INFO BUTTON */}
                        <button 
                            onClick={() => setShowInfo(true)}
                            title="Stage Information"
                            className="w-6 h-6 sm:w-7 sm:h-7 rounded-md bg-slate-100 text-slate-600 hover:bg-blue-50 hover:text-blue-600 transition-colors flex items-center justify-center text-[10px] sm:text-[11px] font-bold cursor-pointer border border-slate-200/60 shrink-0"
                        >
                            <i className="fa-solid fa-circle-info"></i>
                        </button>
                        {/* ZOOM / FULLSCREEN BUTTON */}
                        <button 
                            onClick={() => setIsZoomed(true)}
                            title="Full Screen View"
                            className="w-6 h-6 sm:w-7 sm:h-7 rounded-md bg-slate-100 text-slate-600 hover:bg-blue-50 hover:text-blue-600 transition-colors flex items-center justify-center text-[10px] sm:text-[11px] font-bold cursor-pointer border border-slate-200/60 shrink-0"
                        >
                            <i className="fa-solid fa-expand"></i>
                        </button>
                    </div>
                </div>

                <div className="h-[220px] sm:h-[250px] md:h-[280px] xl:h-[320px] w-full relative flex-grow min-w-0">
                    <Chart type={config.type} data={config.data} options={config.options} />
                </div>
            </div>

            {/* INFO MODAL */}
            {showInfo && (
                <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
                    <div className="bg-white rounded-2xl max-w-md w-full p-4 sm:p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150 max-h-[92vh] overflow-y-auto">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
                            <div className="flex items-center gap-2">
                                <span className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center text-[14px]">
                                    <i className="fa-solid fa-circle-info"></i>
                                </span>
                                <div>
                                    <h4 className="text-[13px] sm:text-[14px] font-extrabold text-slate-900 uppercase">{title}</h4>
                                    <p className="text-[9px] sm:text-[10px] text-slate-400 font-semibold uppercase">Stage Documentation</p>
                                </div>
                            </div>
                            <button 
                                onClick={() => setShowInfo(false)}
                                className="w-8 h-8 rounded-lg bg-slate-100 text-slate-500 hover:bg-slate-200 flex items-center justify-center text-sm cursor-pointer"
                            >
                                <i className="fa-solid fa-xmark"></i>
                            </button>
                        </div>
                        <div className="text-[12px] sm:text-[13px] text-slate-600 leading-relaxed mb-6 space-y-3">
                            <p>{defaultInfo}</p>
                            <div className="bg-slate-50 rounded-xl p-3 border border-slate-200/80 text-[11px] sm:text-[12px]">
                                <div className="font-bold text-slate-700 mb-1">Key Specifications:</div>
                                <ul className="list-disc pl-4 space-y-1 text-slate-600">
                                    <li><strong>Unit of Measure:</strong> {yTitle.includes('°C') ? 'Degree Celsius (°C)' : yTitle}</li>
                                    <li><strong>Control Mode:</strong> Real-time SP (Set Point) vs PV (Process Value) tracking</li>
                                    <li><strong>Scale Optimization:</strong> Dynamic height optimization for clean signal visibility</li>
                                </ul>
                            </div>
                        </div>
                        <button 
                            onClick={() => setShowInfo(false)}
                            className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-2.5 rounded-xl text-[12px] sm:text-[13px] transition-colors"
                        >
                            Close Documentation
                        </button>
                    </div>
                </div>
            )}

            {/* ZOOM MODAL (FULLSCREEN) */}
            {isZoomed && (
                <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4">
                    <div className="bg-white rounded-2xl w-full max-w-6xl h-[94vh] md:h-[88vh] p-3 sm:p-6 flex flex-col shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-3 sm:mb-4 flex-wrap gap-2 shrink-0">
                            <div className="flex items-center gap-2 sm:gap-3">
                                <span className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl shadow-xs text-white flex items-center justify-center text-[14px] sm:text-[16px] shrink-0" style={{ backgroundColor: iconColor }}>
                                    {iconNode}
                                </span>
                                <div>
                                    <h3 className="text-[14px] sm:text-[16px] font-extrabold text-slate-900 uppercase tracking-[.04em]">{title}</h3>
                                    <p className="text-[10px] sm:text-[11px] text-slate-500 font-semibold">Detailed Parameter Analysis ({yTitle})</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 ml-auto">
                                <button 
                                    onClick={() => setShowInfo(true)}
                                    className="py-1.5 px-3 sm:py-2 sm:px-3.5 rounded-lg bg-slate-100 hover:bg-blue-50 hover:text-blue-600 text-slate-700 font-bold text-[11px] sm:text-[12px] flex items-center gap-1.5 transition-colors"
                                >
                                    <i className="fa-solid fa-circle-info"></i> Info
                                </button>
                                <button 
                                    onClick={() => setIsZoomed(false)}
                                    className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-slate-100 text-slate-600 hover:bg-red-50 hover:text-red-600 flex items-center justify-center text-base sm:text-lg transition-colors cursor-pointer"
                                    title="Close Fullscreen"
                                >
                                    <i className="fa-solid fa-xmark"></i>
                                </button>
                            </div>
                        </div>

                        <div className="flex-grow w-full relative bg-slate-50/50 rounded-xl p-2 sm:p-4 border border-slate-100 min-h-[200px]">
                            <Chart type={config.type} data={config.data} options={config.options} />
                        </div>

                        <div className="mt-3 sm:mt-4 pt-2 sm:pt-3 border-t border-slate-100 flex items-center justify-between text-[10px] sm:text-[11px] text-slate-500 shrink-0 flex-wrap gap-1">
                            <span>Press <kbd className="px-1.5 py-0.5 bg-slate-100 border border-slate-300 rounded text-[9px] sm:text-[10px] font-mono text-slate-700">ESC</kbd> or click Close to return</span>
                            <span className="font-bold text-slate-700">ACPPL GI Furnace Analytics</span>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
