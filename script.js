/* ACPPL GI Furnace Dashboard — script.js v11
   Aligned with APL Apollo CRM Design System Specs */

function initChartDefaults() {
    if (typeof Chart !== 'undefined') {
        Chart.defaults.font.family = "'Inter', system-ui, sans-serif";
        Chart.defaults.font.size = 12; // CRM Axis labels 12px
        Chart.defaults.maintainAspectRatio = false;
        Chart.defaults.plugins.legend.labels.usePointStyle = true;
        Chart.defaults.plugins.legend.labels.boxWidth = 8;
        Chart.defaults.plugins.legend.labels.padding = 16;
    }
}

const C = {
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

const charts = {};
function mk(id, cfg) {
    if (typeof Chart === 'undefined') return;
    if(charts[id]) charts[id].destroy();
    const el = document.getElementById(id);
    if(el) charts[id] = new Chart(el, cfg);
}

// ════════════════════════════════════════════════════
//  DEFAULT STATIC DATA
// ════════════════════════════════════════════════════

let D = {
    coils: ['C07G0864','C07G0628','C07G0629','C07G0627','C07G0949','C07G0625','C07G0948','C07G0952','C07G0767','C07G0621'],

    phfZones: ['Z1','Z2','Z3','Z4','Z5'],
    phfZoneSP: [1200, 1200, 1150, 1150, 1100],
    phfZonePV: [1196, 1195, 1147, 1140, 1085],
    phfZoneAGSP: [12.0, 11.5, 11.0, 10.5, 12.0],
    phfZoneAGPV: [12.02, 11.51, 11.0, 10.51, 12.01],
    phfExitSP: [750, 750, 750, 750, 740, 740, 740, 740, 740, 740],
    phfExitPV: [728, 748, 750, 740, 738, 745, 732, 747, 741, 751],

    rtfZones: ['Z1','Z2','Z3'],
    rtfZoneSP: [770, 770, 770],
    rtfZonePV: [752, 780, 771],
    rtfExitSP: [750, 750, 750, 750, 740, 740, 740, 740, 740, 740],
    rtfExitPV: [723, 748, 748, 740, 738, 745, 732, 747, 741, 751],

    sfHeaterSP: [750, 750, 750, 750, 750, 750, 750, 750, 750, 750],
    sfHeaterPV: [739, 739, 739, 740, 738, 745, 732, 747, 741, 751],
    sfExitSP:   [720, 720, 720, 720, 720, 720, 720, 715, 715, 715],
    sfExitPV:   [727, 716, 718, 719, 715, 721, 710, 714, 712, 719],

    jcfZ1SP: [480, 480, 480, 480, 480, 480, 480, 480, 480, 480],
    jcfZ1PV: [138.3, 174.4, 165.5, 168.4, 168.5, 168.3, 171.6, 173.9, 172.8, 156.9],
    jcfZ2PV: [146.3, 183.9, 173.7, 178.0, 178.5, 173.9, 175.6, 174.8, 175.7, 165.0],
    jcfZ3PV: [153.8, 190.9, 176.6, 178.7, 179.0, 176.4, 174.5, 174.2, 177.3, 170.0],
    hbrSP:   [480, 480, 480, 480, 480, 480, 480, 480, 480, 480],
    hbrPV:   [334.3, 334.0, 333.7, 332.5, 332.9, 330.9, 328.3, 326.7, 327.3, 338.1],
    hbrExitSP: [467.2, 460.0, 460.0, 460.0, 460.0, 460.0, 460.0, 460.0, 460.0, 469.8],
    hbrExitPV: [469.9, 474.0, 469.1, 471.2, 470.0, 463.1, 460.9, 461.2, 464.8, 481.8],

    fumeBlower: [1095, 1092, 1122, 1094, 1023, 1042, 1015, 1026, 1001, 1089],
    combBlower: [2917, 2947, 2961, 2942, 2903, 2914, 2899, 2905, 2891, 2387],
    h2Conc: [20.01, 20.04, 19.78, 20.07, 19.88, 19.61, 20.26, 20.23, 19.56, 20.1],
    h2Flow: [28.73, 28.80, 28.59, 29.40, 28.58, 28.72, 30.90, 29.72, 29.17, 28.8],
    n2Flow: [244.57, 243.09, 243.36, 243.23, 243.40, 243.33, 242.13, 243.19, 245.94, 243.8],
    o2:     [49.0, 39.0, 40.0, 42.0, 40.0, 39.0, 44.0, 40.0, 39.0, 37.0],
    dewPt:  [-21.0, -20.6, -22.2, -21.4, -22.1, -24.2, -13.4, -18.9, -23.5, -25.1],
    combSP: [900, 900, 900, 900, 900, 900, 900, 900, 900, 900],
    combPV: [899, 900, 900, 900, 900, 900, 900, 900, 900, 900],

    totalCoils: 109,
    phfMode: 'SEMI-AUTO',
    rtfMode: 'AUTO',
    sfMode: 'SEMI-AUTO',
    hbrMode: 'MANUAL'
};

function avg(arr) {
    if (typeof arr === 'number') return arr;
    if (!arr || !arr.length) return 0;
    return arr.reduce((a, b) => a + b, 0) / arr.length;
}

// ════════════════════════════════════════════════════
//  MODE PILL BADGE UPDATER
// ════════════════════════════════════════════════════

function updateModeBadge(elId, modeStr) {
    const el = document.getElementById(elId);
    if (!el) return;
    const m = modeStr.toUpperCase().trim();
    let modeClass = 'mode-manual';
    let modeText = 'MANUAL';
    
    if (m === 'AUTO') {
        modeClass = 'mode-auto';
        modeText = 'AUTO';
    } else if (m === 'SEMI-AUTO' || m === 'SEMI_AUTO' || m === 'SEMI AUTO') {
        modeClass = 'mode-semi-auto';
        modeText = 'SEMI-AUTO';
    }
    
    el.className = `mode-badge ${modeClass}`;
    el.innerHTML = `<span class="mode-dot"></span> <span class="mode-text">${modeText}</span>`;
}

// ════════════════════════════════════════════════════
//  RENDER DASHBOARD
// ════════════════════════════════════════════════════

function renderAll() {
    const phfExitAvg = avg(D.phfExitPV);
    const rtfExitAvg = avg(D.rtfExitPV);
    const sfExitAvg = avg(D.sfExitPV);
    const hbrExitAvg = avg(D.hbrExitPV);
    const avgAGRatio = avg(D.phfZoneAGPV);

    document.getElementById('k-coils').textContent = D.totalCoils;
    document.getElementById('k-phf').innerHTML = `${phfExitAvg.toFixed(1)}`;
    document.getElementById('k-rtf').innerHTML = `${rtfExitAvg.toFixed(1)}`;
    document.getElementById('k-sf').innerHTML = `${sfExitAvg.toFixed(1)}`;
    document.getElementById('k-hbr').innerHTML = `${hbrExitAvg.toFixed(1)}`;
    document.getElementById('k-ag').textContent = avgAGRatio.toFixed(2);

    updateModeBadge('phf-mode-badge', D.phfMode);
    updateModeBadge('rtf-mode-badge', D.rtfMode);
    updateModeBadge('sf-mode-badge', D.sfMode);
    updateModeBadge('jcf-mode-badge', D.hbrMode);

    // PHF
    const phfLabels = [...D.phfZones, 'EXIT PV'];
    const phfSP = [...D.phfZoneSP, avg(D.phfExitSP)];
    const phfPV = [...D.phfZonePV, avg(D.phfExitPV)];
    mk('phfZoneTemp', lineChartSPPV(phfLabels, phfSP, phfPV, 'Temperature (°C)'));
    mk('phfZoneAG', comboSpLinePvColumn(D.phfZones, D.phfZoneAGSP, D.phfZoneAGPV, 'Air / Gas Ratio'));

    // RTF
    const rtfLabels = [...D.rtfZones, 'EXIT PV'];
    const rtfSP = [...D.rtfZoneSP, avg(D.rtfExitSP)];
    const rtfPV = [...D.rtfZonePV, avg(D.rtfExitPV)];
    mk('rtfZoneTemp', lineChartSPPV(rtfLabels, rtfSP, rtfPV, 'Temperature (°C)'));

    // SF
    const sfLabels = ['HEATER', 'EXIT PV'];
    const sfSP = [avg(D.sfHeaterSP), avg(D.sfExitSP)];
    const sfPV = [avg(D.sfHeaterPV), avg(D.sfExitPV)];
    mk('sfZoneTemp', lineChartSPPV(sfLabels, sfSP, sfPV, 'Temperature (°C)'));

    // JCF + HBR (5 CONNECTED POINTS ON X AXIS: JCF Z1, JCF Z2, JCF Z3, HBR, HBR EXIT)
    const stageLabels = ['JCF Z1', 'JCF Z2', 'JCF Z3', 'HBR', 'HBR EXIT'];
    const fullSP = [
        parseFloat(avg(D.jcfZ1SP || 480).toFixed(1)), 
        parseFloat(avg(D.jcfZ2SP || 480).toFixed(1)), 
        parseFloat(avg(D.jcfZ3SP || 480).toFixed(1)), 
        parseFloat(avg(D.hbrSP || 460).toFixed(1)), 
        parseFloat(avg(D.hbrExitSP || 460).toFixed(1))
    ];
    const fullPV = [
        parseFloat(avg(D.jcfZ1PV || 188).toFixed(1)), 
        parseFloat(avg(D.jcfZ2PV || 193).toFixed(1)), 
        parseFloat(avg(D.jcfZ3PV || 201).toFixed(1)), 
        parseFloat(avg(D.hbrPV || 338.1).toFixed(1)), 
        parseFloat(avg(D.hbrExitPV || 481.8).toFixed(1))
    ];
    mk('jcfZoneTemp', jcfHbrChartConfig(stageLabels, fullSP, fullPV, 'Temperature (°C)'));

    // GAS & ATMOSPHERE PARAMETERS DATASET (7 PARAMETERS)
    const fumeVal = Math.round(avg(D.fumeBlower || 1089));
    const combVal = Math.round(avg(D.combBlower || 2387));
    const o2Val = parseFloat(avg(D.o2 || 37.0).toFixed(1));
    const dewVal = parseFloat(avg(D.dewPt || -25.1).toFixed(1));
    const h2ConcVal = parseFloat(avg(D.h2Conc || 20.1).toFixed(1));
    const h2FlowVal = parseFloat(avg(D.h2Flow || 28.8).toFixed(1));
    const n2FlowVal = parseFloat(avg(D.n2Flow || 243.8).toFixed(1));

    const gasParamsData = [
        { name: 'Fume Exh Blower', shortName: 'Fume Blower', rawVal: fumeVal, unit: 'rpm', normalized: Number(((fumeVal / 1200) * 100).toFixed(1)), color: C.cyan },
        { name: 'Comb Blower 1', shortName: 'Comb Blower', rawVal: combVal, unit: 'rpm', normalized: Number(((combVal / 2500) * 100).toFixed(1)), color: C.purple },
        { name: 'O2 Purity', shortName: 'O2', rawVal: o2Val, unit: 'ppm', normalized: Number(((o2Val / 50.0) * 100).toFixed(1)), color: C.red },
        { name: 'Dew Point', shortName: 'Dew Point', rawVal: dewVal, unit: '°C', normalized: Number(((Math.abs(dewVal) / 30.0) * 100).toFixed(1)), color: C.slate },
        { name: 'H2 Conc', shortName: 'H2 Conc', rawVal: h2ConcVal, unit: '%', normalized: Number(((h2ConcVal / 25.0) * 100).toFixed(1)), color: C.indigo },
        { name: 'H2 Flow', shortName: 'H2 Flow', rawVal: h2FlowVal, unit: 'Nm³/h', normalized: Number(((h2FlowVal / 35.0) * 100).toFixed(1)), color: C.teal },
        { name: 'N2 Flow', shortName: 'N2 Flow', rawVal: n2FlowVal, unit: 'Nm³/h', normalized: Number(((n2FlowVal / 300.0) * 100).toFixed(1)), color: C.orange }
    ];

    mk('gasPieChart', gasLollipopChartConfig(gasParamsData));

    const chipsContainer = document.getElementById('gasSummaryChips');
    if (chipsContainer) {
        chipsContainer.innerHTML = gasParamsData.map(p => `
            <div class="gas-chip"><span class="chip-dot" style="background:${p.color}"></span><span class="chip-label">${p.shortName}</span><span class="chip-val">${p.rawVal} ${p.unit} (${p.normalized}%)</span></div>
        `).join('');
    }
}

// ════════════════════════════════════════════════════
//  CHART FACTORIES & COMMON OPTIONS
// ════════════════════════════════════════════════════

function commonOptions(yTitle) {
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

function lineChartSPPV(labels, spData, pvData, yTitle) {
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
                    pointRadius: 4,
                    pointHoverRadius: 6,
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

function comboSpLinePvColumn(labels, spData, pvData, yTitle) {
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

function jcfHbrChartConfig(labels, spData, pvData, yTitle) {
    const stageLabels = (labels && labels.length === 5) ? labels : ['JCF Z1', 'JCF Z2', 'JCF Z3', 'HBR', 'HBR EXIT'];
    
    return {
        type: 'line',
        data: {
            labels: stageLabels,
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

function gasLollipopChartConfig(paramsData) {
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


function gasClusteredColumnLineConfig(paramsData) {
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

// Flip View Button Handler
window.isGasFlipped = false;
document.addEventListener('DOMContentLoaded', () => {
    const flipBtn = document.getElementById('gasFlipBtn');
    if (flipBtn) {
        flipBtn.addEventListener('click', () => {
            window.isGasFlipped = !window.isGasFlipped;
            if (window.renderGasChartGlobal) window.renderGasChartGlobal();
        });
    }
});

// ════════════════════════════════════════════════════
//  MODAL & INTERACTIVITY LOGIC
// ════════════════════════════════════════════════════

let currentZoomChartId = null;

function openInfoModal(title, icon, color, unit, desc) {
    document.getElementById('infoTitle').textContent = title;
    document.getElementById('infoDesc').textContent = desc;
    document.getElementById('infoIcon').innerHTML = `<i class="fa-solid ${icon}"></i>`;
    document.getElementById('infoIcon').style.color = color;
    document.getElementById('infoIcon').style.backgroundColor = color + '1a'; // 10% opacity
    
    let specsHtml = '';
    if (unit === 'Mixed') {
        specsHtml = `
            <li><strong>H₂ / N₂ Flow:</strong> Measured in Nm³/h</li>
            <li><strong>O₂ Purity:</strong> Parts per million (ppm)</li>
            <li><strong>Dew Point:</strong> Temperature in degree Celsius (°C)</li>
            <li><strong>Combustion Air:</strong> Pressure in mmwc</li>
        `;
    } else {
        specsHtml = `
            <li><strong>Unit of Measure:</strong> ${unit === '°C' ? 'Degree Celsius (°C)' : unit}</li>
            <li><strong>Control Mode:</strong> Real-time SP (Set Point) vs PV (Process Value) tracking</li>
            <li><strong>headroom / Scale:</strong> Dynamic height optimization for clean signal visibility</li>
        `;
    }
    document.getElementById('infoSpecsList').innerHTML = specsHtml;
    
    const m = document.getElementById('infoModal');
    m.classList.remove('hidden');
}

function openZoomModal(chartId, title, icon, color, sub) {
    document.getElementById('zoomTitle').textContent = title;
    document.getElementById('zoomSub').textContent = sub;
    document.getElementById('zoomIcon').innerHTML = `<i class="fa-solid ${icon}"></i>`;
    document.getElementById('zoomIcon').style.backgroundColor = color;

    const existingChart = charts[chartId];
    if (existingChart) {
        currentZoomChartId = chartId;
        mk('zoomCanvas', existingChart.config);
    }

    const m = document.getElementById('zoomModal');
    m.classList.remove('hidden');
}

function closeModal(modalId) {
    document.getElementById(modalId).classList.add('hidden');
    if (modalId === 'zoomModal') {
        if(charts['zoomCanvas']) {
            charts['zoomCanvas'].destroy();
            delete charts['zoomCanvas'];
        }
        currentZoomChartId = null;
    }
}

function openInfoFromZoom() {
    if (currentZoomChartId) {
        const btn = document.querySelector(`.btn-info[data-chart="${currentZoomChartId}"]`);
        if (btn) btn.click();
    }
}

function closeKpiPopover() {
    document.getElementById('kpiPopover').classList.add('hidden');
}

window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeModal('infoModal');
        closeModal('zoomModal');
        closeKpiPopover();
    }
});

window.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal-overlay')) {
        closeModal(e.target.id);
    }
    const popover = document.getElementById('kpiPopover');
    if (!popover.classList.contains('hidden')) {
        if (!e.target.closest('.kpi-card') && !e.target.closest('#kpiPopover')) {
            closeKpiPopover();
        }
    }
});

// ════════════════════════════════════════════════════
//  EVENT LISTENERS & CSV PARSER
// ════════════════════════════════════════════════════

function bootApp() {
    renderAll();

    if (typeof Chart === 'undefined') {
        setTimeout(bootApp, 50);
        return;
    }
    initChartDefaults();

    document.addEventListener('click', (e) => {
        const infoBtn = e.target.closest('.btn-info');
        if (infoBtn) {
            openInfoModal(infoBtn.dataset.title, infoBtn.dataset.icon, infoBtn.dataset.color, infoBtn.dataset.unit, infoBtn.dataset.desc);
            return;
        }
        const zoomBtn = e.target.closest('.btn-zoom');
        if (zoomBtn) {
            openZoomModal(zoomBtn.dataset.chart, zoomBtn.dataset.title, zoomBtn.dataset.icon, zoomBtn.dataset.color, zoomBtn.dataset.sub);
            return;
        }
        const kpiBtn = e.target.closest('.kpi-info-btn');
        if (kpiBtn) {
            const card = kpiBtn.closest('.kpi-card');
            const info = kpiBtn.dataset.info || 'KPI Description';
            const kpiPopover = document.getElementById('kpiPopover');
            const kpiText = document.getElementById('kpiPopoverText');
            if (kpiText) kpiText.textContent = info;
            if (card && kpiPopover) {
                card.appendChild(kpiPopover);
                kpiPopover.classList.remove('hidden');
            }
            return;
        }
    });

    const startDateInput = document.getElementById('startDate');
    const endDateInput = document.getElementById('endDate');
    const rangeInput = document.getElementById('dateRangePicker');
    const granBtns = document.querySelectorAll('.gran-btn');

    let fpInstance = null;
    if (rangeInput && typeof flatpickr !== 'undefined') {
        fpInstance = flatpickr(rangeInput, {
            mode: "range",
            dateFormat: "Y-m-d",
            altInput: true,
            altFormat: "d-m-Y",
            defaultDate: [startDateInput ? startDateInput.value : "2026-07-17", endDateInput ? endDateInput.value : "2026-07-20"],
            onClose: function(selectedDates) {
                if (selectedDates.length === 2) {
                    if (startDateInput) startDateInput.value = selectedDates[0].toISOString().split('T')[0];
                    if (endDateInput) endDateInput.value = selectedDates[1].toISOString().split('T')[0];
                    renderAll();
                }
            }
        });
    }

    granBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            granBtns.forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            const rangeText = e.target.textContent.trim();
            applyPresetRange(rangeText);
        });
    });

    function applyPresetRange(range) {
        if (!startDateInput || !endDateInput) return;
        let endDate = endDateInput.value ? new Date(endDateInput.value) : new Date();
        if (isNaN(endDate.getTime())) endDate = new Date();
        let startDate = new Date(endDate);
        switch (range) {
            case '1D': startDate.setDate(endDate.getDate() - 1); break;
            case '7D': startDate.setDate(endDate.getDate() - 7); break;
            case '30D': startDate.setDate(endDate.getDate() - 30); break;
            case '6M': startDate.setMonth(endDate.getMonth() - 6); break;
            case '1Y': startDate.setFullYear(endDate.getFullYear() - 1); break;
        }
        const startStr = startDate.toISOString().split('T')[0];
        const endStr = endDate.toISOString().split('T')[0];
        startDateInput.value = startStr;
        endDateInput.value = endStr;
        if (fpInstance) {
            fpInstance.setDate([startStr, endStr]);
        }
        renderAll();
    }

    const fileInput = document.getElementById('csvFile');
    if (fileInput) {
        fileInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (!file) return;
            document.getElementById('fileName').textContent = file.name;
            const reader = new FileReader();
            reader.onload = (evt) => parseCSV(evt.target.result);
            reader.readAsText(file);
        });
    }
}

