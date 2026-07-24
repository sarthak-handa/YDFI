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
                grid: { display: false },
                ticks: { font: { weight: '700', size: 11, family: "'Inter', system-ui, sans-serif" } }
            },
            y: {
                title: { display: true, text: yTitle, font: { weight: '700', family: "'Inter', system-ui, sans-serif" } },
                grid: { color: 'rgba(0, 0, 0, 0.04)' },
                beginAtZero: false,
                grace: '18%', // Extends Y-axis headroom taller than max data point (e.g. 1200 -> 1400+) so graph line isn't pegged at top
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
                    label: 'JCF SP (Jet Cooling)',
                    data: jcfSpAligned,
                    borderColor: '#0284c7', // Sky blue
                    backgroundColor: '#0284c7',
                    borderWidth: 3,
                    pointStyle: 'circle',
                    pointRadius: 6,
                    pointHoverRadius: 8,
                    pointBackgroundColor: '#ffffff',
                    pointBorderColor: '#0284c7',
                    pointBorderWidth: 3,
                    tension: 0.2,
                    spanGaps: false
                },
                {
                    label: 'JCF PV (Jet Cooling)',
                    data: jcfPvAligned,
                    borderColor: '#10b981', // Emerald
                    backgroundColor: '#10b981',
                    borderWidth: 3,
                    pointStyle: 'circle',
                    pointRadius: 6,
                    pointHoverRadius: 8,
                    pointBackgroundColor: '#ffffff',
                    pointBorderColor: '#10b981',
                    pointBorderWidth: 3,
                    tension: 0.2,
                    spanGaps: false
                },
                {
                    label: 'HBR SP (Hot Bridle)',
                    data: hbrSpAligned,
                    borderColor: '#8b5cf6', // Purple
                    backgroundColor: '#8b5cf6',
                    borderWidth: 3,
                    pointStyle: 'rectRot',
                    pointRadius: 8,
                    pointHoverRadius: 10,
                    pointBackgroundColor: '#ffffff',
                    pointBorderColor: '#8b5cf6',
                    pointBorderWidth: 3,
                    spanGaps: false
                },
                {
                    label: 'HBR PV (Hot Bridle)',
                    data: hbrPvAligned,
                    borderColor: '#f59e0b', // Amber
                    backgroundColor: '#f59e0b',
                    borderWidth: 3,
                    pointStyle: 'rectRot',
                    pointRadius: 8,
                    pointHoverRadius: 10,
                    pointBackgroundColor: '#ffffff',
                    pointBorderColor: '#f59e0b',
                    pointBorderWidth: 3,
                    spanGaps: false
                }
            ]
        },
        options: commonOptions(yTitle)
    };
}

// Bar Chart configuration for Gas & Atmosphere Parameters (replacing donut/pie chart)
export function gasBarChartConfig(labels, data, colors, yTitle = 'Gas Parameters') {
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
                    borderRadius: 6,
                    borderWidth: 1,
                    borderColor: 'rgba(0,0,0,0.08)',
                    barPercentage: 0.55
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: {
                    padding: 12,
                    cornerRadius: 8,
                    titleFont: { size: 12, weight: '800', family: "'Inter', system-ui, sans-serif" },
                    bodyFont: { size: 12, weight: '600', family: "'Inter', system-ui, sans-serif" },
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
                    grid: { display: false },
                    ticks: { font: { weight: '700', size: 10, family: "'Inter', system-ui, sans-serif" } }
                },
                y: {
                    title: { display: true, text: 'Measured Value', font: { weight: '700', family: "'Inter', system-ui, sans-serif" } },
                    grid: { color: 'rgba(0, 0, 0, 0.04)' },
                    grace: '15%',
                    beginAtZero: true,
                    ticks: { font: { family: "'Inter', system-ui, sans-serif" } }
                }
            }
        }
    };
}
