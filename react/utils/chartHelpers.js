export const C = {
    spBlue: '#3b82f6',
    pvGreen: '#10b981',
    cyan: '#06b6d4',
    purple: '#8b5cf6',
    red: '#ef4444',
    slate: '#475569',
    indigo: '#6366f1',
    orange: '#f59e0b'
};

export function commonOptions(yTitle) {
    return {
        responsive: true,
        maintainAspectRatio: false,
        interaction: { mode: 'index', intersect: false },
        plugins: {
            legend: {
                position: 'top',
                labels: {
                    usePointStyle: true,
                    boxWidth: 8,
                    padding: 16,
                    font: { size: 12, weight: '700', family: "'Inter', system-ui, sans-serif" }
                }
            },
            tooltip: {
                padding: 12,
                cornerRadius: 8,
                titleFont: { size: 12, weight: '800', family: "'Inter', system-ui, sans-serif" },
                bodyFont: { size: 12, weight: '600', family: "'Inter', system-ui, sans-serif" },
                callbacks: {
                    title: function(items) {
                        if (!items || !items.length) return '';
                        const l = items[0].label;
                        return l.startsWith('Z') ? `Zone ${l.replace('Z','')}` : l;
                    },
                    label: function(ctx) {
                        const isSP = ctx.dataset.label.startsWith('SP');
                        const dsTag = isSP ? 'SP' : 'PV';
                        const unit = yTitle.includes('°C') ? '°C' : '';
                        const valStr = typeof ctx.raw === 'number' ? (yTitle.includes('Ratio') ? ctx.raw.toFixed(2) : ctx.raw.toFixed(1)) : ctx.raw;
                        return `  ${dsTag} : ${valStr}${unit}`;
                    }
                }
            }
        },
        scales: {
            x: {
                grid: { display: false },
                ticks: { font: { weight: '700', size: 11, family: "'Inter', system-ui, sans-serif" } }
            },
            y: {
                title: { display: true, text: yTitle, font: { weight: '700', family: "'Inter', system-ui, sans-serif" } },
                grid: { color: 'rgba(0, 0, 0, 0.04)' },
                beginAtZero: false,
                ticks: { font: { family: "'Inter', system-ui, sans-serif" } }
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
                    borderWidth: 3,
                    pointStyle: 'circle',
                    pointRadius: 6,
                    pointHoverRadius: 8,
                    pointBackgroundColor: '#ffffff',
                    pointBorderColor: C.spBlue,
                    pointBorderWidth: 3,
                    tension: 0.2,
                    fill: false
                },
                {
                    label: 'PV (Process Value)',
                    data: pvData,
                    borderColor: C.pvGreen,
                    backgroundColor: C.pvGreen,
                    borderWidth: 3,
                    pointStyle: 'circle',
                    pointRadius: 6,
                    pointHoverRadius: 8,
                    pointBackgroundColor: '#ffffff',
                    pointBorderColor: C.pvGreen,
                    pointBorderWidth: 3,
                    tension: 0.2,
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
                    borderWidth: 3,
                    pointStyle: 'circle',
                    pointRadius: 6,
                    pointHoverRadius: 8,
                    pointBackgroundColor: '#ffffff',
                    pointBorderColor: C.spBlue,
                    pointBorderWidth: 3,
                    tension: 0.2,
                    fill: false,
                    order: 1
                },
                {
                    type: 'bar',
                    label: 'PV (Process Value)',
                    data: pvData,
                    backgroundColor: C.pvGreen,
                    borderRadius: 5,
                    barPercentage: 0.55,
                    order: 2
                }
            ]
        },
        options: commonOptions(yTitle)
    };
}

export function singleUnifiedGasPie(labels, data, colors) {
    return {
        type: 'pie',
        data: {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: colors,
                borderWidth: 2,
                borderColor: '#ffffff',
                hoverOffset: 8
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                    labels: {
                        usePointStyle: true,
                        padding: 14,
                        font: { size: 11, weight: '700', family: "'Inter', system-ui, sans-serif" }
                    }
                },
                tooltip: {
                    padding: 10,
                    cornerRadius: 8,
                    titleFont: { family: "'Inter', system-ui, sans-serif" },
                    bodyFont: { family: "'Inter', system-ui, sans-serif" },
                    callbacks: {
                        label: function(ctx) {
                            return `  ${ctx.label}: ${ctx.raw}`;
                        }
                    }
                }
            }
        }
    };
}
