export const C = {
    spBlue: '#3b82f6',
    pvGreen: '#10b981',
    cyan: '#06b6d4',
    purple: '#8b5cf6',
    red: '#ef4444',
    slate: '#475569',
    indigo: '#6366f1',
    orange: '#f59e0b',
    teal: '#14b8a6',
    amber: '#d97706'
};

export function commonOptions(yTitle) {
    const isTemp = yTitle && yTitle.includes('°C');
    const isRatio = yTitle && yTitle.includes('Ratio');
    
    return {
        responsive: true,
        maintainAspectRatio: false,
        layout: {
            padding: { top: 16, bottom: 6, left: 6, right: 16 }
        },
        interaction: { mode: 'index', intersect: false },
        plugins: {
            legend: {
                position: 'top',
                labels: {
                    usePointStyle: true,
                    boxWidth: 8,
                    padding: 14,
                    font: { size: 12, weight: '600', family: "'Inter', system-ui, sans-serif" }
                }
            },
            tooltip: {
                padding: 10,
                cornerRadius: 8,
                titleFont: { size: 13, weight: '700', family: "'Inter', system-ui, sans-serif" },
                bodyFont: { size: 13, weight: '500', family: "'Inter', system-ui, sans-serif" },
                callbacks: {
                    title: function(items) {
                        if (!items || !items.length) return '';
                        const l = items[0].label;
                        if (l.startsWith('Z')) return `Zone ${l.replace('Z','')}`;
                        return l;
                    },
                    label: function(ctx) {
                        const label = ctx.dataset.label || '';
                        let unit = '';
                        if (isTemp || label.includes('°C') || label.toLowerCase().includes('temp')) {
                            unit = ' °C';
                        }
                        const valStr = typeof ctx.raw === 'number' ? (isRatio ? ctx.raw.toFixed(2) : ctx.raw.toFixed(1)) : ctx.raw;
                        return `  ${label}: ${valStr}${unit}`;
                    }
                }
            }
        },
        scales: {
            x: {
                title: { display: false },
                grid: { display: false },
                border: { display: true, color: '#1e293b', width: 2 },
                ticks: { font: { weight: '700', size: 11, family: "'Inter', system-ui, sans-serif" }, color: '#334155' }
            },
            y: {
                title: { 
                    display: true, 
                    text: yTitle || 'Value', 
                    color: '#334155', 
                    font: { weight: '700', size: 11, family: "'Inter', system-ui, sans-serif" } 
                },
                grid: { display: false },
                border: { display: true, color: '#1e293b', width: 2 },
                beginAtZero: false,
                grace: '65%',
                ticks: { font: { weight: '700', size: 11, family: "'Inter', system-ui, sans-serif" }, color: '#334155' }
            }
        }
    };
}

export function lineChartSPPV(labels, spData, pvData, yTitle) {
    return {
        type: 'line',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'SP (Set Point)',
                    data: spData,
                    borderColor: C.spBlue,
                    backgroundColor: C.spBlue,
                    borderWidth: 2,
                    pointStyle: 'circle',
                    pointRadius: 5,
                    pointHoverRadius: 7,
                    pointBackgroundColor: '#ffffff',
                    pointBorderColor: C.spBlue,
                    pointBorderWidth: 2,
                    tension: 0,
                    fill: false
                },
                {
                    label: 'PV (Process Value)',
                    data: pvData,
                    borderColor: C.pvGreen,
                    backgroundColor: C.pvGreen,
                    borderWidth: 2,
                    pointStyle: 'circle',
                    pointRadius: 5,
                    pointHoverRadius: 7,
                    pointBackgroundColor: '#ffffff',
                    pointBorderColor: C.pvGreen,
                    pointBorderWidth: 2,
                    tension: 0,
                    fill: false
                }
            ]
        },
        options: commonOptions(yTitle)
    };
}

export function comboSpLinePvColumn(labels, spData, pvData, yTitle) {
    return {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [
                {
                    type: 'line',
                    label: 'SP (Set Point)',
                    data: spData,
                    borderColor: C.spBlue,
                    backgroundColor: C.spBlue,
                    borderWidth: 2,
                    pointStyle: 'circle',
                    pointRadius: 5,
                    pointHoverRadius: 7,
                    pointBackgroundColor: '#ffffff',
                    pointBorderColor: C.spBlue,
                    pointBorderWidth: 2,
                    tension: 0,
                    fill: false,
                    order: 1
                },
                {
                    type: 'bar',
                    label: 'PV (Process Value)',
                    data: pvData,
                    backgroundColor: C.pvGreen,
                    borderRadius: 4,
                    barPercentage: 0.6,
                    order: 2
                }
            ]
        },
        options: commonOptions(yTitle)
    };
}

