import React from 'react';

export default function KPICard({ label, value, unit, colorClass }) {
    return (
        <div className={`kpi-card ${colorClass}`}>
            <div className="kpi-label">{label}</div>
            <div className="kpi-value">
                {value}
                {unit && <span className="kpi-unit">{unit}</span>}
            </div>
        </div>
    );
}
