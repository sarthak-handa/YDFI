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
    jcfZoneSP: [195, 195, 205],
    jcfZonePV: [188, 193, 201],
    hbrExitSP: 460,
    hbrExitPV: 481,

    // Gas & Combustion
    h2Flow: [28.7, 28.8, 28.5, 29.4, 28.5, 28.7, 30.9, 29.7, 29.1, 27.6],
    n2Flow: [244.5, 243.0, 243.3, 243.2, 243.4, 243.3, 242.1, 243.1, 245.9, 240.6],
    o2:     [41.0, 39.0, 40.0, 42.0, 40.0, 39.0, 44.0, 40.0, 39.0, 38.0],
    dewPt:  [-21.0, -20.6, -22.2, -21.4, -22.1, -24.2, -13.4, -18.9, -23.5, -22.0],
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
            hbrExitSP: getCol('HBR Exit SP Avg'),
            hbrExitPV: getCol('HBR Exit PV Avg'),
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
