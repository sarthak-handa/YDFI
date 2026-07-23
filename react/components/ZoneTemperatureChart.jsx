import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

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
    const canvasRef = useRef(null);
    const chartInstance = useRef(null);

    useEffect(() => {
        if (chartInstance.current) {
            chartInstance.current.destroy();
        }

        const ctx = canvasRef.current.getContext('2d');
        const config = configFactory(labels, spData, pvData, yTitle);
        
        chartInstance.current = new Chart(ctx, config);

        return () => {
            if (chartInstance.current) {
                chartInstance.current.destroy();
            }
        };
    }, [configFactory, labels, spData, pvData, yTitle]);

    return (
        <div className="chart-card">
            <div className="chart-header">
                <h3 className="chart-title">
                    <span style={{ color: iconColor }}>{iconNode}</span> {title}
                </h3>
                <span className="chart-subtitle">{subtitle}</span>
            </div>
            <div className="chart-wrapper">
                <canvas ref={canvasRef}></canvas>
            </div>
        </div>
    );
}
