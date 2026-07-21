/* ===================================================================
   ACPPL GI Furnace Dashboard — script.js (v2)
   Static data · Story-driven · Production-ready
   =================================================================== */

// ─── Chart.js Global Config ───
Chart.defaults.font.family = "'Inter', system-ui, sans-serif";
Chart.defaults.font.size   = 11;
Chart.defaults.maintainAspectRatio = false;
Chart.defaults.plugins.legend.labels.usePointStyle = true;
Chart.defaults.plugins.legend.labels.boxWidth = 8;
Chart.defaults.plugins.legend.labels.padding = 14;

// ─── Industrial Colour Palette ───
const C = {
    blue:       '#3b82f6',
    blueLight:  'rgba(59,130,246,0.12)',
    green:      '#10b981',
    greenLight: 'rgba(16,185,129,0.12)',
    orange:     '#f59e0b',
    orangeLight:'rgba(245,158,11,0.12)',
    purple:     '#8b5cf6',
    purpleLight:'rgba(139,92,246,0.12)',
    cyan:       '#06b6d4',
    cyanLight:  'rgba(6,182,212,0.12)',
    red:        '#ef4444',
    redLight:   'rgba(239,68,68,0.12)',
    slate:      '#475569',
    slateLight: 'rgba(71,85,105,0.12)',
};

// ─── Chart Instance Store ───
const charts = {};

function makeChart(id, config) {
    if (charts[id]) charts[id].destroy();
    const ctx = document.getElementById(id);
    if (!ctx) return null;
    charts[id] = new Chart(ctx, config);
    return charts[id];
}

// ───────────────────────────────────────────────────────────────
//  STATIC DATA
//  Based on ACPPL GI Furnace operating ranges (Jul 17–20 2026)
//  Values derived from actual furnace CSV reference ranges.
// ───────────────────────────────────────────────────────────────

const DATA = {

    dates: ['Jul 17', 'Jul 18', 'Jul 19', 'Jul 20'],

    totalCoils: 109,

    // ── KPI source values ──
    kpi: {
        avgExitTemp:    696.8,   // °C — Average PHF Exit PV
        avgDeviation:   12.4,    // °C — Average |PHF Exit SP − PV|
        avgAGRatio:     11.40,   // Air/Gas ratio average across 5 zones
        avgH2Flow:      29.2,    // Nm³/hr
        avgFurnacePressure: 895.6 // mmwc — Comb Air Press PV average
    },

    // ── Chart 1: PHF Exit Temperature (daily averages) ──
    phfExit: {
        sp: [710, 720, 715, 710],
        pv: [692, 705, 698, 690]
    },

    // ── Chart 2: PHF Zone Temperature (SP vs PV) ──
    zones: {
        labels: ['Zone 1', 'Zone 2', 'Zone 3', 'Zone 4', 'Zone 5'],
        sp: [1200, 1200, 1150, 1150, 1100],
        pv: [1196, 1193, 1145, 1138, 1082]
    },

    // ── Chart 3: Gas Flow Trend (daily averages) ──
    gasFlow: {
        h2: [29.4, 28.9, 30.2, 29.1],
        n2: [243.2, 244.5, 246.1, 243.8]
    },

    // ── Chart 4: Furnace Stage Temperature ──
    //    RTF uses all 3 zones, SF, JCF, HBR individual
    stages: {
        labels: ['RTF Z1', 'RTF Z2', 'RTF Z3', 'SF', 'JCF', 'HBR'],
        sp: [760, 760, 760, 750, 480, 470],
        pv: [748, 775, 758, 738, 185, 487]
    },

    // ── Chart 5: Combustion & Exhaust (daily averages) ──
    combustion: {
        combSP: [900, 900, 900, 900],
        combPV: [892, 898, 891, 895],
        fumeSP: [-40, -40, -40, -40],
        fumePV: [-40.2, -39.6, -40.5, -40.1]
    },

    // ── Chart 6 (Hero): Exit Temperature Journey ──
    //    Both SP and PV for every stage
    exitJourney: {
        phfSP: [710, 720, 715, 710],
        phfPV: [692, 705, 698, 690],
        rtfSP: [720, 725, 720, 718],
        rtfPV: [712, 718, 714, 710],
        sfSP:  [720, 720, 720, 720],
        sfPV:  [715, 718, 716, 712],
        hbrSP: [460, 460, 460, 460],
        hbrPV: [485, 490, 488, 492]
    }
};


