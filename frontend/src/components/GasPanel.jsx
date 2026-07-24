import React from 'react';
import { Pie } from 'react-chartjs-2';
import 'chart.js/auto';
import { C } from '../utils/chartHelpers';

export default function GasPanel({ configFactory, labels, data, colors, rawData }) {
    const config = configFactory(labels, data, colors);

    return (
        <div className="bg-white rounded-xl border border-slate-200 p-[14px_16px] flex flex-col shadow-sm transition-all duration-150 hover:border-slate-300 hover:shadow-md">
            <div className="flex justify-between items-center mb-2">
                <h3 className="text-[12px] font-extrabold text-slate-800 uppercase tracking-[.04em] flex items-center gap-[6px]">
                    <i className="fa-solid fa-pie-chart" style={{ color: C.cyan }}></i> Atmosphere &amp; Combustion
                </h3>
                <span className="text-[10px] text-slate-500 font-semibold bg-slate-100 py-[2px] px-2 rounded">Single Pie Chart Overview</span>
            </div>
            <div className="h-[320px] w-full relative flex-grow">
                <Pie data={config.data} options={config.options} />
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
    );
}
