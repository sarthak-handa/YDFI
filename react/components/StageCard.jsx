import React from 'react';

export default function StageCard({ title, accentClass, iconNode, mode, children, colsClass = "cols-1" }) {
    const isAuto = mode && mode.toUpperCase() === 'AUTO';
    
    return (
        <div className={`stage-module ${accentClass}`}>
            <div className="stage-head">
                <span className={`stage-icon icon-${accentClass.replace('accent-', '')}`}>
                    {iconNode}
                </span>
                <h2>{title}</h2>
                {mode && (
                    <span className={`mode-badge ${isAuto ? 'mode-auto' : 'mode-manual'}`}>
                        <span className="mode-dot"></span> {isAuto ? 'AUTO' : 'MANUAL'}
                    </span>
                )}
            </div>
            <div className={`stage-charts ${colsClass}`}>
                {children}
            </div>
        </div>
    );
}
