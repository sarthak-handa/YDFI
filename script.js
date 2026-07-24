/* ACPPL GI Furnace Dashboard — script.js v11
   Aligned with APL Apollo CRM Design System Specs */

Chart.defaults.font.family = "'Inter', system-ui, sans-serif";
Chart.defaults.font.size = 12; // CRM Axis labels 12px
Chart.defaults.maintainAspectRatio = false;
Chart.defaults.plugins.legend.labels.usePointStyle = true;
Chart.defaults.plugins.legend.labels.boxWidth = 8;
Chart.defaults.plugins.legend.labels.padding = 16;

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

    jcfZoneSP: [195, 195, 205],
    jcfZonePV: [188, 193, 201],
    hbrExitSP: 460,
    hbrExitPV: 481,

    h2Flow: [28.7, 28.8, 28.5, 29.4, 28.5, 28.7, 30.9, 29.7, 29.1, 27.6],
    n2Flow: [244.5, 243.0, 243.3, 243.2, 243.4, 243.3, 242.1, 243.1, 245.9, 240.6],
    o2:     [41.0, 39.0, 40.0, 42.0, 40.0, 39.0, 44.0, 40.0, 39.0, 38.0],
    dewPt:  [-21.0, -20.6, -22.2, -21.4, -22.1, -24.2, -13.4, -18.9, -23.5, -22.0],
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

    // JCF + HBR
    const jcfLabels = ['JCF Z1', 'JCF Z2', 'JCF Z3'];
    const jcfSP = D.jcfZoneSP;
    const jcfPV = D.jcfZonePV;
    const hbrLabel = 'HBR EXIT';
    const hbrSP = avg(D.hbrExitSP);
    const hbrPV = avg(D.hbrExitPV);
    mk('jcfZoneTemp', jcfHbrChartConfig(jcfLabels, jcfSP, jcfPV, hbrLabel, hbrSP, hbrPV, 'Temperature (°C)'));

    // GAS BAR CHART
    const avgH2 = avg(D.h2Flow);
    const avgN2 = avg(D.n2Flow);
    const avgO2 = avg(D.o2);
    const avgDewPt = avg(D.dewPt);
    const avgCombPV = avg(D.combPV);

    const gasLabels = ['H₂ Flow (Nm³/h)', 'N₂ Flow (Nm³/h)', 'O₂ Level (ppm)', 'Dew Point (°C)', 'Comb Air Press (mmwc)'];
    const gasData = [avgH2, avgN2, avgO2, Math.abs(avgDewPt), avgCombPV];
    const gasColors = [C.cyan, C.purple, C.red, C.slate, C.indigo];

    mk('gasPieChart', gasBarChartConfig(gasLabels, gasData, gasColors, 'Gas Parameters'));

    const chipsContainer = document.getElementById('gasSummaryChips');
    if (chipsContainer) {
        chipsContainer.innerHTML = `
            <div class="gas-chip"><span class="chip-dot" style="background:${C.cyan}"></span><span class="chip-label">H₂ Flow</span><span class="chip-val">${avgH2.toFixed(1)} Nm³/h</span></div>
            <div class="gas-chip"><span class="chip-dot" style="background:${C.purple}"></span><span class="chip-label">N₂ Flow</span><span class="chip-val">${avgN2.toFixed(1)} Nm³/h</span></div>
            <div class="gas-chip"><span class="chip-dot" style="background:${C.red}"></span><span class="chip-label">O₂ Level</span><span class="chip-val">${avgO2.toFixed(1)} ppm</span></div>
            <div class="gas-chip"><span class="chip-dot" style="background:${C.slate}"></span><span class="chip-label">Dew Point</span><span class="chip-val">${avgDewPt.toFixed(1)} °C</span></div>
            <div class="gas-chip"><span class="chip-dot" style="background:${C.indigo}"></span><span class="chip-label">Comb Air Press</span><span class="chip-val">${avgCombPV.toFixed(0)} mmwc</span></div>
        `;
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
            padding: 0 // CRM: Minimize internal whitespace
        },
        interaction: { mode: 'index', intersect: false },
        plugins: {
            legend: {
                position: 'top',
                labels: {
                    usePointStyle: true,
                    boxWidth: 8,
                    padding: 16,
                    font: { size: 13, weight: '600' } // CRM Legend 13px
                }
            },
            tooltip: {
                padding: 12,
                cornerRadius: 8,
                titleFont: { size: 14, weight: '700' }, // CRM Tooltip 14px
                bodyFont: { size: 14, weight: '500' },
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
                ticks: { font: { weight: '600', size: 12 } } // CRM Axis 12px
            },
            y: {
                title: { display: false }, // Removed to save space, header implies it
                grid: { color: 'rgba(0, 0, 0, 0.04)', drawBorder: false },
                beginAtZero: false,
                grace: '18%',
                ticks: { font: { weight: '500', size: 12 } }
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

function jcfHbrChartConfig(jcfLabels, jcfSp, jcfPv, hbrLabel, hbrSp, hbrPv, yTitle) {
    const labels = [...jcfLabels, hbrLabel];
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

function gasBarChartConfig(labels, data, colors, yTitle) {
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
                    titleFont: { size: 14, weight: '700' },
                    bodyFont: { size: 14, weight: '500' },
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
                    ticks: { font: { weight: '600', size: 11 } }
                },
                y: {
                    title: { display: false },
                    grid: { color: 'rgba(0, 0, 0, 0.04)', drawBorder: false },
                    grace: '15%',
                    beginAtZero: true,
                    ticks: { font: { size: 11 } }
                }
            }
        }
    };
}

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

window.addEventListener('DOMContentLoaded', () => {
    renderAll();

    document.querySelectorAll('.btn-info').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const el = e.currentTarget;
            openInfoModal(el.dataset.title, el.dataset.icon, el.dataset.color, el.dataset.unit, el.dataset.desc);
        });
    });

    document.querySelectorAll('.btn-zoom').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const el = e.currentTarget;
            openZoomModal(el.dataset.chart, el.dataset.title, el.dataset.icon, el.dataset.color, el.dataset.sub);
        });
    });

    const kpiPopover = document.getElementById('kpiPopover');
    const kpiText = document.getElementById('kpiPopoverText');
    document.querySelectorAll('.kpi-info-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const card = e.currentTarget.closest('.kpi-card');
            const info = e.currentTarget.dataset.info;
            kpiText.textContent = info;
            card.appendChild(kpiPopover);
            kpiPopover.classList.remove('hidden');
        });
    });

    const startDateInput = document.getElementById('startDate');
    const endDateInput = document.getElementById('endDate');
    const granBtns = document.querySelectorAll('.gran-btn');

    granBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            granBtns.forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            const rangeText = e.target.textContent.trim();
            applyPresetRange(rangeText);
        });
    });

    function applyPresetRange(range) {
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
        startDateInput.value = startDate.toISOString().split('T')[0];
        endDateInput.value = endDate.toISOString().split('T')[0];
        renderAll();
    }

    if (startDateInput) startDateInput.addEventListener('change', () => renderAll());
    if (endDateInput) endDateInput.addEventListener('change', () => renderAll());

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
});

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
