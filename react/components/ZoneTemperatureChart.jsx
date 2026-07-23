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
        <div className="chart-card">
            <div className="chart-header">
                <h3 className="chart-title">
                    <span style={{ color: iconColor }}>{iconNode}</span> {title}
                </h3>
                <span className="chart-subtitle">{subtitle}</span>
            </div>
            <div className="chart-wrapper">
                <Chart type={config.type} data={config.data} options={config.options} />
            </div>
        </div>
    );
}