if (document.readyState === 'loading') {
    window.addEventListener('DOMContentLoaded', bootApp);
} else {
    bootApp();
}

function parseCSV(text) {
    const lines = text.split(/\r?\n/).filter(l => l.trim().length > 0);
    if (lines.length < 2) return;
    const headers = lines[0].split(',').map(h => h.trim());
    const dataRows = lines.slice(1).map(r => r.split(',').map(c => c.trim()));
    const colIdx = (part) => headers.findIndex(h => h.toLowerCase().includes(part.toLowerCase()));
    const rows = dataRows.slice(0, Math.min(dataRows.length, 12));
    
    const coilIdx = colIdx('Coil Number');
    if (coilIdx >= 0) D.coils = rows.map(r => r[coilIdx] || 'Coil');
    D.totalCoils = dataRows.length;

    const getCol = (part) => {
        const idx = colIdx(part);
        if (idx < 0) return rows.map(() => 0);
        return rows.map(r => parseFloat(r[idx]) || 0);
    };

    D.phfExitSP = getCol('PHF Exit SP Avg');
    D.phfExitPV = getCol('PHF Exit PV Avg');
    D.rtfExitSP = getCol('RTF Exit SP Avg');
    D.rtfExitPV = getCol('RTF Exit PV Avg');
    D.sfHeaterSP = getCol('Heater SF SP Avg');
    D.sfHeaterPV = getCol('Heater SF PV Avg');
    D.sfExitSP = getCol('SF Exit SP Avg');
    D.sfExitPV = getCol('SF Exit PV Avg');
    D.hbrExitSP = getCol('HBR Exit SP Avg');
    D.hbrExitPV = getCol('HBR Exit PV Avg');

    D.h2Flow = getCol('Gas H2 Flow Avg');
    D.n2Flow = getCol('Gas N2 Flow Avg');
    D.o2 = getCol('Gas O2 (ppm) Avg');
    D.dewPt = getCol('Gas Dew Point Avg');
    D.combSP = getCol('Comb Air Press SP Avg');
    D.combPV = getCol('Comb Air Press PV Avg');

    renderAll();
}
