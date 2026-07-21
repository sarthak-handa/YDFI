/* ===== ACPPL GI Furnace Dashboard — script.js ===== */

// ─── Chart.js Global Defaults ───
Chart.defaults.font.family = "'Inter', system-ui, sans-serif";
Chart.defaults.font.size   = 11;
Chart.defaults.maintainAspectRatio = false;
Chart.defaults.plugins.legend.labels.usePointStyle = true;
Chart.defaults.plugins.legend.labels.boxWidth = 8;

// ─── Colour Palette (industrial, CRM-matching) ───
const C = {
    blue:       '#3b82f6',
    blueLight:  'rgba(59,130,246,0.15)',
    green:      '#10b981',
    greenLight: 'rgba(16,185,129,0.15)',
    orange:     '#f59e0b',
    orangeLight:'rgba(245,158,11,0.15)',
    purple:     '#8b5cf6',
    purpleLight:'rgba(139,92,246,0.15)',
    cyan:       '#06b6d4',
    cyanLight:  'rgba(6,182,212,0.15)',
    red:        '#ef4444',
    redLight:   'rgba(239,68,68,0.15)',
    slate:      '#475569',
    slateLight: 'rgba(71,85,105,0.15)',
    rose:       '#e11d48',
    amber:      '#d97706',
};

// ─── Application State ───
let rawData    = [];
let charts     = {};

// ─── DOM Refs ───
const elStartDate  = document.getElementById('startDate');
const elEndDate    = document.getElementById('endDate');
const elFileInput  = document.getElementById('csvFile');
const elFileName   = document.getElementById('fileName');

// ─── CSV Parsing ───
function parseCSV(text) {
    const lines = text.trim().split('\n');
    if (lines.length < 2) return [];

    // Parse header (handle quoted fields with commas inside)
    const headers = parseCSVLine(lines[0]);

    const data = [];
    for (let i = 1; i < lines.length; i++) {
        const vals = parseCSVLine(lines[i]);
        if (vals.length < 5) continue; // skip empty/malformed lines

        const row = {};
        headers.forEach((h, idx) => {
            const key = h.trim();
            const val = (vals[idx] || '').trim();
            row[key] = val;
        });

        // Parse date from "Start Time"
        row._date = parseFurnaceDate(row['Start Time']);
        row._dateStr = row._date ? formatDate(row._date) : '';

        data.push(row);
    }
    return data;
}

function parseCSVLine(line) {
    const result = [];
    let current = '';
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
        const ch = line[i];
        if (ch === '"') {
            inQuotes = !inQuotes;
        } else if (ch === ',' && !inQuotes) {
            result.push(current);
            current = '';
        } else {
            current += ch;
        }
    }
    result.push(current);
    return result;
}

// Parse "17-Jul-26 01:03:27" → Date
function parseFurnaceDate(str) {
    if (!str) return null;
    const parts = str.split(' ');
    if (parts.length < 1) return null;
    const dmy = parts[0].split('-');
    if (dmy.length < 3) return null;

    const day   = parseInt(dmy[0]);
    const mon   = monthToNum(dmy[1]);
    let year    = parseInt(dmy[2]);
    if (year < 100) year += 2000;

    return new Date(year, mon, day);
}

function monthToNum(m) {
    const months = { jan:0,feb:1,mar:2,apr:3,may:4,jun:5,jul:6,aug:7,sep:8,oct:9,nov:10,dec:11 };
    return months[(m || '').toLowerCase()] ?? 0;
}

function formatDate(d) {
    if (!d) return '';
    const dd = String(d.getDate()).padStart(2, '0');
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    return `${d.getFullYear()}-${mm}-${dd}`;
}

function formatDateShort(d) {
    if (!d) return '';
    const dd = String(d.getDate()).padStart(2, '0');
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    return `${mm}-${dd}`;
}

// ─── Numeric Accessor (robust) ───
function num(row, key) {
    const v = parseFloat(row[key]);
    return isNaN(v) ? null : v;
}

function avg(arr, key) {
    let sum = 0, count = 0;
    arr.forEach(r => {
        const v = num(r, key);
        if (v !== null) { sum += v; count++; }
    });
    return count ? sum / count : 0;
}

