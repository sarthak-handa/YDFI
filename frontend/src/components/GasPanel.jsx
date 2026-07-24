import React, { useState } from 'react';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';
import { C } from '../utils/chartHelpers';

export default function GasPanel({ configFactory, labels, data, colors, rawData }) {
    const [isZoomed, setIsZoomed] = useState(false);
    const [showInfo, setShowInfo] = useState(false);

    const config = configFactory(labels, data, colors);

    return (
        <>
            <div className="bg-white rounded-xl border border-slate-200 p-[14px_16px] flex flex-col shadow-sm transition-all duration-150 hover:border-slate-300 hover:shadow-md">
                <div className="flex justify-between items-center mb-2 flex-wrap gap-2">
                    <div className="flex items-center gap-2">
                        <h3 className="text-[12px] font-extrabold text-slate-800 uppercase tracking-[.04em] flex items-center gap-[6px]">
                            <i className="fa-solid fa-chart-column" style={{ color: C.cyan }}></i> Atmosphere &amp; Combustion
                        </h3>
                        <span className="text-[10px] text-slate-500 font-semibold bg-slate-100 py-[2px] px-2 rounded hidden sm:inline-block">
                            Gas Parameter Bar Chart
                        </span>
                    </div>
                    <div className="flex items-center gap-1">
                        {/* INFO BUTTON */}
                        <button 
                            onClick={() => setShowInfo(true)}
                            title="Gas Panel Info"
                            className="w-7 h-7 rounded-md bg-slate-100 text-slate-600 hover:bg-cyan-50 hover:text-cyan-600 transition-colors flex items-center justify-center text-[11px] font-bold cursor-pointer border border-slate-200/60"
                        >
                            <i className="fa-solid fa-circle-info"></i>
                        </button>
                        {/* ZOOM / FULLSCREEN BUTTON */}
                        <button 
                            onClick={() => setIsZoomed(true)}
                            title="Full Screen View"
                            className="w-7 h-7 rounded-md bg-slate-100 text-slate-600 hover:bg-cyan-50 hover:text-cyan-600 transition-colors flex items-center justify-center text-[11px] font-bold cursor-pointer border border-slate-200/60"
                        >
                            <i className="fa-solid fa-expand"></i>
                        </button>
                    </div>
                </div>

                {/* BAR GRAPH INSTEAD OF DONUT/PIE */}
                <div className="h-[320px] w-full relative flex-grow">
                    <Bar data={config.data} options={config.options} />
                </div>

                <div className="flex justify-center gap-[10px] flex-wrap pt-[10px] border-t border-slate-100 mt-2">
                    <div className="bg-slate-50 border border-slate-200 py-[6px] px-3 rounded-md flex items-center gap-[6px]">
                        <span className="w-2 h-2 rounded-full" style={{ background: C.cyan }}></span>
                        <span className="text-[10px] font-bold text-slate-500 uppercase">H₂ Flow</span>
                        <span className="text-[12px] font-extrabold text-slate-900">{rawData.avgH2.toFixed(1)} Nm³/h</span>
                    </div>
                    <div className="bg-slate-50 border border-slate-200 py-[6px] px-3 rounded-md flex items-center gap-[6px]">
                        <span className="w-2 h-2 rounded-full" style={{ background: C.purple }}></span>
                        <span className="text-[10px] font-bold text-slate-500 uppercase">N₂ Flow</span>
                        <span className="text-[12px] font-extrabold text-slate-900">{rawData.avgN2.toFixed(1)} Nm³/h</span>
                    </div>
                    <div className="bg-slate-50 border border-slate-200 py-[6px] px-3 rounded-md flex items-center gap-[6px]">
                        <span className="w-2 h-2 rounded-full" style={{ background: C.red }}></span>
                        <span className="text-[10px] font-bold text-slate-500 uppercase">O₂ Level</span>
                        <span className="text-[12px] font-extrabold text-slate-900">{rawData.avgO2.toFixed(1)} ppm</span>
                    </div>
                    <div className="bg-slate-50 border border-slate-200 py-[6px] px-3 rounded-md flex items-center gap-[6px]">
                        <span className="w-2 h-2 rounded-full" style={{ background: C.slate }}></span>
                        <span className="text-[10px] font-bold text-slate-500 uppercase">Dew Point</span>
                        <span className="text-[12px] font-extrabold text-slate-900">{rawData.avgDewPt.toFixed(1)} °C</span>
                    </div>
                    <div className="bg-slate-50 border border-slate-200 py-[6px] px-3 rounded-md flex items-center gap-[6px]">
                        <span className="w-2 h-2 rounded-full" style={{ background: C.indigo }}></span>
                        <span className="text-[10px] font-bold text-slate-500 uppercase">Comb Air Press</span>
                        <span className="text-[12px] font-extrabold text-slate-900">{rawData.avgCombPV.toFixed(0)} mmwc</span>
                    </div>
                </div>
            </div>

            {/* INFO MODAL */}
            {showInfo && (
                <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
                            <div className="flex items-center gap-2">
                                <span className="w-8 h-8 rounded-lg bg-cyan-100 text-cyan-600 flex items-center justify-center text-[14px]">
                                    <i className="fa-solid fa-circle-info"></i>
                                </span>
                                <div>
                                    <h4 className="text-[14px] font-extrabold text-slate-900 uppercase">Gas &amp; Atmosphere Parameters</h4>
                                    <p className="text-[10px] text-slate-400 font-semibold uppercase">Stage Documentation</p>
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
                            <div className="bg-slate-50 rounded-xl p-3 border border-slate-200/80 text-[12px]">
                                <div className="font-bold text-slate-700 mb-1">Monitored Metrics:</div>
                                <ul className="list-disc pl-4 space-y-1 text-slate-600">
                                    <li><strong>H₂ / N₂ Flow:</strong> Measured in Nm³/h</li>
                                    <li><strong>O₂ Purity:</strong> Parts per million (ppm)</li>
                                    <li><strong>Dew Point:</strong> Temperature in degree Celsius (°C)</li>
                                    <li><strong>Combustion Air:</strong> Pressure in mmwc</li>
                                </ul>
                            </div>
                        </div>
                        <button 
                            onClick={() => setShowInfo(false)}
                            className="w-full bg-slate-900 text-white font-bold text-[13px] py-2.5 rounded-xl hover:bg-slate-800 transition-colors cursor-pointer"
                        >
                            Close Info
                        </button>
                    </div>
                </div>
            )}

            {/* FULLSCREEN ZOOM MODAL */}
            {isZoomed && (
                <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-8">
                    <div className="bg-white rounded-2xl w-full max-w-6xl h-[88vh] p-6 shadow-2xl border border-slate-200 flex flex-col animate-in fade-in zoom-in-95 duration-150">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
                            <div className="flex items-center gap-3">
                                <span className="w-9 h-9 rounded-xl bg-cyan-500 text-white flex items-center justify-center text-[16px] shadow-sm">
                                    <i className="fa-solid fa-chart-column"></i>
                                </span>
                                <div>
                                    <h3 className="text-[16px] font-extrabold text-slate-900 uppercase tracking-[.04em]">
                                        Gas &amp; Atmosphere Parameters — Bar Chart
                                    </h3>
                                    <p className="text-[11px] text-slate-500 font-semibold">
                                        Comprehensive Atmospheric Composition Overview
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <button 
                                    onClick={() => setShowInfo(true)}
                                    className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-[12px] font-bold flex items-center gap-1.5 cursor-pointer"
                                >
                                    <i className="fa-solid fa-circle-info"></i> Info
                                </button>
                                <button 
                                    onClick={() => setIsZoomed(false)}
                                    className="w-9 h-9 rounded-xl bg-slate-100 text-slate-600 hover:bg-red-50 hover:text-red-600 flex items-center justify-center text-lg cursor-pointer transition-colors"
                                >
                                    <i className="fa-solid fa-xmark"></i>
                                </button>
                            </div>
                        </div>

                        <div className="flex-grow w-full relative min-h-0 bg-slate-50/50 rounded-xl p-4 border border-slate-100">
                            <Bar data={config.data} options={config.options} />
                        </div>

                        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-medium">
                            <span>Bar chart visualization with exact unit metrics</span>
                            <span className="font-bold text-slate-700">ACPPL GI Furnace High-Precision Analytics</span>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
