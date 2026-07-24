import React from 'react';
import { useFurnaceData, avg } from '../hooks/useFurnaceData';
import { C, lineChartSPPV, comboSpLinePvColumn, gasBarChartConfig, jcfHbrChartConfig } from '../utils/chartHelpers';

import Header from '../components/Header';
import KPICard from '../components/KPICard';
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
        'Dew Point (°C)',
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

            <main className="p-[20px] flex flex-col gap-5 max-w-[1920px] mx-auto bg-slate-50 min-h-screen">
                {/* KPI ROW - 6 Symmetric KPI Cards */}
                <section className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
                    <KPICard label="Total Coils" value={D.totalCoils} colorClass="slate" info="Total coil count currently processed" />
                    <KPICard label="PHF Exit Avg" value={phfExitAvg.toFixed(1)} unit="°C" colorClass="blue" info="Pre-Heat Furnace exit temperature average in °C" />
                    <KPICard label="RTF Exit Avg" value={rtfExitAvg.toFixed(1)} unit="°C" colorClass="green" info="Radiant Tube Furnace exit temperature average in °C" />
                    <KPICard label="SF Exit Avg" value={sfExitAvg.toFixed(1)} unit="°C" colorClass="orange" info="Soaking Furnace exit temperature average in °C" />
                    <KPICard label="HBR Exit Avg" value={hbrExitAvg.toFixed(1)} unit="°C" colorClass="purple" info="Hot Bridle exit temperature average in °C" />
                    <KPICard label="Avg A/G Ratio" value={avgAGRatio.toFixed(2)} colorClass="cyan" info="Average Air-to-Gas combustion ratio across PHF zones" />
                </section>

                {/* STRICT 3-COLUMN CRM GRID */}
                <section className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-5 mb-6">
                    
                    <ZoneTemperatureChart
                        title="PHF Zone Temp (°C)"
                        subtitle="Z1-Z5"
                        iconNode={<i className="fa-solid fa-fire"></i>}
                        iconColor={C.spBlue}
                        accentClass="border-t-blue-500"
                        mode={D.phfMode}
                        configFactory={lineChartSPPV}
                        labels={[...D.phfZones, 'EXIT PV']}
                        spData={[...D.phfZoneSP, avg(D.phfExitSP)]}
                        pvData={[...D.phfZonePV, avg(D.phfExitPV)]}
                        yTitle="Temperature (°C)"
                        infoText="PHF Zone Temperature tracks set points (SP) and process values (PV) in °C across 5 heating zones and exit point."
                    />

                    <ZoneTemperatureChart
                        title="PHF Air Gas Ratio"
                        subtitle="Combustion"
                        iconNode={<i className="fa-solid fa-sliders"></i>}
                        iconColor={C.spBlue}
                        accentClass="border-t-blue-500"
                        configFactory={comboSpLinePvColumn}
                        labels={D.phfZones}
                        spData={D.phfZoneAGSP}
                        pvData={D.phfZoneAGPV}
                        yTitle="Air / Gas Ratio"
                        infoText="Monitors air-to-gas ratio set points vs process columns across PHF zones Z1 to Z5 for combustion efficiency."
                    />

                    <ZoneTemperatureChart
                        title="RTF Zone Temp (°C)"
                        subtitle="Z1-Z3"
                        iconNode={<i className="fa-solid fa-circle-radiation"></i>}
                        iconColor={C.pvGreen}
                        accentClass="border-t-emerald-500"
                        mode={D.rtfMode}
                        configFactory={lineChartSPPV}
                        labels={[...D.rtfZones, 'EXIT PV']}
                        spData={[...D.rtfZoneSP, avg(D.rtfExitSP)]}
                        pvData={[...D.rtfZonePV, avg(D.rtfExitPV)]}
                        yTitle="Temperature (°C)"
                        infoText="RTF Zone Temperature displays radiant heating across Z1, Z2, Z3 and Exit in degree Celsius (°C)."
                    />

                    <ZoneTemperatureChart
                        title="SF Heater Temp (°C)"
                        subtitle="Soaking"
                        iconNode={<i className="fa-solid fa-droplet"></i>}
                        iconColor={C.orange}
                        accentClass="border-t-amber-500"
                        mode={D.sfMode}
                        configFactory={lineChartSPPV}
                        labels={['HEATER', 'EXIT PV']}
                        spData={[avg(D.sfHeaterSP), avg(D.sfExitSP)]}
                        pvData={[avg(D.sfHeaterPV), avg(D.sfExitPV)]}
                        yTitle="Temperature (°C)"
                        infoText="Soaking Furnace monitors strip temperature equilibrium across the main heater unit and exit point in °C."
                    />

                    <ZoneTemperatureChart
                        title="JCF & HBR Temp (°C)"
                        subtitle="Cooling"
                        iconNode={<i className="fa-solid fa-snowflake"></i>}
                        iconColor={C.purple}
                        accentClass="border-t-violet-500"
                        mode={D.hbrMode}
                        configFactory={jcfHbrChartConfig}
                        yTitle="Temperature (°C)"
                        isJcfHbr={true}
                        jcfHbrArgs={{
                            jcfLabels: ['JCF Z1', 'JCF Z2', 'JCF Z3'],
                            jcfSp: D.jcfZoneSP,
                            jcfPv: D.jcfZonePV,
                            hbrLabel: 'HBR EXIT',
                            hbrSp: avg(D.hbrExitSP),
                            hbrPv: avg(D.hbrExitPV)
                        }}
                        infoText="Differentiates Jet Cooling Furnace (JCF Z1-Z3) cooling temperatures and Hot Bridle (HBR Exit) tensioning stage temperatures in °C."
                    />

                    <GasPanel 
                        configFactory={gasBarChartConfig}
                        labels={gasLabels}
                        data={gasData}
                        colors={gasColors}
                        rawData={rawGasData}
                        accentClass="border-t-cyan-500"
                    />

                </section>
            </main>
        </>
    );
}
