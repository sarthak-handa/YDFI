/* ACPPL GI Furnace Dashboard — script.js v4
   Per-coil tracking · Self-contained stage modules · Automatic status rules · CSV Upload */

Chart.defaults.font.family = "'Inter', system-ui, sans-serif";
Chart.defaults.font.size = 11;
Chart.defaults.maintainAspectRatio = false;
Chart.defaults.plugins.legend.labels.usePointStyle = true;
Chart.defaults.plugins.legend.labels.boxWidth = 8;
Chart.defaults.plugins.legend.labels.padding = 14;

const C = {
    blue:'#3b82f6', blueL:'rgba(59,130,246,.15)',
    green:'#10b981', greenL:'rgba(16,185,129,.15)',
    orange:'#f59e0b', orangeL:'rgba(245,158,11,.15)',
    purple:'#8b5cf6', purpleL:'rgba(139,92,246,.15)',
    cyan:'#06b6d4', cyanL:'rgba(6,182,212,.15)',
    red:'#ef4444', redL:'rgba(239,68,68,.15)',
    slate:'#475569'
};

const charts = {};
function mk(id, cfg) {
    if(charts[id]) charts[id].destroy();
    const el = document.getElementById(id);
    if(el) charts[id] = new Chart(el, cfg);
}

// ════════════════════════════════════════════════════
//  DEFAULT STATIC DATA (Representative 10 Coils from CSV)
// ════════════════════════════════════════════════════

let D = {
    coils: ['C07G0864','C07G0628','C07G0629','C07G0627','C07G0949','C07G0625','C07G0948','C07G0952','C07G0767','C07G0621'],

    // PHF Zone averages across coils
    phfZones: ['Zone 1','Zone 2','Zone 3','Zone 4','Zone 5'],
    phfZoneSP: [1200, 1200, 1150, 1150, 1100],
    phfZonePV: [1196, 1195, 1147, 1140, 1085],
    phfZoneAGSP: [12.0, 11.5, 11.0, 10.5, 12.0],
    phfZoneAGPV: [12.02, 11.51, 11.0, 10.51, 12.01],

    // PHF Exit per coil
    phfExitSP: [750, 750, 750, 750, 740, 740, 740, 740, 740, 740],
    phfExitPV: [728, 748, 750, 740, 738, 745, 732, 747, 741, 751],

    // RTF Zone averages across coils
    rtfZones: ['Zone 1','Zone 2','Zone 3'],
    rtfZoneSP: [770, 770, 770],
    rtfZonePV: [752, 780, 771],

    // RTF Exit per coil
    rtfExitSP: [750, 750, 750, 750, 740, 740, 740, 740, 740, 740],
    rtfExitPV: [723, 748, 748, 740, 738, 745, 732, 747, 741, 751],

    // SF per coil
    sfHeaterSP: [750, 750, 750, 750, 750, 750, 750, 750, 750, 750],
    sfHeaterPV: [739, 739, 739, 740, 738, 745, 732, 747, 741, 751],
    sfExitSP:   [720, 720, 720, 720, 720, 720, 720, 715, 715, 715],
    sfExitPV:   [727, 716, 718, 719, 715, 721, 710, 714, 712, 719],

    // JCF & HBR per coil
    jcfZonePV: [188, 193, 201],
    hbrExitSP: [460, 460, 460, 460, 460, 460, 460, 460, 460, 460],
    hbrExitPV: [469, 483, 489, 488, 482, 483, 478, 482, 478, 481],

    // Gas & Combustion per coil
    h2Flow: [28.7, 28.8, 28.5, 29.4, 28.5, 28.7, 30.9, 29.7, 29.1, 27.6],
    n2Flow: [244.5, 243.0, 243.3, 243.2, 243.4, 243.3, 242.1, 243.1, 245.9, 240.6],
    o2:     [49.0, 39.0, 40.0, 42.0, 40.0, 39.0, 44.0, 40.0, 39.0, 38.0],
    dewPt:  [-21.0, -20.6, -22.2, -21.4, -22.1, -24.2, -13.4, -18.9, -23.5, -22.0],
    combSP: [900, 900, 900, 900, 900, 900, 900, 900, 900, 900],
    combPV: [899, 900, 900, 900, 900, 900, 900, 900, 900, 900],
    fumeSP: [-40, -40, -40, -40, -40, -40, -40, -40, -40, -40],
    fumePV: [-40, -40, -40, -40, -40, -40, -40, -40, -40, -40],

    // Modes & Counts
    totalCoils: 109,
    phfMode: 'MANUAL',
    rtfMode: 'AUTO',
    sfMode: 'AUTO',
    hbrMode: 'MANUAL'
};

