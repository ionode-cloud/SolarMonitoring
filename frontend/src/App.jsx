import React, { useState, useEffect, useCallback } from 'react';
import MetricCard from './components/MetricCard';
import EfficiencyPanel from './components/EfficiencyPanel';
import RealTimeChart from './components/RealTimeChart';
import EfficiencyVsTempChart from './components/EfficiencyVsTempChart';
import {
  Cpu,
  BatteryCharging,
  Zap,
  Bolt,
  Sun,
  Thermometer,
  Cloud,
  Gauge,
  Compass,
  Server,
  Download,
  TrendingUp
} from "lucide-react";

import {
  fluctuate,
  calculatePowerAndEfficiency,
  initialData,
  MAX_HISTORY_LENGTH,
  SIMULATION_INTERVAL_MS,
  COLOR_BACKGROUND,
  COLOR_ELECTRIC_BLUE,
  COLOR_VIBRANT_ORANGE
} from './utils/utils';
import './App.css';

const App = () => {
  const [data, setData] = useState(initialData);

  useEffect(() => {
    const interval = setInterval(() => {
      setData(prevData => {
        const newLightIntensity = fluctuate(prevData.lightIntensity, 500);
        const newPanelTemp = fluctuate(prevData.panelTemp, 0.5);
        const newDustLevel = fluctuate(prevData.dustLevel, 0.1);
        const newEnergy = prevData.energy + (prevData.power / 3600);

        const calculated = calculatePowerAndEfficiency({
          ...prevData,
          lightIntensity: newLightIntensity,
          panelTemp: newPanelTemp,
          dustLevel: newDustLevel
        });

        const currentTime = new Date().toLocaleTimeString('en-US', { second: '2-digit', minute: '2-digit' });

        const newHistoryPoint = { time: currentTime, power: calculated.newPower, lightIntensity: newLightIntensity };
        const newHistory = [...prevData.performanceHistory, newHistoryPoint];
        if (newHistory.length > MAX_HISTORY_LENGTH) newHistory.shift();

        const newCorrelationPoint = { time: currentTime, efficiency: calculated.newEfficiency, panelTemp: newPanelTemp };
        const newCorrelationHistory = [...prevData.correlationHistory, newCorrelationPoint];
        if (newCorrelationHistory.length > MAX_HISTORY_LENGTH) newCorrelationHistory.shift();

        return {
          ...prevData,
          ...calculated,
          lightIntensity: newLightIntensity,
          panelTemp: newPanelTemp,
          dustLevel: newDustLevel,
          energy: newEnergy,
          performanceHistory: newHistory,
          correlationHistory: newCorrelationHistory,
        };
      });
    }, SIMULATION_INTERVAL_MS);

    return () => clearInterval(interval);
  }, []);

  const handleDownload = useCallback(() => {
    const dataToDownload = {
      timestamp: new Date().toISOString(),
      current_metrics: {
        voltage: `${data.voltage.toFixed(1)} V`,
        current: `${data.current.toFixed(1)} A`,
        power: `${data.power.toFixed(2)} kW`,
        energy: `${data.energy.toFixed(2)} kWh`,
        efficiency: `${data.efficiency.toFixed(1)} %`,
      },
      physical_and_environmental_data: {
        angle: `${data.angle} degrees`,
        panelDirection: data.panelDirection,
        lightIntensity: `${data.lightIntensity.toFixed(0)} Lux`,
        panelTemp: `${data.panelTemp.toFixed(1)} °C`,
        dustLevel: `${data.dustLevel.toFixed(1)} %`,
      },
      performance_history: data.performanceHistory,
      correlation_history: data.correlationHistory,
    };

    const jsonString = JSON.stringify(dataToDownload, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'ai_power_solar_data.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    console.log("Data download initiated.");
  }, [data]);

  return (
    <div className="dashboard-container">
      <header className="header">
        <div>
          <h1 className="header-title">Ai-Power Smart Monitoring System</h1>
          <p className="header-subtitle">
            System Status: <span className="operational-status">GENERATING POWER</span>
          </p>
        </div>
        <div className="header-actions">
          <button onClick={handleDownload} className="download-button" title="Download All Current Data">
            <Download size={18} className="download-icon" />
            DATALOG EXPORT
          </button>
        </div>
      </header>

      <div className="main-grid">
        <div className="metrics-row">
          <EfficiencyPanel efficiency={data.efficiency} />
          <div className="power-metrics-wrapper">
            <h2 className="section-title" style={{ color: COLOR_VIBRANT_ORANGE }}>Primary Core Metrics</h2>
            <div className="card-grid">
              <MetricCard title="Power (Instant)" value={data.power} unit="kW" icon={Cpu} color="primary" precision={2} />
              <MetricCard title="Energy Total" value={data.energy} unit="kWh" icon={BatteryCharging} color="primary" precision={2} />
              <MetricCard title="Voltage" value={data.voltage} unit="V" icon={Zap} color="secondary" />
              <MetricCard title="Current" value={data.current} unit="A" icon={Bolt} color="secondary" />
            </div>
          </div>
        </div>

        <div className="telemetry-row">
          <h2 className="section-title">Telemetry & Environmental Details</h2>
          <div className="card-grid">
            <MetricCard title="Light Intensity" value={data.lightIntensity} unit="Lux" icon={Sun} color="secondary" precision={0} />
            <MetricCard title="Panel Temp" value={data.panelTemp} unit="°C" icon={Thermometer} color="secondary" />
            <MetricCard title="Dust Level" value={data.dustLevel} unit="%" icon={Cloud} color="secondary" />
            <MetricCard title="Inclination Angle" value={data.angle} unit="°" icon={Gauge} color="secondary" precision={0} />
            <MetricCard title="Panel Direction" value={data.panelDirection} unit="" icon={Compass} color="secondary" />
            <MetricCard title="Sensor Health" value="100%" unit="" icon={Server} color="primary" precision={0} />
          </div>
        </div>
        <div className="charts-row">
          <RealTimeChart data={data.performanceHistory} />
          <EfficiencyVsTempChart data={data.correlationHistory} />
        </div>
      </div>
    </div>
  );
};

export default App;