function sumArr(arr, key) {
    let s = 0;
    arr.forEach(r => { const v = num(r, key); if (v !== null) s += v; });
    return s;
}

// ─── Date Filtering ───
function getFiltered() {
    const startVal = elStartDate.value;
    const endVal   = elEndDate.value;

    let filtered = rawData;

    if (startVal) {
        const s = new Date(startVal);
        s.setHours(0,0,0,0);
        filtered = filtered.filter(r => r._date && r._date >= s);
    }
    if (endVal) {
        const e = new Date(endVal);
        e.setHours(23,59,59,999);
        filtered = filtered.filter(r => r._date && r._date <= e);
    }

    return filtered;
}

// ─── Granularity Quick Buttons ───
function setRange(days) {
    // Highlight button
    document.querySelectorAll('.gran-btn').forEach(b => b.classList.remove('active'));
    event.target.classList.add('active');

    if (!rawData.length) return;

    // Find max date in data
    let maxDate = rawData.reduce((mx, r) => r._date && r._date > mx ? r._date : mx, new Date(0));
    let minDate = new Date(maxDate);

    if (days === 365) {
        minDate.setFullYear(minDate.getFullYear() - 1);
    } else if (days === 180) {
        minDate.setMonth(minDate.getMonth() - 6);
    } else {
        minDate.setDate(minDate.getDate() - (days - 1));
    }

    elStartDate.value = formatDate(minDate);
    elEndDate.value   = formatDate(maxDate);
    refresh();
}

// ─── Destroy & Create Chart Helper ───
function makeChart(id, config) {
    if (charts[id]) charts[id].destroy();
    const ctx = document.getElementById(id);
    if (!ctx) return null;
    charts[id] = new Chart(ctx, config);
    return charts[id];
}

// ─── Build KPIs ───
function updateKPIs(data) {
    // Card 1: Total Coils
    document.getElementById('kpi-coils').textContent = data.length;

    // Card 2: Average PHF Exit PV
    const avgPHFExit = avg(data, 'Exit Strip PHF Exit PV Avg');
    document.getElementById('kpi-phf-exit').textContent = avgPHFExit.toFixed(1);

    // Card 3: PHF Exit Deviation (SP - PV)
    let devSum = 0, devCount = 0;
    data.forEach(r => {
        const sp = num(r, 'Exit Strip PHF Exit SP Avg');
        const pv = num(r, 'Exit Strip PHF Exit PV Avg');
        if (sp !== null && pv !== null) {
            devSum += Math.abs(sp - pv);
            devCount++;
        }
    });
    const avgDev = devCount ? devSum / devCount : 0;
    document.getElementById('kpi-deviation').textContent = avgDev.toFixed(1);

    // Card 4: Average H₂ Flow
    const avgH2 = avg(data, 'Gas H2 Flow Avg');
    document.getElementById('kpi-h2').textContent = avgH2.toFixed(1);

    // Card 5: Average N₂ Flow
    const avgN2 = avg(data, 'Gas N2 Flow Avg');
    document.getElementById('kpi-n2').textContent = avgN2.toFixed(1);

    // Card 6: Average Dew Point
    const avgDP = avg(data, 'Gas Dew Point Avg');
    document.getElementById('kpi-dewpoint').textContent = avgDP.toFixed(1);
}

// ─── Group data by date ───
function groupByDate(data) {
    const map = {};
    data.forEach(r => {
        const k = r._dateStr;
        if (!k) return;
        if (!map[k]) map[k] = [];
        map[k].push(r);
    });
    // Sorted keys
    const keys = Object.keys(map).sort();
    return { keys, map };
}