// ════════════════════════════════════════════════════
//  STATUS COMPUTATION RULES (Plant Engineer Logic)
// ════════════════════════════════════════════════════

function setStatus(elId, devAvg, threshAlert, threshWarn) {
    const el = document.getElementById(elId);
    if (!el) return;
    if (devAvg >= threshAlert) {
        el.className = 'status-badge status-red';
        el.textContent = '🔴 Attention Required';
    } else if (devAvg >= threshWarn) {
        el.className = 'status-badge status-yellow';
        el.textContent = '🟡 Slight Deviation';
    } else {
        el.className = 'status-badge status-green';
        el.textContent = '🟢 Healthy';
    }
}

function avg(arr) {
    if (!arr || !arr.length) return 0;
    return arr.reduce((a, b) => a + b, 0) / arr.length;
}

function devAvg(spArr, pvArr) {
    if (!spArr || !pvArr || !spArr.length) return 0;
    let sum = 0;
    for (let i = 0; i < spArr.length; i++) {
        sum += Math.abs((spArr[i] || 0) - (pvArr[i] || 0));
    }
    return sum / spArr.length;
}

// ════════════════════════════════════════════════════
//  RENDER DASHBOARD & MODULE METRICS
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

    // 2. PHF Module Summary & Status
    const phfDev = devAvg(D.phfExitSP, D.phfExitPV);
    document.getElementById('phf-avgtemp').textContent = avg(D.phfZonePV).toFixed(1) + ' °C';
    document.getElementById('phf-avgag').textContent = avgAGRatio.toFixed(2);
    document.getElementById('phf-exit').textContent = phfExitAvg.toFixed(1) + ' °C';
    document.getElementById('phf-dev').textContent = phfDev.toFixed(1) + ' °C';
    document.getElementById('phf-mode').textContent = D.phfMode;
    setStatus('phf-status', phfDev, 25, 12);

    // 3. RTF Module Summary & Status
    const rtfDev = devAvg(D.rtfExitSP, D.rtfExitPV);
    document.getElementById('rtf-avgtemp').textContent = avg(D.rtfZonePV).toFixed(1) + ' °C';
    document.getElementById('rtf-exit').textContent = rtfExitAvg.toFixed(1) + ' °C';
    document.getElementById('rtf-dev').textContent = rtfDev.toFixed(1) + ' °C';
    document.getElementById('rtf-mode').textContent = D.rtfMode;
    setStatus('rtf-status', rtfDev, 20, 10);

    // 4. SF Module Summary & Status
    const sfDev = devAvg(D.sfExitSP, D.sfExitPV);
    document.getElementById('sf-heater').textContent = avg(D.sfHeaterPV).toFixed(1) + ' °C';
    document.getElementById('sf-exit').textContent = sfExitAvg.toFixed(1) + ' °C';
    document.getElementById('sf-dev').textContent = sfDev.toFixed(1) + ' °C';
    document.getElementById('sf-mode').textContent = D.sfMode;
    setStatus('sf-status', sfDev, 15, 8);

    // 5. JCF + HBR Summary & Status
    const hbrDev = devAvg(D.hbrExitSP, D.hbrExitPV);
    document.getElementById('jcf-z1').textContent = (D.jcfZonePV[0] || 0).toFixed(1) + ' °C';
    document.getElementById('hbr-pv').textContent = avg(D.hbrExitPV).toFixed(1) + ' °C';
    document.getElementById('hbr-exit').textContent = hbrExitAvg.toFixed(1) + ' °C';
    document.getElementById('hbr-mode').textContent = D.hbrMode;
    setStatus('jcf-status', hbrDev, 30, 15);

    // 6. Gas & Combustion Summary & Status
    document.getElementById('gas-h2').textContent = avg(D.h2Flow).toFixed(1) + ' Nm³/h';
    document.getElementById('gas-n2').textContent = avg(D.n2Flow).toFixed(1) + ' Nm³/h';
    document.getElementById('gas-o2').textContent = avg(D.o2).toFixed(1) + ' ppm';
    document.getElementById('gas-dew').textContent = avg(D.dewPt).toFixed(1) + ' °C';
    document.getElementById('gas-comb').textContent = avg(D.combPV).toFixed(1) + ' mmwc';
    setStatus('gas-status', Math.abs(avg(D.combPV) - avg(D.combSP)), 15, 5);

    // ── CHARTS (Bar charts for quick SP vs PV comparisons across coils & zones) ──

    // PHF Charts
    mk('phfZoneTemp', barChart(D.phfZones, D.phfZoneSP, D.phfZonePV, 'Temperature (°C)', C.blue, C.green));
    mk('phfZoneAG', barChart(D.phfZones, D.phfZoneAGSP, D.phfZoneAGPV, 'A/G Ratio', C.blue, C.green));
    mk('phfExit', barChart(D.coils, D.phfExitSP, D.phfExitPV, 'Temperature (°C)', C.blue, C.orange));

    // RTF Charts
    mk('rtfZoneTemp', barChart(D.rtfZones, D.rtfZoneSP, D.rtfZonePV, 'Temperature (°C)', C.blue, C.green));
    mk('rtfExit', barChart(D.coils, D.rtfExitSP, D.rtfExitPV, 'Temperature (°C)', C.blue, C.green));

    // SF Charts
    mk('sfTemp', barChart(D.coils, D.sfHeaterSP, D.sfHeaterPV, 'Temperature (°C)', C.blue, C.orange));
    mk('sfExit', barChart(D.coils, D.sfExitSP, D.sfExitPV, 'Temperature (°C)', C.blue, C.orange));

    // JCF & HBR Charts
    mk('jcfZone', {
        type: 'bar',
        data: { labels: D.rtfZones, datasets: [{ label: 'PV (Process Value)', data: D.jcfZonePV, backgroundColor: C.purple, borderRadius: 4 }] },
        options: barOpts('Temperature (°C)')
    });
    mk('hbrExitChart', barChart(D.coils, D.hbrExitSP, D.hbrExitPV, 'Temperature (°C)', C.blue, C.purple));

    // Gas & Combustion Charts
    mk('gasFlow', dualLineChart(D.coils, D.h2Flow, D.n2Flow, 'H₂ Flow', 'N₂ Flow', C.purple, C.cyan, 'Nm³/h', 'Nm³/h'));
    mk('gasO2', dualLineChart(D.coils, D.o2, D.dewPt, 'O₂ (ppm)', 'Dew Point (°C)', C.red, C.slate, 'ppm', '°C'));
    mk('gasComb', barChart(D.coils, D.combSP, D.combPV, 'Comb Air Pressure (mmwc)', C.blue, C.green));
}

