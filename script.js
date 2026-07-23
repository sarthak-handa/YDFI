/* ACPPL GI Furnace Dashboard — script.js v7
   Industrial Dashboard Design Standard (Siemens / ABB / Ignition Perspective Style) */

Chart.defaults.font.family = "'Inter', system-ui, sans-serif";
Chart.defaults.font.size = 11;
Chart.defaults.maintainAspectRatio = false;
Chart.defaults.plugins.legend.labels.usePointStyle = true;
Chart.defaults.plugins.legend.labels.boxWidth = 8;
Chart.defaults.plugins.legend.labels.padding = 16;

// Standard Industrial Palette (Item 7: Blue = SP, Green = PV)
const C = {
    spBlue: '#3b82f6',      // SP (Set Point) Always Blue
    pvGreen: '#10b981',     // PV (Process Value) Always Green
    cyan: '#06b6d4',
    purple: '#8b5cf6',
    red: '#ef4444',
    slate: '#475569',
    indigo: '#6366f1',
    orange: '#f59e0b'
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

    // PHF Zones
    phfZones: ['Z1','Z2','Z3','Z4','Z5'],
    phfZoneSP: [1200, 1200, 1150, 1150, 1100],
    phfZonePV: [1196, 1195, 1147, 1140, 1085],
    phfZoneAGSP: [12.0, 11.5, 11.0, 10.5, 12.0],
    phfZoneAGPV: [12.02, 11.51, 11.0, 10.51, 12.01],
    phfExitSP: [750, 750, 750, 750, 740, 740, 740, 740, 740, 740],
    phfExitPV: [728, 748, 750, 740, 738, 745, 732, 747, 741, 751],

    // RTF Zones
    rtfZones: ['Z1','Z2','Z3'],
    rtfZoneSP: [770, 770, 770],
    rtfZonePV: [752, 780, 771],
    rtfExitSP: [750, 750, 750, 750, 740, 740, 740, 740, 740, 740],
    rtfExitPV: [723, 748, 748, 740, 738, 745, 732, 747, 741, 751],

    // SF
    sfHeaterSP: [750, 750, 750, 750, 750, 750, 750, 750, 750, 750],
    sfHeaterPV: [739, 739, 739, 740, 738, 745, 732, 747, 741, 751],
    sfExitSP:   [720, 720, 720, 720, 720, 720, 720, 715, 715, 715],
    sfExitPV:   [727, 716, 718, 719, 715, 721, 710, 714, 712, 719],

    // JCF & HBR
    jcfZoneSP: [195, 195, 205],
    jcfZonePV: [188, 193, 201],
    hbrExitSP: [460, 460, 460, 460, 460, 460, 460, 460, 460, 460],
    hbrExitPV: [469, 483, 489, 488, 482, 483, 478, 482, 478, 481],

    // Gas & Combustion
    h2Flow: [28.7, 28.8, 28.5, 29.4, 28.5, 28.7, 30.9, 29.7, 29.1, 27.6],
    n2Flow: [244.5, 243.0, 243.3, 243.2, 243.4, 243.3, 242.1, 243.1, 245.9, 240.6],
    o2:     [41.0, 39.0, 40.0, 42.0, 40.0, 39.0, 44.0, 40.0, 39.0, 38.0],
    dewPt:  [-21.0, -20.6, -22.2, -21.4, -22.1, -24.2, -13.4, -18.9, -23.5, -22.0],
    combSP: [900, 900, 900, 900, 900, 900, 900, 900, 900, 900],
    combPV: [899, 900, 900, 900, 900, 900, 900, 900, 900, 900],

    // Modes & Counts
    totalCoils: 109,
    phfMode: 'MANUAL',
    rtfMode: 'AUTO',
    sfMode: 'AUTO',
    hbrMode: 'MANUAL'
};

function avg(arr) {
    if (!arr || !arr.length) return 0;
    return arr.reduce((a, b) => a + b, 0) / arr.length;
}

// ════════════════════════════════════════════════════
//  MODE PILL BADGE UPDATER (Item 5)
// ════════════════════════════════════════════════════

function updateModeBadge(elId, modeStr) {
    const el = document.getElementById(elId);
    if (!el) return;
    const isAuto = modeStr.toUpperCase() === 'AUTO';
    el.className = `mode-badge ${isAuto ? 'mode-auto' : 'mode-manual'}`;
    el.innerHTML = `<span class="mode-dot"></span> ${isAuto ? 'AUTO' : 'MANUAL'}`;
}

// ════════════════════════════════════════════════════
//  RENDER DASHBOARD
// ════════════════════════════════════════════════════

