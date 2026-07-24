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
            padding: 0
        },
        interaction: { mode: 'index', intersect: false },
        plugins: {
            legend: {
                position: 'top',
                labels: {
                    usePointStyle: true,
                    boxWidth: 8,
                    padding: 16,
                    font: { size: 13, weight: '600', family: "'Inter', system-ui, sans-serif" }
                }
            },
            tooltip: {
                padding: 12,
                cornerRadius: 8,
                titleFont: { size: 14, weight: '700', family: "'Inter', system-ui, sans-serif" },
                bodyFont: { size: 14, weight: '500', family: "'Inter', system-ui, sans-serif" },
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
                grid: { display: false, drawBorder: false },
                ticks: { font: { weight: '600', size: 12, family: "'Inter', system-ui, sans-serif" } }
            },
            y: {
                title: { display: false },
                grid: { color: 'rgba(0, 0, 0, 0.04)', drawBorder: false },
                beginAtZero: false,
                grace: '18%',
                ticks: { font: { weight: '500', size: 12, family: "'Inter', system-ui, sans-serif" } }
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
                    pointRadius: 4,
                    pointHoverRadius: 6,
                    pointBackgroundColor: '#ffffff',
                    pointBorderColor: C.spBlue,
                    pointBorderWidth: 2,
                    tension: 0.2,
                    fill: false
                },
                {
                    label: 'PV (Process Value)',
                    data: pvData,
                    borderColor: C.pvGreen,
                    backgroundColor: C.pvGreen,
                    borderWidth: 2,
                    pointStyle: 'circle',
                    pointRadius: 4,
                    pointHoverRadius: 6,
                    pointBackgroundColor: '#ffffff',
                    pointBorderColor: C.pvGreen,
                    pointBorderWidth: 2,
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
                    borderWidth: 2,
                    pointStyle: 'circle',
                    pointRadius: 4,
                    pointHoverRadius: 6,
                    pointBackgroundColor: '#ffffff',
                    pointBorderColor: C.spBlue,
                    pointBorderWidth: 2,
                    tension: 0.2,
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
export function jcfHbrChartConfig(jcfLabels, jcfSp, jcfPv, hbrLabel, hbrSp, hbrPv, yTitle) {
    const labels = [...jcfLabels, hbrLabel];
    
    // Dataset aligned across points
    const jcfSpAligned = [...jcfSp, null];
    const jcfPvAligned = [...jcfPv, null];
    const hbrSpAligned = [null, null, null, hbrSp];
    const hbrPvAligned = [null, null, null, hbrPv];

    return {
        type: 'line',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'JCF SP',
                    data: jcfSpAligned,
                    borderColor: C.cyan,
                    backgroundColor: C.cyan,
                    borderWidth: 2,
                    pointStyle: 'circle',
                    pointRadius: 4,
                    pointHoverRadius: 6,
                    pointBackgroundColor: '#ffffff',
                    pointBorderColor: C.cyan,
                    pointBorderWidth: 2,
                    tension: 0.2,
                    spanGaps: false
                },
                {
                    label: 'JCF PV',
                    data: jcfPvAligned,
                    borderColor: C.teal,
                    backgroundColor: C.teal,
                    borderWidth: 2,
                    pointStyle: 'circle',
                    pointRadius: 4,
                    pointHoverRadius: 6,
                    pointBackgroundColor: '#ffffff',
                    pointBorderColor: C.teal,
                    pointBorderWidth: 2,
                    tension: 0.2,
                    spanGaps: false
                },
                {
                    label: 'HBR SP',
                    data: hbrSpAligned,
                    borderColor: C.purple,
                    backgroundColor: C.purple,
                    borderWidth: 2,
                    pointStyle: 'rectRot',
                    pointRadius: 5,
                    pointHoverRadius: 7,
                    pointBackgroundColor: '#ffffff',
                    pointBorderColor: C.purple,
                    pointBorderWidth: 2,
                    spanGaps: false
                },
                {
                    label: 'HBR PV',
                    data: hbrPvAligned,
                    borderColor: C.orange,
                    backgroundColor: C.orange,
                    borderWidth: 2,
                    pointStyle: 'rectRot',
                    pointRadius: 5,
                    pointHoverRadius: 7,
                    pointBackgroundColor: '#ffffff',
                    pointBorderColor: C.orange,
                    pointBorderWidth: 2,
                    spanGaps: false
                }
            ]
        },
        options: commonOptions(yTitle)
    };
}

export function gasBarChartConfig(labels, data, colors, yTitle) {
    const units = ['Nm³/h', 'Nm³/h', 'ppm', '°C', 'mmwc'];

    return {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Gas Level / Value',
                    data: data,
                    backgroundColor: colors,
                    borderRadius: 4,
                    borderWidth: 0,
                    barPercentage: 0.6
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            layout: { padding: 0 },
            plugins: {
                legend: { display: false },
                tooltip: {
                    padding: 12,
                    cornerRadius: 8,
                    titleFont: { size: 14, weight: '700', family: "'Inter', system-ui, sans-serif" },
                    bodyFont: { size: 14, weight: '500', family: "'Inter', system-ui, sans-serif" },
                    callbacks: {
                        label: function(ctx) {
                            const val = ctx.raw;
                            const idx = ctx.dataIndex;
                            const u = units[idx] || '';
                            return `  ${ctx.label}: ${val} ${u}`;
                        }
                    }
                }
            },
            scales: {
                x: {
                    grid: { display: false, drawBorder: false },
                    ticks: { font: { weight: '600', size: 11, family: "'Inter', system-ui, sans-serif" } }
                },
                y: {
                    title: { display: false },
                    grid: { color: 'rgba(0, 0, 0, 0.04)', drawBorder: false },
                    grace: '15%',
                    beginAtZero: true,
                    ticks: { font: { size: 11, family: "'Inter', system-ui, sans-serif" } }
                }
            }
        }
    };
}