// ───────────────────────────────────────────────────────────────
//  KPI CARDS
// ───────────────────────────────────────────────────────────────

function renderKPIs() {
    document.getElementById('kpi-coils').textContent     = DATA.totalCoils;
    document.getElementById('kpi-exit-temp').textContent  = DATA.kpi.avgExitTemp.toFixed(1);
    document.getElementById('kpi-deviation').textContent  = DATA.kpi.avgDeviation.toFixed(1);
    document.getElementById('kpi-ag-ratio').textContent   = DATA.kpi.avgAGRatio.toFixed(2);
    document.getElementById('kpi-h2-flow').textContent    = DATA.kpi.avgH2Flow.toFixed(1);
    document.getElementById('kpi-pressure').textContent   = DATA.kpi.avgFurnacePressure.toFixed(1);
}


// ───────────────────────────────────────────────────────────────
//  CHART 1 — PHF EXIT TEMPERATURE (Line: SP vs PV over days)
// ───────────────────────────────────────────────────────────────

function renderPHFExitTemp() {
    makeChart('chartPHFExit', {
        type: 'line',
        data: {
            labels: DATA.dates,
            datasets: [
                {
                    label: 'SP (Setpoint)',
                    data: DATA.phfExit.sp,
                    borderColor: C.blue,
                    backgroundColor: C.blueLight,
                    borderWidth: 2,
                    pointRadius: 5,
                    pointHoverRadius: 7,
                    pointBackgroundColor: '#fff',
                    pointBorderColor: C.blue,
                    pointBorderWidth: 2,
                    tension: 0.35,
                    fill: false,
                },
                {
                    label: 'PV (Process Value)',
                    data: DATA.phfExit.pv,
                    borderColor: C.orange,
                    backgroundColor: C.orangeLight,
                    borderWidth: 2,
                    pointRadius: 5,
                    pointHoverRadius: 7,
                    pointBackgroundColor: '#fff',
                    pointBorderColor: C.orange,
                    pointBorderWidth: 2,
                    tension: 0.35,
                    fill: false,
                }
            ]
        },
        options: lineOptions('Temperature (°C)')
    });
}


// ───────────────────────────────────────────────────────────────
//  CHART 2 — PHF ZONE TEMPERATURE (Grouped Bar: SP vs PV)
// ───────────────────────────────────────────────────────────────

function renderZoneTemp() {
    makeChart('chartZoneTemp', {
        type: 'bar',
        data: {
            labels: DATA.zones.labels,
            datasets: [
                {
                    label: 'SP (Setpoint)',
                    data: DATA.zones.sp,
                    backgroundColor: C.blue,
                    borderRadius: 3,
                    barPercentage: 0.7,
                    categoryPercentage: 0.7,
                },
                {
                    label: 'PV (Process Value)',
                    data: DATA.zones.pv,
                    backgroundColor: C.green,
                    borderRadius: 3,
                    barPercentage: 0.7,
                    categoryPercentage: 0.7,
                }
            ]
        },
        options: barOptions('Temperature (°C)', false)
    });
}


// ───────────────────────────────────────────────────────────────
//  CHART 3 — HYDROGEN & NITROGEN FLOW (Multi-Line)
// ───────────────────────────────────────────────────────────────

function renderGasFlow() {
    makeChart('chartGasFlow', {
        type: 'line',
        data: {
            labels: DATA.dates,
            datasets: [
                {
                    label: 'H₂ Flow (Nm³/hr)',
                    data: DATA.gasFlow.h2,
                    borderColor: C.purple,
                    backgroundColor: C.purpleLight,
                    borderWidth: 2,
                    pointRadius: 5,
                    pointHoverRadius: 7,
                    pointBackgroundColor: '#fff',
                    pointBorderColor: C.purple,
                    pointBorderWidth: 2,
                    tension: 0.35,
                    fill: false,
                    yAxisID: 'y',
                },
                {
                    label: 'N₂ Flow (Nm³/hr)',
                    data: DATA.gasFlow.n2,
                    borderColor: C.cyan,
                    backgroundColor: C.cyanLight,
                    borderWidth: 2,
                    pointRadius: 5,
                    pointHoverRadius: 7,
                    pointBackgroundColor: '#fff',
                    pointBorderColor: C.cyan,
                    pointBorderWidth: 2,
                    tension: 0.35,
                    fill: false,
                    yAxisID: 'y1',
                }
            ]
        },
        options: {
            responsive: true,
            interaction: { mode: 'index', intersect: false },
            plugins: {
                legend: { position: 'top' },
                tooltip: { mode: 'index', intersect: false }
            },
            scales: {
                x: { grid: { display: false } },
                y: {
                    type: 'linear',
                    position: 'left',
                    title: { display: true, text: 'H₂ Flow', font: { size: 10, weight: '600' }, color: C.purple },
                    grid: { color: 'rgba(0,0,0,0.04)' },
                    ticks: { color: C.purple }
                },
                y1: {
                    type: 'linear',
                    position: 'right',
                    title: { display: true, text: 'N₂ Flow', font: { size: 10, weight: '600' }, color: C.cyan },
                    grid: { drawOnChartArea: false },
                    ticks: { color: C.cyan }
                }
            }
        }
    });
}