// Specialized Config for JCF + HBR stage differentiation
export function jcfHbrChartConfig(labels, jcfSp, jcfPv, hbrSp, hbrPv, hbrExitSp, hbrExitPv, yTitle) {
    const stageLabels = (labels && labels.length === 5) ? labels : ['JCF Z1', 'JCF Z2', 'JCF Z3', 'HBR', 'HBR EXIT'];
    
    // Safety array checks
    const spArray = Array.isArray(jcfSp) ? jcfSp : [480, 480, 480];
    const pvArray = Array.isArray(jcfPv) ? jcfPv : [156.9, 165.0, 170.0];

    const jcfSpAligned = [spArray[0] ?? 480, spArray[1] ?? 480, spArray[2] ?? 480, null, null];
    const jcfPvAligned = [pvArray[0] ?? 156.9, pvArray[1] ?? 165.0, pvArray[2] ?? 170.0, null, null];
    const hbrSpAligned = [null, null, null, hbrSp ?? 480.0, hbrExitSp ?? 469.8];
    const hbrPvAligned = [null, null, null, hbrPv ?? 338.1, hbrExitPv ?? 481.8];

    return {
        type: 'line',
        data: {
            labels: stageLabels,
            datasets: [
                {
                    label: 'JCF SP',
                    data: jcfSpAligned,
                    borderColor: C.cyan,
                    backgroundColor: C.cyan,
                    borderWidth: 2,
                    pointStyle: 'circle',
                    pointRadius: 5,
                    pointHoverRadius: 7,
                    pointBackgroundColor: '#ffffff',
                    pointBorderColor: C.cyan,
                    pointBorderWidth: 2,
                    tension: 0,
                    spanGaps: false
                },
                {
                    label: 'JCF PV',
                    data: jcfPvAligned,
                    borderColor: C.teal,
                    backgroundColor: C.teal,
                    borderWidth: 2,
                    pointStyle: 'circle',
                    pointRadius: 5,
                    pointHoverRadius: 7,
                    pointBackgroundColor: '#ffffff',
                    pointBorderColor: C.teal,
                    pointBorderWidth: 2,
                    tension: 0,
                    spanGaps: false
                },
                {
                    label: 'HBR SP',
                    data: hbrSpAligned,
                    borderColor: C.purple,
                    backgroundColor: C.purple,
                    borderWidth: 2,
                    pointStyle: 'rectRot',
                    pointRadius: 6,
                    pointHoverRadius: 8,
                    pointBackgroundColor: '#ffffff',
                    pointBorderColor: C.purple,
                    pointBorderWidth: 2,
                    tension: 0,
                    spanGaps: false
                },
                {
                    label: 'HBR PV',
                    data: hbrPvAligned,
                    borderColor: C.orange,
                    backgroundColor: C.orange,
                    borderWidth: 2,
                    pointStyle: 'rectRot',
                    pointRadius: 6,
                    pointHoverRadius: 8,
                    pointBackgroundColor: '#ffffff',
                    pointBorderColor: C.orange,
                    pointBorderWidth: 2,
                    tension: 0,
                    spanGaps: false
                }
            ]
        },
        options: commonOptions(yTitle)
    };
}

