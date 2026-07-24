import React, { useState } from 'react';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';
import { C } from '../utils/chartHelpers';

export default function GasPanel({ configFactory, labels, data, colors, rawData, accentClass = 'border-t-cyan-500' }) {
    const [isZoomed, setIsZoomed] = useState(false);
    const [showInfo, setShowInfo] = useState(false);

    const config = configFactory(labels, data, colors);

    return (
        <>
            {/* STANDARD CRM CARD VIEW */}
            <div className={`bg-white rounded-[10px] border-t-2 border-l border-r border-b border-l-slate-100 border-r-slate-100 border-b-slate-100 shadow-[0_2px_8px_rgba(0,0,0,0.06)] flex flex-col ${accentClass}`}>
                
                {/* CHART HEADER (52px height) */}
                <div className="h-[52px] px-[16px] flex justify-between items-center border-b border-slate-100">
                    <div className="flex items-center gap-2">
                        <span className="w-[24px] h-[24px] rounded-[6px] text-[12px] flex items-center justify-center text-white shadow-sm" style={{ backgroundColor: C.cyan }}>
                            <i className="fa-solid fa-wind"></i>
                        </span>
                        <h3 className="text-[13px] font-semibold text-slate-800 uppercase tracking-[.02em] m-0">
                            Atmosphere Params
                        </h3>
                        <span className="text-[12px] text-slate-500 font-normal ml-1 hidden sm:inline-block">
                            Gas/Comb
                        </span>
                    </div>
                    
                    <div className="flex items-center gap-1">
                        {/* INFO BUTTON */}
                        <button 
                            onClick={() => setShowInfo(true)}
                            title="Gas Panel Info"
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

                {/* CHART CONTENT AREA */}
                <div className="p-[20px] flex flex-col flex-grow">
                    <div className="h-[320px] w-full relative">
                        <Bar data={config.data} options={config.options} />
                    </div>
                    
                    <div className="flex justify-center gap-[10px] flex-wrap pt-[12px] border-t border-slate-100 mt-[12px]">
                        <div className="bg-slate-50 border border-slate-200 py-[6px] px-3 rounded-[6px] flex items-center gap-[6px]">
                            <span className="w-2 h-2 rounded-full" style={{ background: C.cyan }}></span>
                            <span className="text-[11px] font-semibold text-slate-500 uppercase">H₂ Flow</span>
                            <span className="text-[13px] font-bold text-slate-900">{rawData.avgH2.toFixed(1)} Nm³/h</span>
                        </div>
                        <div className="bg-slate-50 border border-slate-200 py-[6px] px-3 rounded-[6px] flex items-center gap-[6px]">
                            <span className="w-2 h-2 rounded-full" style={{ background: C.purple }}></span>
                            <span className="text-[11px] font-semibold text-slate-500 uppercase">N₂ Flow</span>
                            <span className="text-[13px] font-bold text-slate-900">{rawData.avgN2.toFixed(1)} Nm³/h</span>
                        </div>
                        <div className="bg-slate-50 border border-slate-200 py-[6px] px-3 rounded-[6px] flex items-center gap-[6px]">
                            <span className="w-2 h-2 rounded-full" style={{ background: C.red }}></span>
                            <span className="text-[11px] font-semibold text-slate-500 uppercase">O₂ Level</span>
                            <span className="text-[13px] font-bold text-slate-900">{rawData.avgO2.toFixed(1)} ppm</span>
                        </div>
                        <div className="bg-slate-50 border border-slate-200 py-[6px] px-3 rounded-[6px] flex items-center gap-[6px]">
                            <span className="w-2 h-2 rounded-full" style={{ background: C.slate }}></span>
                            <span className="text-[11px] font-semibold text-slate-500 uppercase">Dew Point</span>
                            <span className="text-[13px] font-bold text-slate-900">{rawData.avgDewPt.toFixed(1)} °C</span>
                        </div>
                        <div className="bg-slate-50 border border-slate-200 py-[6px] px-3 rounded-[6px] flex items-center gap-[6px]">
                            <span className="w-2 h-2 rounded-full" style={{ background: C.indigo }}></span>
                            <span className="text-[11px] font-semibold text-slate-500 uppercase">Comb Air Press</span>
                            <span className="text-[13px] font-bold text-slate-900">{rawData.avgCombPV.toFixed(0)} mmwc</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* INFO MODAL */}
            {showInfo && (
                <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-white rounded-[10px] max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-150">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
                            <div className="flex items-center gap-3">
                                <span className="w-8 h-8 rounded-lg bg-cyan-50 text-cyan-600 flex items-center justify-center text-[14px]">
                                    <i className="fa-solid fa-circle-info"></i>
                                </span>
                                <div>
                                    <h4 className="text-[14px] font-bold text-slate-900 uppercase tracking-wide">Gas &amp; Atmosphere Parameters</h4>
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
                            <p>Monitors critical protective gas composition, furnace atmosphere purity, and combustion air pressure levels to prevent oxidation and ensure surface quality during annealing.</p>
                            <div className="bg-slate-50 rounded-[10px] p-4 border border-slate-200/80 text-[12px]">
                                <div className="font-semibold text-slate-700 mb-2">Key Specifications:</div>
                                <ul className="list-none space-y-1 text-slate-600">
                                    <li><strong>H₂ / N₂ Flow:</strong> Measured in Nm³/h</li>
                                    <li><strong>O₂ Purity:</strong> Parts per million (ppm)</li>
                                    <li><strong>Dew Point:</strong> Temperature in degree Celsius (°C)</li>
                                    <li><strong>Combustion Air:</strong> Pressure in mmwc</li>
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
                                <span className="w-9 h-9 rounded-[10px] shadow-sm text-white flex items-center justify-center text-[16px]" style={{ backgroundColor: C.cyan }}>
                                    <i className="fa-solid fa-expand"></i>
                                </span>
                                <div>
                                    <h3 className="text-[16px] font-bold text-slate-900 uppercase tracking-wide">Gas &amp; Atmosphere Parameters — Full Screen View</h3>
                                    <p className="text-[11px] text-slate-500 font-medium">Comprehensive Atmospheric Composition Overview</p>
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
                            <Bar data={config.data} options={config.options} />
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
