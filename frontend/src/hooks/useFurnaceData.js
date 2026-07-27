import { useState } from 'react';

const initialDemoData = {
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
    jcfZ1SP: [480, 480, 480, 480, 480, 480, 480, 480, 480, 480],
    jcfZ1PV: [138.3, 174.4, 165.5, 168.4, 168.5, 168.3, 171.6, 173.9, 172.8, 156.9],
    jcfZ2PV: [146.3, 183.9, 173.7, 178.0, 178.5, 173.9, 175.6, 174.8, 175.7, 165.0],
    jcfZ3PV: [153.8, 190.9, 176.6, 178.7, 179.0, 176.4, 174.5, 174.2, 177.3, 170.0],
    hbrSP:   [480, 480, 480, 480, 480, 480, 480, 480, 480, 480],
    hbrPV:   [334.3, 334.0, 333.7, 332.5, 332.9, 330.9, 328.3, 326.7, 327.3, 338.1],
    hbrExitSP: [467.2, 460.0, 460.0, 460.0, 460.0, 460.0, 460.0, 460.0, 460.0, 469.8],
    hbrExitPV: [469.9, 474.0, 469.1, 471.2, 470.0, 463.1, 460.9, 461.2, 464.8, 481.8],

    // Gas & Atmosphere
    fumeBlower: [1095, 1092, 1122, 1094, 1023, 1042, 1015, 1026, 1001, 1089],
    combBlower: [2917, 2947, 2961, 2942, 2903, 2914, 2899, 2905, 2891, 2387],
    h2Conc: [20.01, 20.04, 19.78, 20.07, 19.88, 19.61, 20.26, 20.23, 19.56, 20.1],
    h2Flow: [28.73, 28.80, 28.59, 29.40, 28.58, 28.72, 30.90, 29.72, 29.17, 28.8],
    n2Flow: [244.57, 243.09, 243.36, 243.23, 243.40, 243.33, 242.13, 243.19, 245.94, 243.8],
    o2:     [49.0, 39.0, 40.0, 42.0, 40.0, 39.0, 44.0, 40.0, 39.0, 37.0],
    dewPt:  [-21.0, -20.6, -22.2, -21.4, -22.1, -24.2, -13.4, -18.9, -23.5, -25.1],
    combSP: [900, 900, 900, 900, 900, 900, 900, 900, 900, 900],
    combPV: [899, 900, 900, 900, 900, 900, 900, 900, 900, 900],

    // Modes & Counts
    totalCoils: 109,
    phfMode: 'SEMI-AUTO',
    rtfMode: 'AUTO',
    sfMode: 'SEMI-AUTO',
    hbrMode: 'MANUAL'
};

export function avg(arr) {
    if (typeof arr === 'number') return arr;
    if (!arr || !arr.length) return 0;
    return arr.reduce((a, b) => a + b, 0) / arr.length;
}

export function useFurnaceData() {
    const [data, setData] = useState(initialDemoData);
    const [fileName, setFileName] = useState("Demo Data");

    const parseCSV = (text, name) => {
        const lines = text.split(/\r?\n/).filter(l => l.trim().length > 0);
        if (lines.length < 2) return;
    
        const headers = lines[0].split(',').map(h => h.trim());
        const dataRows = lines.slice(1).map(r => r.split(',').map(c => c.trim()));
    
        const colIdx = (part) => headers.findIndex(h => h.toLowerCase().includes(part.toLowerCase()));
        const rows = dataRows.slice(0, Math.min(dataRows.length, 12));
        
        const getCol = (part) => {
            const idx = colIdx(part);
            if (idx < 0) return rows.map(() => 0);
            return rows.map(r => parseFloat(r[idx]) || 0);
        };
    
        setData(prev => ({
            ...prev,
            totalCoils: dataRows.length,
            phfExitSP: getCol('PHF Exit SP Avg'),
            phfExitPV: getCol('PHF Exit PV Avg'),
            rtfExitSP: getCol('RTF Exit SP Avg'),
            rtfExitPV: getCol('RTF Exit PV Avg'),
            sfHeaterSP: getCol('Heater SF SP Avg'),
            sfHeaterPV: getCol('Heater SF PV Avg'),
            sfExitSP: getCol('SF Exit SP Avg'),
            sfExitPV: getCol('SF Exit PV Avg'),
            jcfZ1SP: getCol('JCF Z1 SP Avg'),
            jcfZ1PV: getCol('JCF Z1 PV Avg'),
            jcfZ2PV: getCol('JCF Z2 PV Avg'),
            jcfZ3PV: getCol('JCF Z3 PV Avg'),
            hbrSP: getCol('Heater HBR SP Avg'),
            hbrPV: getCol('Heater HBR PV Avg'),
            hbrExitSP: getCol('HBR Exit SP Avg'),
            hbrExitPV: getCol('HBR Exit PV Avg'),
            fumeBlower: getCol('Fume Exh Blower'),
            combBlower: getCol('Comb Blower 1'),
            h2Conc: getCol('Gas H2 (%)'),
            h2Flow: getCol('Gas H2 Flow Avg'),
            n2Flow: getCol('Gas N2 Flow Avg'),
            o2: getCol('Gas O2 (ppm) Avg'),
            dewPt: getCol('Gas Dew Point Avg'),
            combSP: getCol('Comb Air Press SP Avg'),
            combPV: getCol('Comb Air Press PV Avg')
        }));
        
        setFileName(name);
    };

    const handleCSVUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = (evt) => parseCSV(evt.target.result, file.name);
        reader.readAsText(file);
    };

    return { data, fileName, handleCSVUpload, setData };
}