export function gasLollipopChartConfig(paramsData) {
    const labels = paramsData.map(p => p.shortName);
    const normalizedData = paramsData.map(p => p.normalized);
    const colors = paramsData.map(p => p.color || C.cyan);

    return {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Average %',
                data: normalizedData,
                backgroundColor: colors,
                borderColor: colors,
                borderWidth: 2,
                barPercentage: 0.55,
                borderRadius: 6
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            layout: { padding: { top: 16, bottom: 6, left: 10, right: 16 } },
            plugins: {
                legend: { display: false },
                tooltip: {
                    padding: 10,
                    cornerRadius: 8,
                    titleFont: { size: 13, weight: '700' },
                    bodyFont: { size: 13, weight: '500' },
                    callbacks: {
                        label: function(ctx) {
                            const idx = ctx.dataIndex;
                            const item = paramsData[idx];
                            return `  Average: ${item.normalized}% (${item.rawVal} ${item.unit})`;
                        }
                    }
                }
            },
            scales: {
                x: {
                    title: { display: true, text: 'Parameters', color: '#0f172a', font: { weight: '800', size: 11 } },
                    grid: { display: false },
                    border: { display: true, color: '#0f172a', width: 2 },
                    ticks: { font: { weight: '700', size: 11 }, color: '#334155' }
                },
                y: {
                    title: { display: true, text: 'Average %', color: '#0f172a', font: { weight: '800', size: 11 } },
                    grid: { display: false },
                    border: { display: true, color: '#0f172a', width: 2 },
                    beginAtZero: true,
                    max: 120,
                    ticks: { font: { weight: '700', size: 11 }, color: '#334155', callback: v => `${v}%` }
                }
            }
        }
    };
}

export function gasClusteredColumnLineConfig(paramsData) {
    const labels = paramsData.map(p => p.shortName);
    const avgNormalized = paramsData.map(p => p.normalized);
    const targetNormalized = paramsData.map(p => p.targetNorm);
    const limitNormalized = paramsData.map(p => p.limitNorm);

    return {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [
                {
                    type: 'bar',
                    label: 'Average',
                    data: avgNormalized,
                    backgroundColor: C.spBlue,
                    borderRadius: 4,
                    barPercentage: 0.5,
                    order: 3
                },
                {
                    type: 'line',
                    label: 'Target',
                    data: targetNormalized,
                    borderColor: C.pvGreen,
                    backgroundColor: C.pvGreen,
                    borderWidth: 2,
                    pointStyle: 'circle',
                    pointRadius: 5,
                    pointHoverRadius: 7,
                    pointBackgroundColor: '#ffffff',
                    pointBorderColor: C.pvGreen,
                    pointBorderWidth: 2,
                    tension: 0,
                    order: 1
                },
                {
                    type: 'line',
                    label: 'Normal Limit',
                    data: limitNormalized,
                    borderColor: C.red,
                    backgroundColor: C.red,
                    borderWidth: 2,
                    borderDash: [5, 5],
                    pointStyle: 'rectRot',
                    pointRadius: 6,
                    pointHoverRadius: 8,
                    pointBackgroundColor: '#ffffff',
                    pointBorderColor: C.red,
                    pointBorderWidth: 2,
                    tension: 0,
                    order: 2
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            layout: { padding: { top: 12, bottom: 6, left: 6, right: 16 } },
            plugins: {
                legend: {
                    position: 'top',
                    labels: { usePointStyle: true, boxWidth: 8, padding: 14, font: { size: 12, weight: '600' } }
                },
                tooltip: {
                    padding: 10,
                    cornerRadius: 8,
                    titleFont: { size: 13, weight: '700' },
                    bodyFont: { size: 13, weight: '500' },
                    callbacks: {
                        label: function(ctx) {
                            const idx = ctx.dataIndex;
                            const item = paramsData[idx];
                            const label = ctx.dataset.label;
                            if (label.includes('Average')) return `  ${label}: ${item.normalized}% (${item.rawVal} ${item.unit})`;
                            if (label.includes('Target')) return `  ${label}: ${item.targetNorm}% (${item.target} ${item.unit})`;
                            if (label.includes('Limit')) return `  ${label}: ${item.limitNorm}% (${item.limit} ${item.unit})`;
                            return `  ${label}: ${ctx.raw}%`;
                        }
                    }
                }
            },
            scales: {
                x: {
                    title: { display: true, text: 'Parameters', color: '#0f172a', font: { weight: '800', size: 11 } },
                    grid: { display: false },
                    border: { display: true, color: '#0f172a', width: 2 },
                    ticks: { font: { weight: '700', size: 11 }, color: '#334155' }
                },
                y: {
                    title: { display: true, text: 'Normalized Average (%)', color: '#0f172a', font: { weight: '800', size: 11 } },
                    grid: { display: false },
                    border: { display: true, color: '#0f172a', width: 2 },
                    beginAtZero: true,
                    max: 120,
                    ticks: { font: { weight: '700', size: 11 }, color: '#334155', callback: v => `${v}%` }
                }
            }
        }
    };
}