// ───────────────────────────────────────────────────────────────
//  CHART 4 — FURNACE STAGE TEMPERATURE (Grouped Bar)
//  RTF shows all 3 zones; SF, JCF, HBR individual
// ───────────────────────────────────────────────────────────────

function renderFurnaceStages() {
    makeChart('chartStages', {
        type: 'bar',
        data: {
            labels: DATA.stages.labels,
            datasets: [
                {
                    label: 'SP (Setpoint)',
                    data: DATA.stages.sp,
                    backgroundColor: C.blue,
                    borderRadius: 3,
                    barPercentage: 0.65,
                    categoryPercentage: 0.75,
                },
                {
                    label: 'PV (Process Value)',
                    data: DATA.stages.pv,
                    backgroundColor: C.orange,
                    borderRadius: 3,
                    barPercentage: 0.65,
                    categoryPercentage: 0.75,
                }
            ]
        },
        options: barOptions('Temperature (°C)', false)
    });
}


// ───────────────────────────────────────────────────────────────
//  CHART 5 — COMBUSTION & EXHAUST (Multi-Line: SP vs PV)
// ───────────────────────────────────────────────────────────────

function renderCombustion() {
    makeChart('chartCombustion', {
        type: 'line',
        data: {
            labels: DATA.dates,
            datasets: [
                {
                    label: 'Comb Air SP',
                    data: DATA.combustion.combSP,
                    borderColor: C.blue,
                    borderWidth: 2,
                    pointRadius: 5,
                    pointBackgroundColor: '#fff',
                    pointBorderColor: C.blue,
                    pointBorderWidth: 2,
                    tension: 0.3,
                    fill: false,
                    yAxisID: 'y',
                },
                {
                    label: 'Comb Air PV',
                    data: DATA.combustion.combPV,
                    borderColor: C.green,
                    borderWidth: 2,
                    pointRadius: 5,
                    pointBackgroundColor: '#fff',
                    pointBorderColor: C.green,
                    pointBorderWidth: 2,
                    tension: 0.3,
                    fill: false,
                    yAxisID: 'y',
                },
                {
                    label: 'Fume Exh SP',
                    data: DATA.combustion.fumeSP,
                    borderColor: C.orange,
                    borderWidth: 2,
                    borderDash: [6, 3],
                    pointRadius: 5,
                    pointBackgroundColor: '#fff',
                    pointBorderColor: C.orange,
                    pointBorderWidth: 2,
                    tension: 0.3,
                    fill: false,
                    yAxisID: 'y1',
                },
                {
                    label: 'Fume Exh PV',
                    data: DATA.combustion.fumePV,
                    borderColor: C.red,
                    borderWidth: 2,
                    borderDash: [6, 3],
                    pointRadius: 5,
                    pointBackgroundColor: '#fff',
                    pointBorderColor: C.red,
                    pointBorderWidth: 2,
                    tension: 0.3,
                    fill: false,
                    yAxisID: 'y1',
                }
            ]
        },
        options: {
            responsive: true,
            interaction: { mode: 'index', intersect: false },
            plugins: {
                legend: { position: 'top' },
                tooltip: { mode: 'index', intersect: false }
            },
            scales: {
                x: { grid: { display: false } },
                y: {
                    type: 'linear',
                    position: 'left',
                    title: { display: true, text: 'Comb Air (mmwc)', font: { size: 10, weight: '600' } },
                    grid: { color: 'rgba(0,0,0,0.04)' },
                },
                y1: {
                    type: 'linear',
                    position: 'right',
                    title: { display: true, text: 'Fume Exh (mmwc)', font: { size: 10, weight: '600' } },
                    grid: { drawOnChartArea: false },
                }
            }
        }
    });
}


