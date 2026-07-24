import React from 'react';
import { useFurnaceData, avg } from '../hooks/useFurnaceData';
import { C, lineChartSPPV, comboSpLinePvColumn, singleUnifiedGasPie } from '../utils/chartHelpers';

import Header from '../components/Header';
import KPICard from '../components/KPICard';
import StageCard from '../components/StageCard';
import ZoneTemperatureChart from '../components/ZoneTemperatureChart';
import GasPanel from '../components/GasPanel';

export default function FurnaceDashboard() {
    const { data: D, fileName, handleCSVUpload } = useFurnaceData();

    // 1. KPI Row Calculations
    const phfExitAvg = avg(D.phfExitPV);
    const rtfExitAvg = avg(D.rtfExitPV);
    const sfExitAvg = avg(D.sfExitPV);
    const hbrExitAvg = avg(D.hbrExitPV);
    const avgAGRatio = avg(D.phfZoneAGPV);

    // 2. Gas Averages
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
    const rawGasData = { avgH2, avgN2, avgO2, avgDewPt, avgCombPV };

    return (
        <>
            <Header fileName={fileName} onCSVUpload={handleCSVUpload} />

            <main className="p-[20px_24px] flex flex-col gap-5 max-w-[1920px] mx-auto">
                {/* KPI ROW */}
                <section className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
                    <KPICard label="Total Coils" value={D.totalCoils} colorClass="slate" />
                    <KPICard label="PHF Exit Avg" value={phfExitAvg.toFixed(1)} unit="°C" colorClass="blue" />
                    <KPICard label="RTF Exit Avg" value={rtfExitAvg.toFixed(1)} unit="°C" colorClass="green" />
                    <KPICard label="SF Exit Avg" value={sfExitAvg.toFixed(1)} unit="°C" colorClass="orange" />
                    <KPICard label="HBR Exit Avg" value={hbrExitAvg.toFixed(1)} unit="°C" colorClass="purple" />
                    <KPICard label="Avg A/G Ratio" value={avgAGRatio.toFixed(2)} colorClass="cyan" />
                </section>

                {/* PHF (FULL WIDTH) */}
                <StageCard 
                    title="Pre Heat Furnace (PHF)" 
                    accentClass="accent-phf" 
                    iconNode={<i className="fa-solid fa-fire"></i>} 
                    mode={D.phfMode} 
                    colsClass="cols-2"
                >
                    <ZoneTemperatureChart
                        title="Zone Temperature"
                        subtitle="Z1 • Z2 • Z3 • Z4 • Z5 • EXIT PV · Connected Line"
                        iconNode={<i className="fa-solid fa-chart-line"></i>}
                        iconColor="#3b82f6"
                        configFactory={lineChartSPPV}
                        labels={[...D.phfZones, 'EXIT PV']}
                        spData={[...D.phfZoneSP, avg(D.phfExitSP)]}
                        pvData={[...D.phfZonePV, avg(D.phfExitPV)]}
                        yTitle="Temperature (°C)"
                    />
                    <ZoneTemperatureChart
                        title="Air Gas Ratio"
                        subtitle="Z1 • Z2 • Z3 • Z4 • Z5 · SP Line + PV Column"
                        iconNode={<i className="fa-solid fa-sliders"></i>}
                        iconColor="#10b981"
                        configFactory={comboSpLinePvColumn}
                        labels={D.phfZones}
                        spData={D.phfZoneAGSP}
                        pvData={D.phfZoneAGPV}
                        yTitle="Air / Gas Ratio"
                    />
                </StageCard>

                {/* PROCESS ROW 1: RTF (60%) & SF (40%) */}
                <div className="grid gap-5 grid-cols-1 lg:grid-cols-[1.5fr_1fr]">
                    <StageCard 
                        title="Radiant Tube Furnace (RTF)" 
                        accentClass="accent-rtf" 
                        iconNode={<i className="fa-solid fa-circle-radiation"></i>} 
                        mode={D.rtfMode}
                    >
                        <ZoneTemperatureChart
                            title="Zone Temperature"
                            subtitle="Z1 • Z2 • Z3 • EXIT PV · Connected Line"
                            iconNode={<i className="fa-solid fa-chart-line"></i>}
                            iconColor="#10b981"
                            configFactory={lineChartSPPV}
                            labels={[...D.rtfZones, 'EXIT PV']}
                            spData={[...D.rtfZoneSP, avg(D.rtfExitSP)]}
                            pvData={[...D.rtfZonePV, avg(D.rtfExitPV)]}
                            yTitle="Temperature (°C)"
                        />
                    </StageCard>

                    <StageCard 
                        title="Soaking Furnace (SF)" 
                        accentClass="accent-sf" 
                        iconNode={<i className="fa-solid fa-droplet"></i>} 
                        mode={D.sfMode}
                    >
                        <ZoneTemperatureChart
                            title="Zone Temperature"
                            subtitle="HEATER • EXIT PV · Connected Line"
                            iconNode={<i className="fa-solid fa-chart-line"></i>}
                            iconColor="#f59e0b"
                            configFactory={lineChartSPPV}
                            labels={['HEATER', 'EXIT PV']}
                            spData={[avg(D.sfHeaterSP), avg(D.sfExitSP)]}
                            pvData={[avg(D.sfHeaterPV), avg(D.sfExitPV)]}
                            yTitle="Temperature (°C)"
                        />
                    </StageCard>
                </div>

                {/* PROCESS ROW 2: JCF & GAS */}
                <div className="grid gap-5 grid-cols-1 lg:grid-cols-2">
                    <StageCard 
                        title="Jet Cooling (JCF) + Hot Bridle (HBR)" 
                        accentClass="accent-jcf" 
                        iconNode={<i className="fa-solid fa-snowflake"></i>} 
                        mode={D.hbrMode}
                    >
                        <ZoneTemperatureChart
                            title="Zone Temperature"
                            subtitle="Z1 • Z2 • Z3 • EXIT PV · Connected Line"
                            iconNode={<i className="fa-solid fa-chart-line"></i>}
                            iconColor="#8b5cf6"
                            configFactory={lineChartSPPV}
                            labels={['Z1', 'Z2', 'Z3', 'EXIT PV']}
                            spData={[...D.jcfZoneSP, avg(D.hbrExitSP)]}
                            pvData={[...D.jcfZonePV, avg(D.hbrExitPV)]}
                            yTitle="Temperature (°C)"
                        />
                    </StageCard>

                    <StageCard 
                        title="Gas & Atmosphere Parameters" 
                        accentClass="accent-gas" 
                        iconNode={<i className="fa-solid fa-wind"></i>} 
                    >
                        <GasPanel 
                            configFactory={singleUnifiedGasPie}
                            labels={gasLabels}
                            data={gasData}
                            colors={gasColors}
                            rawData={rawGasData}
                        />
                    </StageCard>
                </div>
            </main>
        </>
    );
}
