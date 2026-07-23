import React from 'react';
import { Pie } from 'react-chartjs-2';
import 'chart.js/auto';
import { C } from '../utils/chartHelpers';

export default function GasPanel({ configFactory, labels, data, colors, rawData }) {
    const config = configFactory(labels, data, colors);

    return (
        <div className="chart-card">
            <div className="chart-header">
                <h3 className="chart-title">
                    <i className="fa-solid fa-pie-chart" style={{ color: C.cyan }}></i> Atmosphere &amp; Combustion
                </h3>
                <span className="chart-subtitle">Single Pie Chart Overview</span>
            </div>
            <div className="chart-wrapper">
                <Pie data={config.data} options={config.options} />
            </div>
            <div className="gas-summary-chips">
                <div className="gas-chip">
                    <span className="chip-dot" style={{ background: C.cyan }}></span>
                    <span className="chip-label">H₂ Flow</span>
                    <span className="chip-val">{rawData.avgH2.toFixed(1)} Nm³/h</span>
                </div>
                <div className="gas-chip">
                    <span className="chip-dot" style={{ background: C.purple }}></span>
                    <span className="chip-label">N₂ Flow</span>
                    <span className="chip-val">{rawData.avgN2.toFixed(1)} Nm³/h</span>
                </div>
                <div className="gas-chip">
                    <span className="chip-dot" style={{ background: C.red }}></span>
                    <span className="chip-label">O₂ Level</span>
                    <span className="chip-val">{rawData.avgO2.toFixed(1)} ppm</span>
                </div>
                <div className="gas-chip">
                    <span className="chip-dot" style={{ background: C.slate }}></span>
                    <span className="chip-label">Dew Point</span>
                    <span className="chip-val">{rawData.avgDewPt.toFixed(1)} °C</span>
                </div>
                <div className="gas-chip">
                    <span className="chip-dot" style={{ background: C.indigo }}></span>
                    <span className="chip-label">Comb Air Press</span>
                    <span className="chip-val">{rawData.avgCombPV.toFixed(0)} mmwc</span>
                </div>
            </div>
        </div>
    );
}