function renderAll() {
    // 1. KPI Row
    const phfExitAvg = avg(D.phfExitPV);
    const rtfExitAvg = avg(D.rtfExitPV);
    const sfExitAvg = avg(D.sfExitPV);
    const hbrExitAvg = avg(D.hbrExitPV);
    const avgAGRatio = avg(D.phfZoneAGPV);

    document.getElementById('k-coils').textContent = D.totalCoils;
    document.getElementById('k-phf').textContent = phfExitAvg.toFixed(1);
    document.getElementById('k-rtf').textContent = rtfExitAvg.toFixed(1);
    document.getElementById('k-sf').textContent = sfExitAvg.toFixed(1);
    document.getElementById('k-hbr').textContent = hbrExitAvg.toFixed(1);
    document.getElementById('k-ag').textContent = avgAGRatio.toFixed(2);

    // 2. Mode Badges
    updateModeBadge('phf-mode-badge', D.phfMode);
    updateModeBadge('rtf-mode-badge', D.rtfMode);
    updateModeBadge('sf-mode-badge', D.sfMode);
    updateModeBadge('jcf-mode-badge', D.hbrMode);

    // 3. PHF Charts (Full Width, Item 1 & 6: Z1..Z5, EXIT PV)
    const phfLabels = [...D.phfZones, 'EXIT PV'];
    const phfSP = [...D.phfZoneSP, avg(D.phfExitSP)];
    const phfPV = [...D.phfZonePV, avg(D.phfExitPV)];
    mk('phfZoneTemp', lineChartSPPV(phfLabels, phfSP, phfPV, 'Temperature (°C)'));
    
    // Air Gas Ratio (Item 9: Same SP/PV line style as temp)
    mk('phfZoneAG', lineChartSPPV(D.phfZones, D.phfZoneAGSP, D.phfZoneAGPV, 'Air / Gas Ratio'));

    // 4. RTF Chart (Row 2, Left)
    const rtfLabels = [...D.rtfZones, 'EXIT PV'];
    const rtfSP = [...D.rtfZoneSP, avg(D.rtfExitSP)];
    const rtfPV = [...D.rtfZonePV, avg(D.rtfExitPV)];
    mk('rtfZoneTemp', lineChartSPPV(rtfLabels, rtfSP, rtfPV, 'Temperature (°C)'));

    // 5. SF Chart (Row 2, Right - Production Flow: PHF → RTF → SF!)
    const sfLabels = ['HEATER', 'EXIT PV'];
    const sfSP = [avg(D.sfHeaterSP), avg(D.sfExitSP)];
    const sfPV = [avg(D.sfHeaterPV), avg(D.sfExitPV)];
    mk('sfZoneTemp', lineChartSPPV(sfLabels, sfSP, sfPV, 'Temperature (°C)'));

    // 6. JCF + HBR Chart (Row 3, Left - Production Flow: JCF → HBR → Gas!)
    const jcfLabels = ['Z1', 'Z2', 'Z3', 'EXIT PV'];
    const jcfSP = [...D.jcfZoneSP, avg(D.hbrExitSP)];
    const jcfPV = [...D.jcfZonePV, avg(D.hbrExitPV)];
    mk('jcfZoneTemp', lineChartSPPV(jcfLabels, jcfSP, jcfPV, 'Temperature (°C)'));

    // 7. Single Unified Gas & Atmosphere Donut Chart (Row 3, Right)
    const avgH2 = avg(D.h2Flow);
    const avgN2 = avg(D.n2Flow);
    const avgO2 = avg(D.o2);
    const avgDewPt = avg(D.dewPt);
    const avgCombPV = avg(D.combPV);

    const gasLabels = [
        'H₂ Flow (Nm³/h)',
        'N₂ Flow (Nm³/h)',
        'O₂ Level (ppm)',
        'Dew Point (|°C|)',
        'Comb Air Press (mmwc)'
    ];
    const gasData = [
        avgH2,
        avgN2,
        avgO2,
        Math.abs(avgDewPt),
        avgCombPV
    ];
    const gasColors = [C.cyan, C.purple, C.red, C.slate, C.indigo];

    mk('gasUnifiedDonut', singleUnifiedGasDonut(gasLabels, gasData, gasColors));

    // Update Gas Summary Chips below chart
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
//  CONNECTED LINE CHART FACTORY (Item 7 & 8: SP Blue Always Top, PV Green Always Bottom)
// ════════════════════════════════════════════════════

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
        options: {
            responsive: true,
            interaction: { mode: 'index', intersect: false },
            plugins: {
                legend: {
                    position: 'top',
                    labels: {
                        usePointStyle: true,
                        boxWidth: 8,
                        font: { size: 12, weight: '700' }
                    }
                },
                // Item 8: Custom Hover Value Labels (Zone 3 \n SP : 874°C \n PV : 868°C)
                tooltip: {
                    padding: 12,
                    cornerRadius: 8,
                    titleFont: { size: 12, weight: '800' },
                    bodyFont: { size: 12, weight: '600' },
                    callbacks: {
                        title: function(items) {
                            if (!items || !items.length) return '';
                            const l = items[0].label;
                            return l.startsWith('Z') ? `Zone ${l.replace('Z','')}` : l;
                        },
                        label: function(ctx) {
                            const isSP = ctx.dataset.label.startsWith('SP');
                            const dsTag = isSP ? 'SP' : 'PV';
                            const unit = yTitle.includes('°C') ? '°C' : (yTitle.includes('Ratio') ? '' : '');
                            const valStr = typeof ctx.raw === 'number' ? (yTitle.includes('Ratio') ? ctx.raw.toFixed(2) : ctx.raw.toFixed(1)) : ctx.raw;
                            return `  ${dsTag} : ${valStr}${unit}`;
                        }
                    }
                }
            },
            scales: {
                x: {
                    grid: { display: false },
                    ticks: { font: { weight: '700', size: 11 } }
                },
                y: {
                    title: { display: true, text: yTitle, font: { weight: '700' } },
                    grid: { color: 'rgba(0, 0, 0, 0.04)' },
                    beginAtZero: false
                }
            }
        }
    };
}

// ════════════════════════════════════════════════════
//  SINGLE UNIFIED GAS DONUT CHART FACTORY
// ════════════════════════════════════════════════════

function singleUnifiedGasDonut(labels, data, colors) {
    return {
        type: 'doughnut',
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
            cutout: '68%',
            plugins: {
                legend: {
                    position: 'top',
                    labels: {
                        usePointStyle: true,
                        padding: 14,
                        font: { size: 11, weight: '700' }
                    }
                },
                tooltip: {
                    padding: 10,
                    cornerRadius: 8,
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

// ════════════════════════════════════════════════════
//  EVENT LISTENERS & CSV PARSER
// ════════════════════════════════════════════════════

window.addEventListener('DOMContentLoaded', () => {
    renderAll();

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
