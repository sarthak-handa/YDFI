import React, { useState } from 'react';
import { Chart } from 'react-chartjs-2';
import 'chart.js/auto';
import { C, gasLollipopChartConfig, gasClusteredColumnLineConfig } from '../utils/chartHelpers';

export default function GasPanel({ rawData }) {
    const [isZoomed, setIsZoomed] = useState(false);
    const [showInfo, setShowInfo] = useState(false);
    const [isFlipped, setIsFlipped] = useState(false);

    // 7 Executive Gas & Blower Parameters
    const paramsData = [
        { name: 'Fume Exh Blower', shortName: 'Fume Blower', rawVal: 1089, unit: 'rpm', target: 1100, limit: 1200, normalized: 90.8, targetNorm: 91.7, limitNorm: 100, color: C.cyan },
        { name: 'Comb Blower 1', shortName: 'Comb Blower', rawVal: 2387, unit: 'rpm', target: 2400, limit: 2500, normalized: 95.5, targetNorm: 96.0, limitNorm: 100, color: C.purple },
        { name: 'O2', shortName: 'O2', rawVal: 37.0, unit: 'ppm', target: 40.0, limit: 50.0, normalized: 74.0, targetNorm: 80.0, limitNorm: 100, color: C.red },
        { name: 'Dew Point', shortName: 'Dew Point', rawVal: -25.1, unit: '°C', target: -25.0, limit: -20.0, normalized: 80.3, targetNorm: 80.0, limitNorm: 100, color: C.slate },
        { name: 'H2', shortName: 'H2', rawVal: 20.1, unit: '%', target: 20.0, limit: 25.0, normalized: 80.4, targetNorm: 80.0, limitNorm: 100, color: C.indigo },
        { name: 'H2 Flow', shortName: 'H2 Flow', rawVal: rawData?.avgH2 ? rawData.avgH2.toFixed(1) : 28.8, unit: 'Nm³/h', target: 30.0, limit: 35.0, normalized: 82.3, targetNorm: 85.7, limitNorm: 100, color: C.teal },
        { name: 'N2 Flow', shortName: 'N2 Flow', rawVal: rawData?.avgN2 ? rawData.avgN2.toFixed(1) : 243.8, unit: 'Nm³/h', target: 250.0, limit: 300.0, normalized: 81.3, targetNorm: 83.3, limitNorm: 100, color: C.orange }
    ];

    const config = isFlipped 
        ? gasClusteredColumnLineConfig(paramsData)
        : gasLollipopChartConfig(paramsData);

    return (
        <>
            <div className="bg-white rounded-xl border border-slate-200 p-3 sm:p-[14px_16px] flex flex-col shadow-sm transition-all duration-150 hover:border-slate-300 hover:shadow-md w-full min-w-0">
                
                {/* SINGLE HEADER BAR WITH FLIP BUTTON */}
                <div className="flex justify-between items-center mb-3 pb-2.5 border-b border-slate-100 flex-wrap gap-2">
                    <div className="flex items-center gap-2 flex-wrap">
                        <span className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center text-[13px] sm:text-[14px] text-white shrink-0 shadow-xs bg-cyan-500">
                            <i className="fa-solid fa-wind"></i>
                        </span>
                        <div>
                            <h3 className="text-[12px] sm:text-[13px] font-extrabold text-slate-900 uppercase tracking-[.04em] break-words">
                                Gas &amp; Atmosphere Parameters
                            </h3>
                            <p className="text-[9px] sm:text-[10px] text-slate-400 font-bold uppercase">
                                {isFlipped ? 'Clustered Column + Line View' : 'Multi-Series Horizontal Lollipop View'}
                            </p>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-2 shrink-0 ml-auto flex-wrap">
                        {/* FLIP VIEW BUTTON */}
                        <button 
                            onClick={() => setIsFlipped(!isFlipped)}
                            title="Flip Chart View"
                            className="bg-slate-900 hover:bg-blue-600 text-white font-bold py-1.5 px-3 rounded-lg text-[10px] sm:text-[11px] flex items-center gap-1.5 transition-all shadow-xs cursor-pointer whitespace-nowrap"
                        >
                            <i className="fa-solid fa-arrows-rotate"></i> Flip View
                        </button>

                        <div className="flex items-center gap-1">
                            {/* INFO BUTTON */}
                            <button 
                                onClick={() => setShowInfo(true)}
                                title="Gas Panel Info"
                                className="w-6 h-6 sm:w-7 sm:h-7 rounded-md bg-slate-100 text-slate-600 hover:bg-cyan-50 hover:text-cyan-600 transition-colors flex items-center justify-center text-[10px] sm:text-[11px] font-bold cursor-pointer border border-slate-200/60 shrink-0"
                            >
                                <i className="fa-solid fa-circle-info"></i>
                            </button>
                            {/* ZOOM / FULLSCREEN BUTTON */}
                            <button 
                                onClick={() => setIsZoomed(true)}
                                title="Full Screen View"
                                className="w-6 h-6 sm:w-7 sm:h-7 rounded-md bg-slate-100 text-slate-600 hover:bg-cyan-50 hover:text-cyan-600 transition-colors flex items-center justify-center text-[10px] sm:text-[11px] font-bold cursor-pointer border border-slate-200/60 shrink-0"
                            >
                                <i className="fa-solid fa-expand"></i>
                            </button>
                        </div>
                    </div>
                </div>

                {/* CHART CONTAINER */}
                <div className="h-[240px] sm:h-[270px] md:h-[300px] xl:h-[340px] w-full relative flex-grow min-w-0">
                    <Chart type={config.type} data={config.data} options={config.options} />
                </div>

                {/* SUMMARY CHIPS */}
                <div className="flex justify-center gap-1.5 sm:gap-[10px] flex-wrap pt-2 sm:pt-[10px] border-t border-slate-100 mt-2">
                    {paramsData.map((p, i) => (
                        <div key={i} className="bg-slate-50 border border-slate-200 py-1 px-2 sm:py-[5px] sm:px-2.5 rounded-md flex items-center gap-1 sm:gap-[6px]">
                            <span className="w-2 h-2 rounded-full shrink-0" style={{ background: p.color }}></span>
                            <span className="text-[9px] sm:text-[10px] font-bold text-slate-500 uppercase whitespace-nowrap">{p.shortName}</span>
                            <span className="text-[11px] sm:text-[12px] font-extrabold text-slate-900 whitespace-nowrap">{p.rawVal} {p.unit}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* INFO MODAL */}
            {showInfo && (
                <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
                    <div className="bg-white rounded-2xl max-w-md w-full p-4 sm:p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150 max-h-[92vh] overflow-y-auto">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
                            <div className="flex items-center gap-2">
                                <span className="w-8 h-8 rounded-lg bg-cyan-100 text-cyan-600 flex items-center justify-center text-[14px]">
                                    <i className="fa-solid fa-circle-info"></i>
                                </span>
                                <div>
                                    <h4 className="text-[13px] sm:text-[14px] font-extrabold text-slate-900 uppercase">Gas &amp; Atmosphere Parameters</h4>
                                    <p className="text-[9px] sm:text-[10px] text-slate-400 font-semibold uppercase">Executive View Documentation</p>
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
                            <p>Provides dual executive views for total visibility: Multi-Series Horizontal Lollipop view for immediate row-by-row parameter tracking and Clustered Column + Line view for target limit comparison.</p>
                            <div className="bg-slate-50 rounded-xl p-3 border border-slate-200/80 text-[11px] sm:text-[12px]">
                                <div className="font-bold text-slate-700 mb-1">Tracked Parameters (7):</div>
                                <ul className="list-disc pl-4 space-y-1 text-slate-600">
                                    <li>Fume Exh Blower (rpm)</li>
                                    <li>Comb Blower 1 (rpm)</li>
                                    <li>O2 Purity (ppm)</li>
                                    <li>Dew Point (°C)</li>
                                    <li>H2 Conc (%) &amp; Flow (Nm³/h)</li>
                                    <li>N2 Flow (Nm³/h)</li>
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
                                <span className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl shadow-xs text-white flex items-center justify-center text-[14px] sm:text-[16px] shrink-0 bg-cyan-500">
                                    <i className="fa-solid fa-wind"></i>
                                </span>
                                <div>
                                    <h3 className="text-[14px] sm:text-[16px] font-extrabold text-slate-900 uppercase tracking-[.04em]">Gas &amp; Atmosphere Parameters — Full Screen</h3>
                                    <p className="text-[10px] sm:text-[11px] text-slate-500 font-semibold">{isFlipped ? 'Clustered Column + Line Analysis' : 'Horizontal Lollipop Executive Overview'}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 ml-auto">
                                <button 
                                    onClick={() => setIsFlipped(!isFlipped)}
                                    className="py-1.5 px-3 rounded-lg bg-slate-900 hover:bg-blue-600 text-white font-bold text-[11px] sm:text-[12px] flex items-center gap-1.5 transition-colors cursor-pointer"
                                >
                                    <i className="fa-solid fa-arrows-rotate"></i> Flip View
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