// ─── Chart 1: Temperature Profile (Line) ───
function renderTempProfile(data) {
    const { keys, map } = groupByDate(data);
    const spData = keys.map(k => avg(map[k], 'Exit Strip PHF Exit SP Avg'));
    const pvData = keys.map(k => avg(map[k], 'Exit Strip PHF Exit PV Avg'));
    const labels = keys.map(k => { const d = new Date(k); return formatDateShort(d); });

    makeChart('chartTempProfile', {
        type: 'line',
        data: {
            labels,
            datasets: [
                {
                    label: 'PHF Exit SP Avg',
                    data: spData,
                    borderColor: C.blue,
                    backgroundColor: C.blueLight,
                    borderWidth: 2,
                    pointRadius: 4,
                    pointBackgroundColor: C.blue,
                    tension: 0.3,
                    fill: false,
                },
                {
                    label: 'PHF Exit PV Avg',
                    data: pvData,
                    borderColor: C.orange,
                    backgroundColor: C.orangeLight,
                    borderWidth: 2,
                    pointRadius: 4,
                    pointBackgroundColor: C.orange,
                    tension: 0.3,
                    fill: false,
                }
            ]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { position: 'top' },
                tooltip: { mode: 'index', intersect: false }
            },
            scales: {
                x: { grid: { display: false } },
                y: {
                    title: { display: true, text: 'Temperature (°C)', font: { size: 10, weight: '600' } },
                    grid: { color: 'rgba(0,0,0,0.04)' }
                }
            }
        }
    });
}

// ─── Chart 2: Zone Comparison (Grouped Bar) ───
function renderZoneComparison(data) {
    const zones = ['PHF Z1', 'PHF Z2', 'PHF Z3', 'PHF Z4', 'PHF Z5'];
    const labels = zones.map(z => z.replace('PHF ', 'Zone '));

    const spAvgs = zones.map(z => avg(data, `${z} A/G SP Avg`));
    const pvAvgs = zones.map(z => avg(data, `${z} A/G PV Avg`));

    makeChart('chartZoneComp', {
        type: 'bar',
        data: {
            labels,
            datasets: [
                {
                    label: 'Avg SP',
                    data: spAvgs,
                    backgroundColor: C.blue,
                    borderRadius: 3,
                    barPercentage: 0.7,
                    categoryPercentage: 0.7,
                },
                {
                    label: 'Avg PV',
                    data: pvAvgs,
                    backgroundColor: C.green,
                    borderRadius: 3,
                    barPercentage: 0.7,
                    categoryPercentage: 0.7,
                }
            ]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { position: 'top' },
                tooltip: { mode: 'index', intersect: false }
            },
            scales: {
                x: { grid: { display: false } },
                y: {
                    title: { display: true, text: 'A/G Value', font: { size: 10, weight: '600' } },
                    grid: { color: 'rgba(0,0,0,0.04)' },
                    beginAtZero: false,
                }
            }
        }
    });
}

// ─── Chart 3: Gas Consumption Trend (Multi-Line) ───
function renderGasTrend(data) {
    const { keys, map } = groupByDate(data);
    const h2Data = keys.map(k => avg(map[k], 'Gas H2 Flow Avg'));
    const n2Data = keys.map(k => avg(map[k], 'Gas N2 Flow Avg'));
    const labels = keys.map(k => { const d = new Date(k); return formatDateShort(d); });

    makeChart('chartGasTrend', {
        type: 'line',
        data: {
            labels,
            datasets: [
                {
                    label: 'H₂ Flow Avg',
                    data: h2Data,
                    borderColor: C.purple,
                    backgroundColor: C.purpleLight,
                    borderWidth: 2,
                    pointRadius: 4,
                    pointBackgroundColor: C.purple,
                    tension: 0.3,
                    fill: false,
                },
                {
                    label: 'N₂ Flow Avg',
                    data: n2Data,
                    borderColor: C.cyan,
                    backgroundColor: C.cyanLight,
                    borderWidth: 2,
                    pointRadius: 4,
                    pointBackgroundColor: C.cyan,
                    tension: 0.3,
                    fill: false,
                }
            ]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { position: 'top' },
                tooltip: { mode: 'index', intersect: false }
            },
            scales: {
                x: { grid: { display: false } },
                y: {
                    title: { display: true, text: 'Flow Rate', font: { size: 10, weight: '600' } },
                    grid: { color: 'rgba(0,0,0,0.04)' }
                }
            }
        }
    });
}