// ───────────────────────────────────────────────────────────────
//  CHART 6 (HERO) — EXIT TEMPERATURE JOURNEY
//  SP (dashed) + PV (solid) for each stage
//  Tells the full story: Desired vs Achieved at every exit
// ───────────────────────────────────────────────────────────────

function renderExitJourney() {
    const ej = DATA.exitJourney;

    // Helper: create a dataset pair (SP dashed, PV solid) with same colour
    function pair(name, spArr, pvArr, color, lightColor) {
        return [
            {
                label: name + ' SP',
                data: spArr,
                borderColor: color,
                backgroundColor: 'transparent',
                borderWidth: 2,
                borderDash: [6, 4],
                pointRadius: 4,
                pointBackgroundColor: '#fff',
                pointBorderColor: color,
                pointBorderWidth: 2,
                tension: 0.35,
                fill: false,
            },
            {
                label: name + ' PV',
                data: pvArr,
                borderColor: color,
                backgroundColor: lightColor,
                borderWidth: 2.5,
                pointRadius: 5,
                pointHoverRadius: 8,
                pointBackgroundColor: '#fff',
                pointBorderColor: color,
                pointBorderWidth: 2.5,
                tension: 0.35,
                fill: false,
            }
        ];
    }

    const datasets = [
        ...pair('PHF', ej.phfSP, ej.phfPV, C.blue, C.blueLight),
        ...pair('RTF', ej.rtfSP, ej.rtfPV, C.green, C.greenLight),
        ...pair('SF',  ej.sfSP,  ej.sfPV,  C.orange, C.orangeLight),
        ...pair('HBR', ej.hbrSP, ej.hbrPV, C.purple, C.purpleLight),
    ];

    makeChart('chartExitJourney', {
        type: 'line',
        data: {
            labels: DATA.dates,
            datasets
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
                        padding: 16,
                        // Show dashed line for SP in legend
                        generateLabels: function(chart) {
                            return chart.data.datasets.map((ds, i) => ({
                                text: ds.label,
                                fillStyle: 'transparent',
                                strokeStyle: ds.borderColor,
                                lineWidth: ds.borderWidth,
                                lineDash: ds.borderDash || [],
                                pointStyle: ds.borderDash ? 'line' : 'circle',
                                hidden: !chart.isDatasetVisible(i),
                                datasetIndex: i
                            }));
                        }
                    }
                },
                tooltip: {
                    mode: 'index',
                    intersect: false,
                    callbacks: {
                        label: function(ctx) {
                            return ctx.dataset.label + ': ' + ctx.parsed.y.toFixed(1) + ' °C';
                        }
                    }
                }
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


// ───────────────────────────────────────────────────────────────
//  SHARED OPTIONS FACTORIES
// ───────────────────────────────────────────────────────────────

function lineOptions(yLabel) {
    return {
        responsive: true,
        interaction: { mode: 'index', intersect: false },
        plugins: {
            legend: { position: 'top' },
            tooltip: {
                mode: 'index',
                intersect: false,
                callbacks: {
                    label: (ctx) => ctx.dataset.label + ': ' + ctx.parsed.y.toFixed(1)
                }
            }
        },
        scales: {
            x: { grid: { display: false } },
            y: {
                title: { display: true, text: yLabel, font: { size: 10, weight: '600' } },
                grid: { color: 'rgba(0,0,0,0.04)' }
            }
        }
    };
}

function barOptions(yLabel, beginAtZero) {
    return {
        responsive: true,
        interaction: { mode: 'index', intersect: false },
        plugins: {
            legend: { position: 'top' },
            tooltip: {
                mode: 'index',
                intersect: false,
                callbacks: {
                    label: (ctx) => ctx.dataset.label + ': ' + ctx.parsed.y.toFixed(1)
                }
            }
        },
        scales: {
            x: { grid: { display: false } },
            y: {
                title: { display: true, text: yLabel, font: { size: 10, weight: '600' } },
                grid: { color: 'rgba(0,0,0,0.04)' },
                beginAtZero: beginAtZero === true
            }
        }
    };
}


// ───────────────────────────────────────────────────────────────
//  INIT — Render everything on load
// ───────────────────────────────────────────────────────────────

window.addEventListener('DOMContentLoaded', () => {
    // Pre-fill filter bar dates
    document.getElementById('startDate').value = '2026-07-17';
    document.getElementById('endDate').value   = '2026-07-20';

    renderKPIs();
    renderPHFExitTemp();
    renderZoneTemp();
    renderGasFlow();
    renderFurnaceStages();
    renderCombustion();
    renderExitJourney();
});
