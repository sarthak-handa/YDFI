import React from 'react';
import { Chart } from 'react-chartjs-2';
import 'chart.js/auto';

export default function ZoneTemperatureChart({ 
    title, 
    subtitle, 
    iconNode, 
    iconColor, 
    configFactory, 
    labels, 
    spData, 
    pvData, 
    yTitle 
}) {
    const config = configFactory(labels, spData, pvData, yTitle);

    return (
        <div className="bg-white rounded-xl border border-slate-200 p-[14px_16px] flex flex-col shadow-sm transition-all duration-150 hover:border-slate-300 hover:shadow-md">
            <div className="flex justify-between items-center mb-2">
                <h3 className="text-[12px] font-extrabold text-slate-800 uppercase tracking-[.04em] flex items-center gap-[6px]">
                    <span style={{ color: iconColor }}>{iconNode}</span> {title}
                </h3>
                <span className="text-[10px] text-slate-500 font-semibold bg-slate-100 py-[2px] px-2 rounded">{subtitle}</span>
            </div>
            <div className="h-[320px] w-full relative flex-grow">
                <Chart type={config.type} data={config.data} options={config.options} />
            </div>
        </div>
    );
}
