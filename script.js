/* ACPPL GI Furnace Dashboard — script.js v3
   Stage-by-stage · Static data · Report-aligned */

Chart.defaults.font.family = "'Inter', system-ui, sans-serif";
Chart.defaults.font.size = 11;
Chart.defaults.maintainAspectRatio = false;
Chart.defaults.plugins.legend.labels.usePointStyle = true;
Chart.defaults.plugins.legend.labels.boxWidth = 8;
Chart.defaults.plugins.legend.labels.padding = 14;

const C = {
    blue:'#3b82f6', blueL:'rgba(59,130,246,.12)',
    green:'#10b981', greenL:'rgba(16,185,129,.12)',
    orange:'#f59e0b', orangeL:'rgba(245,158,11,.12)',
    purple:'#8b5cf6', purpleL:'rgba(139,92,246,.12)',
    cyan:'#06b6d4', cyanL:'rgba(6,182,212,.12)',
    red:'#ef4444', redL:'rgba(239,68,68,.12)',
    slate:'#475569'
};

const charts = {};
function mk(id, cfg) { if(charts[id]) charts[id].destroy(); charts[id]=new Chart(document.getElementById(id),cfg); }

// ════════════════════════════════════════════════════
//  STATIC DATA — based on actual ACPPL furnace ranges
// ════════════════════════════════════════════════════

const D = {
    dates: ['Jul 17','Jul 18','Jul 19','Jul 20'],

    // KPIs
    totalCoils: 109,
    phfAvgPV: 1150.8,  // avg of 5 zone PVs
    rtfAvgPV: 760.3,   // avg of 3 zone PVs
    sfAvgPV: 738.0,
    hbrAvgPV: 487.0,
    avgAG: 11.40,

    // PHF Zone Temperature
    phfZones: ['Zone 1','Zone 2','Zone 3','Zone 4','Zone 5'],
    phfTempSP: [1200, 1200, 1150, 1150, 1100],
    phfTempPV: [1196, 1193, 1145, 1138, 1082],

    // PHF Zone A/G
    phfAGSP: [12.00, 11.50, 11.00, 10.50, 12.00],
    phfAGPV: [12.01, 11.50, 11.01, 10.50, 11.97],

    // PHF Exit (daily)
    phfExitSP: [710, 720, 715, 710],
    phfExitPV: [692, 705, 698, 690],

    // RTF Zone Temperature
    rtfZones: ['Zone 1','Zone 2','Zone 3'],
    rtfTempSP: [760, 760, 760],
    rtfTempPV: [748, 775, 758],

    // RTF Exit (daily)
    rtfExitSP: [720, 725, 720, 718],
    rtfExitPV: [712, 718, 714, 710],

    // SF (daily)
    sfTempSP: [750, 750, 750, 750],
    sfTempPV: [738, 742, 735, 740],
    sfExitSP: [720, 720, 720, 720],
    sfExitPV: [715, 718, 716, 712],

    // JCF Zone PV (no SP tracking for Z2/Z3)
    jcfZones: ['Zone 1','Zone 2','Zone 3'],
    jcfPV: [185, 195, 202],

    // HBR Exit (daily)
    hbrExitSP: [460, 460, 460, 460],
    hbrExitPV: [485, 490, 488, 492],

    // Gas (daily)
    h2Flow: [29.4, 28.9, 30.2, 29.1],
    n2Flow: [243.2, 244.5, 246.1, 243.8],
    o2:     [42, 38, 45, 40],
    dewPt:  [-22.1, -21.5, -23.0, -22.4],

    // Combustion (daily)
    combSP: [900, 900, 900, 900],
    combPV: [892, 898, 891, 895],
    fumeSP: [-40, -40, -40, -40],
    fumePV: [-40.2, -39.6, -40.5, -40.1]
};

// ════════════════════════════════════════════════════
//  SHARED CHART CONFIG BUILDERS
// ════════════════════════════════════════════════════

function barCfg(labels, datasets, yLabel) {
    return {
        type:'bar', data:{labels, datasets},
        options:{
            responsive:true, interaction:{mode:'index',intersect:false},
            plugins:{legend:{position:'top'},tooltip:{mode:'index',intersect:false}},
            scales:{
                x:{grid:{display:false}},
                y:{title:{display:true,text:yLabel,font:{size:10,weight:'600'}},grid:{color:'rgba(0,0,0,.04)'},beginAtZero:false}
            }
        }
    };
}

function lineCfg(labels, datasets, yLabel) {
    return {
        type:'line', data:{labels, datasets},
        options:{
            responsive:true, interaction:{mode:'index',intersect:false},
            plugins:{legend:{position:'top'},tooltip:{mode:'index',intersect:false,callbacks:{label:c=>c.dataset.label+': '+c.parsed.y.toFixed(1)}}},
            scales:{
                x:{grid:{display:false}},
                y:{title:{display:true,text:yLabel,font:{size:10,weight:'600'}},grid:{color:'rgba(0,0,0,.04)'}}
            }
        }
    };
}

function dualLineCfg(labels, datasets, yL, yR) {
    return {
        type:'line', data:{labels, datasets},
        options:{
            responsive:true, interaction:{mode:'index',intersect:false},
            plugins:{legend:{position:'top'},tooltip:{mode:'index',intersect:false}},
            scales:{
                x:{grid:{display:false}},
                y:{position:'left',title:{display:true,text:yL,font:{size:10,weight:'600'}},grid:{color:'rgba(0,0,0,.04)'}},
                y1:{position:'right',title:{display:true,text:yR,font:{size:10,weight:'600'}},grid:{drawOnChartArea:false}}
            }
        }
    };
}