// ════════════════════════════════════════════════════
//  CHART FACTORIES
// ════════════════════════════════════════════════════

function barChart(labels, spData, pvData, yTitle, c1, c2) {
    return {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [
                { label: 'SP (Setpoint)', data: spData, backgroundColor: c1, borderRadius: 3, barPercentage: 0.65 },
                { label: 'PV (Process Value)', data: pvData, backgroundColor: c2, borderRadius: 3, barPercentage: 0.65 }
            ]
        },
        options: barOpts(yTitle)
    };
}

function dualLineChart(labels, d1, d2, l1, l2, c1, c2, u1, u2) {
    return {
        type: 'line',
        data: {
            labels: labels,
            datasets: [
                { label: l1, data: d1, borderColor: c1, borderWidth: 2, pointRadius: 3, tension: 0.3, yAxisID: 'y' },
                { label: l2, data: d2, borderColor: c2, borderWidth: 2, pointRadius: 3, tension: 0.3, yAxisID: 'y1' }
            ]
        },
        options: {
            responsive: true, interaction: { mode: 'index', intersect: false },
            plugins: { legend: { position: 'top' } },
            scales: {
                x: { grid: { display: false } },
                y: { position: 'left', title: { display: true, text: l1, font: { weight: '600' } }, grid: { color: 'rgba(0,0,0,.04)' } },
                y1: { position: 'right', title: { display: true, text: l2, font: { weight: '600' } }, grid: { drawOnChartArea: false } }
            }
        }
    };
}