// ─── Chart 4: Heating Stage Comparison (Grouped Bar) ───
function renderHeatingStage(data) {
    const stages = [
        { label: 'RTF',  key: 'Heater RTF Z1 PV Avg' },
        { label: 'SF',   key: 'Heater SF PV Avg' },
        { label: 'JCF',  key: 'Heater JCF Z1 PV Avg' },
        { label: 'HBR',  key: 'Heater HBR PV Avg' },
    ];

    const labels = stages.map(s => s.label);
    const pvVals = stages.map(s => avg(data, s.key));

    // Also get SP for comparison where available
    const spKeys = [
        'Heater RTF Z1 SP Avg',
        'Heater SF SP Avg',
        'Heater JCF Z1 SP Avg',
        'Heater HBR SP Avg',
    ];
    const spVals = spKeys.map(k => avg(data, k));

    makeChart('chartHeatStage', {
        type: 'bar',
        data: {
            labels,
            datasets: [
                {
                    label: 'Avg SP',
                    data: spVals,
                    backgroundColor: C.blue,
                    borderRadius: 3,
                    barPercentage: 0.65,
                    categoryPercentage: 0.7,
                },
                {
                    label: 'Avg PV',
                    data: pvVals,
                    backgroundColor: C.orange,
                    borderRadius: 3,
                    barPercentage: 0.65,
                    categoryPercentage: 0.7,
                }
            ]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { position: 'top' },
                tooltip: { mode: 'index', intersect: false }
            },
            scales: {
                x: { grid: { display: false } },
                y: {
                    title: { display: true, text: 'Temperature (°C)', font: { size: 10, weight: '600' } },
                    grid: { color: 'rgba(0,0,0,0.04)' },
                    beginAtZero: false,
                }
            }
        }
    });
}

// ─── Chart 5: Combustion & Exhaust (Line) ───
function renderCombustion(data) {
    const { keys, map } = groupByDate(data);
    const labels = keys.map(k => { const d = new Date(k); return formatDateShort(d); });

    const combSP = keys.map(k => avg(map[k], 'Fume/Comb Comb Air Press SP Avg'));
    const combPV = keys.map(k => avg(map[k], 'Fume/Comb Comb Air Press PV Avg'));
    const fumeSP = keys.map(k => avg(map[k], 'Fume/Comb Fume Exh Press SP (mmwc) Avg'));
    const fumePV = keys.map(k => avg(map[k], 'Fume/Comb Fume Exh Press PV (mmwc) Avg'));

    makeChart('chartCombustion', {
        type: 'line',
        data: {
            labels,
            datasets: [
                {
                    label: 'Comb Air Press SP',
                    data: combSP,
                    borderColor: C.blue,
                    borderWidth: 2,
                    pointRadius: 4,
                    pointBackgroundColor: C.blue,
                    tension: 0.3,
                    fill: false,
                },
                {
                    label: 'Comb Air Press PV',
                    data: combPV,
                    borderColor: C.green,
                    borderWidth: 2,
                    pointRadius: 4,
                    pointBackgroundColor: C.green,
                    tension: 0.3,
                    fill: false,
                },
                {
                    label: 'Fume Exh Press SP',
                    data: fumeSP,
                    borderColor: C.orange,
                    borderWidth: 2,
                    borderDash: [5, 3],
                    pointRadius: 4,
                    pointBackgroundColor: C.orange,
                    tension: 0.3,
                    fill: false,
                },
                {
                    label: 'Fume Exh Press PV',
                    data: fumePV,
                    borderColor: C.red,
                    borderWidth: 2,
                    borderDash: [5, 3],
                    pointRadius: 4,
                    pointBackgroundColor: C.red,
                    tension: 0.3,
                    fill: false,
                }
            ]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { position: 'top' },
                tooltip: { mode: 'index', intersect: false }
            },
            scales: {
                x: { grid: { display: false } },
                y: {
                    title: { display: true, text: 'Pressure', font: { size: 10, weight: '600' } },
                    grid: { color: 'rgba(0,0,0,0.04)' }
                }
            }
        }
    });
}