function barDS(label, data, color) {
    return {label, data, backgroundColor:color, borderRadius:3, barPercentage:.7, categoryPercentage:.7};
}

function lineDS(label, data, color, opts={}) {
    return {label, data, borderColor:color, borderWidth:2, pointRadius:4, pointHoverRadius:6, pointBackgroundColor:'#fff', pointBorderColor:color, pointBorderWidth:2, tension:.35, fill:false, ...opts};
}

// ════════════════════════════════════════════════════
//  RENDER ALL
// ════════════════════════════════════════════════════

window.addEventListener('DOMContentLoaded', () => {

    // ── KPIs ──
    document.getElementById('kpi-coils').textContent = D.totalCoils;
    document.getElementById('kpi-phf').textContent = D.phfAvgPV.toFixed(1);
    document.getElementById('kpi-rtf').textContent = D.rtfAvgPV.toFixed(1);
    document.getElementById('kpi-sf').textContent = D.sfAvgPV.toFixed(1);
    document.getElementById('kpi-hbr').textContent = D.hbrAvgPV.toFixed(1);
    document.getElementById('kpi-ag').textContent = D.avgAG.toFixed(2);

    // ── PHF Zone Temperature ──
    mk('phfZoneTemp', barCfg(D.phfZones, [
        barDS('SP', D.phfTempSP, C.blue),
        barDS('PV', D.phfTempPV, C.green)
    ], 'Temperature (°C)'));

    // ── PHF Zone A/G ──
    mk('phfZoneAG', barCfg(D.phfZones, [
        barDS('SP', D.phfAGSP, C.blue),
        barDS('PV', D.phfAGPV, C.green)
    ], 'A/G Ratio'));

    // ── PHF Exit ──
    mk('phfExit', lineCfg(D.dates, [
        lineDS('SP', D.phfExitSP, C.blue),
        lineDS('PV', D.phfExitPV, C.orange)
    ], 'Temperature (°C)'));

    // ── RTF Zone Temperature ──
    mk('rtfZoneTemp', barCfg(D.rtfZones, [
        barDS('SP', D.rtfTempSP, C.blue),
        barDS('PV', D.rtfTempPV, C.green)
    ], 'Temperature (°C)'));

    // ── RTF Exit ──
    mk('rtfExit', lineCfg(D.dates, [
        lineDS('SP', D.rtfExitSP, C.blue),
        lineDS('PV', D.rtfExitPV, C.green)
    ], 'Temperature (°C)'));

    // ── SF Heater Temperature ──
    mk('sfTemp', lineCfg(D.dates, [
        lineDS('SP', D.sfTempSP, C.blue),
        lineDS('PV', D.sfTempPV, C.orange)
    ], 'Temperature (°C)'));

    // ── SF Exit ──
    mk('sfExit', lineCfg(D.dates, [
        lineDS('SP', D.sfExitSP, C.blue),
        lineDS('PV', D.sfExitPV, C.orange)
    ], 'Temperature (°C)'));

    // ── JCF Zone Temperature ──
    mk('jcfZone', {
        type:'bar', data:{labels:D.jcfZones, datasets:[
            barDS('PV', D.jcfPV, C.purple)
        ]},
        options:{
            responsive:true,
            plugins:{legend:{position:'top'},tooltip:{mode:'index',intersect:false}},
            scales:{x:{grid:{display:false}},y:{title:{display:true,text:'Temperature (°C)',font:{size:10,weight:'600'}},grid:{color:'rgba(0,0,0,.04)'},beginAtZero:false}}
        }
    });

    // ── HBR Exit ──
    mk('hbrExit', lineCfg(D.dates, [
        lineDS('SP', D.hbrExitSP, C.blue),
        lineDS('PV', D.hbrExitPV, C.purple)
    ], 'Temperature (°C)'));

    // ── H₂ & N₂ Flow ──
    mk('gasFlow', dualLineCfg(D.dates, [
        lineDS('H₂ Flow', D.h2Flow, C.purple, {yAxisID:'y'}),
        lineDS('N₂ Flow', D.n2Flow, C.cyan, {yAxisID:'y1'})
    ], 'H₂ (Nm³/hr)', 'N₂ (Nm³/hr)'));

    // ── O₂ & Dew Point ──
    mk('gasO2Dew', dualLineCfg(D.dates, [
        lineDS('O₂ (ppm)', D.o2, C.red, {yAxisID:'y'}),
        lineDS('Dew Point (°C)', D.dewPt, C.slate, {yAxisID:'y1'})
    ], 'O₂ (ppm)', 'Dew Point (°C)'));

    // ── Combustion & Fume Exhaust ──
    mk('gasCombFume', dualLineCfg(D.dates, [
        lineDS('Comb Air SP', D.combSP, C.blue, {yAxisID:'y'}),
        lineDS('Comb Air PV', D.combPV, C.green, {yAxisID:'y'}),
        lineDS('Fume Exh SP', D.fumeSP, C.orange, {yAxisID:'y1', borderDash:[6,3]}),
        lineDS('Fume Exh PV', D.fumePV, C.red, {yAxisID:'y1', borderDash:[6,3]})
    ], 'Comb Air (mmwc)', 'Fume Exh (mmwc)'));

});