function barOpts(yTitle) {
    return {
        responsive: true, interaction: { mode: 'index', intersect: false },
        plugins: { legend: { position: 'top' } },
        scales: {
            x: { grid: { display: false } },
            y: { title: { display: true, text: yTitle, font: { weight: '600' } }, grid: { color: 'rgba(0,0,0,.04)' }, beginAtZero: false }
        }
    };
}

// ════════════════════════════════════════════════════
//  CSV UPLOAD PARSER (Optional user data loading)
// ════════════════════════════════════════════════════

window.addEventListener('DOMContentLoaded', () => {
    renderAll();

    const startDateInput = document.getElementById('startDate');
    const endDateInput = document.getElementById('endDate');
    const granBtns = document.querySelectorAll('.gran-btn');

    // Preset Range Button Handler
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
            case '1D':
                startDate.setDate(endDate.getDate() - 1);
                break;
            case '7D':
                startDate.setDate(endDate.getDate() - 7);
                break;
            case '30D':
                startDate.setDate(endDate.getDate() - 30);
                break;
            case '6M':
                startDate.setMonth(endDate.getMonth() - 6);
                break;
            case '1Y':
                startDate.setFullYear(endDate.getFullYear() - 1);
                break;
            default:
                break;
        }

        startDateInput.value = startDate.toISOString().split('T')[0];
        endDateInput.value = endDate.toISOString().split('T')[0];

        renderAll();
    }

    if (startDateInput) {
        startDateInput.addEventListener('change', () => renderAll());
    }
    if (endDateInput) {
        endDateInput.addEventListener('change', () => renderAll());
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
});

function parseCSV(text) {
    const lines = text.split(/\r?\n/).filter(l => l.trim().length > 0);
    if (lines.length < 2) return;

    const headers = lines[0].split(',').map(h => h.trim());
    const dataRows = lines.slice(1).map(r => r.split(',').map(c => c.trim()));

    // Helper to find column index by partial name match
    const colIdx = (part) => headers.findIndex(h => h.toLowerCase().includes(part.toLowerCase()));
    
    // Extract recent coils (up to 12)
    const coilIdx = colIdx('Coil Number');
    const rows = dataRows.slice(0, Math.min(dataRows.length, 12));
    if (coilIdx >= 0) D.coils = rows.map(r => r[coilIdx] || 'Coil');
    D.totalCoils = dataRows.length;

    // Helper to get float array from rows for a col
    const getCol = (part) => {
        const idx = colIdx(part);
        if (idx < 0) return rows.map(() => 0);
        return rows.map(r => parseFloat(r[idx]) || 0);
    };

    // Update PHF Exit per coil
    D.phfExitSP = getCol('PHF Exit SP Avg');
    D.phfExitPV = getCol('PHF Exit PV Avg');

    // Update RTF Exit per coil
    D.rtfExitSP = getCol('RTF Exit SP Avg');
    D.rtfExitPV = getCol('RTF Exit PV Avg');

    // Update SF per coil
    D.sfHeaterSP = getCol('Heater SF SP Avg');
    D.sfHeaterPV = getCol('Heater SF PV Avg');
    D.sfExitSP = getCol('SF Exit SP Avg');
    D.sfExitPV = getCol('SF Exit PV Avg');

    // Update HBR per coil
    D.hbrExitSP = getCol('HBR Exit SP Avg');
    D.hbrExitPV = getCol('HBR Exit PV Avg');

    // Update Gas & Combustion
    D.h2Flow = getCol('Gas H2 Flow Avg');
    D.n2Flow = getCol('Gas N2 Flow Avg');
    D.o2 = getCol('Gas O2 (ppm) Avg');
    D.dewPt = getCol('Gas Dew Point Avg');
    D.combSP = getCol('Comb Air Press SP Avg');
    D.combPV = getCol('Comb Air Press PV Avg');

    renderAll();
}