// ─── Chart 6: Exit Temperature Journey (Hero Multi-Line) ───
function renderExitJourney(data) {
    const { keys, map } = groupByDate(data);
    const labels = keys.map(k => { const d = new Date(k); return formatDateShort(d); });

    const phfExit = keys.map(k => avg(map[k], 'Exit Strip PHF Exit PV Avg'));
    const rtfExit = keys.map(k => avg(map[k], 'Exit Strip RTF Exit PV Avg'));
    const sfExit  = keys.map(k => avg(map[k], 'Exit Strip SF Exit PV Avg'));
    const hbrExit = keys.map(k => avg(map[k], 'Exit Strip HBR Exit PV Avg'));

    makeChart('chartExitJourney', {
        type: 'line',
        data: {
            labels,
            datasets: [
                {
                    label: 'PHF Exit PV',
                    data: phfExit,
                    borderColor: C.blue,
                    backgroundColor: C.blueLight,
                    borderWidth: 2.5,
                    pointRadius: 5,
                    pointBackgroundColor: C.blue,
                    tension: 0.35,
                    fill: false,
                },
                {
                    label: 'RTF Exit PV',
                    data: rtfExit,
                    borderColor: C.green,
                    backgroundColor: C.greenLight,
                    borderWidth: 2.5,
                    pointRadius: 5,
                    pointBackgroundColor: C.green,
                    tension: 0.35,
                    fill: false,
                },
                {
                    label: 'SF Exit PV',
                    data: sfExit,
                    borderColor: C.orange,
                    backgroundColor: C.orangeLight,
                    borderWidth: 2.5,
                    pointRadius: 5,
                    pointBackgroundColor: C.orange,
                    tension: 0.35,
                    fill: false,
                },
                {
                    label: 'HBR Exit PV',
                    data: hbrExit,
                    borderColor: C.purple,
                    backgroundColor: C.purpleLight,
                    borderWidth: 2.5,
                    pointRadius: 5,
                    pointBackgroundColor: C.purple,
                    tension: 0.35,
                    fill: false,
                }
            ]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { position: 'top' },
                tooltip: { mode: 'index', intersect: false }
            },
            scales: {
                x: {
                    grid: { display: false },
                    title: { display: true, text: 'Date', font: { size: 10, weight: '600' } }
                },
                y: {
                    title: { display: true, text: 'Temperature (°C)', font: { size: 10, weight: '600' } },
                    grid: { color: 'rgba(0,0,0,0.04)' }
                }
            }
        }
    });
}

// ─── Master Refresh ───
function refresh() {
    const data = getFiltered();
    updateKPIs(data);
    renderTempProfile(data);
    renderZoneComparison(data);
    renderGasTrend(data);
    renderHeatingStage(data);
    renderCombustion(data);
    renderExitJourney(data);
}

// ─── File Input Handler ───
elFileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;
    elFileName.textContent = file.name;

    const reader = new FileReader();
    reader.onload = (evt) => {
        rawData = parseCSV(evt.target.result);
        initDateRange();
        refresh();
    };
    reader.readAsText(file);
});

// Set date inputs to data range
function initDateRange() {
    if (!rawData.length) return;
    let minD = rawData[0]._date;
    let maxD = rawData[0]._date;
    rawData.forEach(r => {
        if (r._date && r._date < minD) minD = r._date;
        if (r._date && r._date > maxD) maxD = r._date;
    });
    elStartDate.value = formatDate(minD);
    elEndDate.value   = formatDate(maxD);
}

// Date change handlers
elStartDate.addEventListener('change', refresh);
elEndDate.addEventListener('change', refresh);

// ─── Auto-Load CSV ───
window.addEventListener('DOMContentLoaded', () => {
    // Try to fetch default CSV from same directory
    fetch('Furnace_Report_17-07-2026_to_20-07-2026.csv')
        .then(res => {
            if (!res.ok) throw new Error('CSV not found');
            return res.text();
        })
        .then(text => {
            rawData = parseCSV(text);
            elFileName.textContent = 'Furnace_Report_17-07-2026_to_20-07-2026.csv';
            initDateRange();
            // Auto-select All range
            refresh();
        })
        .catch(() => {
            // No auto-load, user must upload
            console.log('No default CSV found. Please upload a CSV file.');
        });
});
