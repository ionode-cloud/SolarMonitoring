import React, { useState, useEffect, useCallback } from 'react';
import MetricCard from './components/MetricCard';
import EfficiencyPanel from './components/EfficiencyPanel';
import RealTimeChart from './components/RealTimeChart';
import EfficiencyVsTempChart from './components/EfficiencyVsTempChart';
import { Download, Cpu, BatteryCharging, Zap, Bolt, Sun, Thermometer, Cloud, Gauge, Compass, Server } from "lucide-react";
import './App.css';

const SIMULATION_INTERVAL_MS = 5000; // fetch every 5 seconds

const App = () => {
  const [data, setData] = useState(null);

  // Fetch API
  const fetchSolarData = async () => {
    try {
      const res = await fetch('https://solarmonitoring.ionode.cloud/api/data');
      const json = await res.json();
      if (json?.data) {
        const apiData = json.data;

        const currentTime = new Date().toLocaleTimeString('en-US', { hour12: false });

        setData(prev => ({
          voltage: apiData.voltage,
          current: apiData.current,
          power: apiData.power,
          energy: apiData.energyTotal,
          efficiency: apiData.totalEfficiency,
          lightIntensity: apiData.lightIntensity,
          panelTemp: apiData.panelTemp,
          dustLevel: apiData.dustLevel,
          angle: apiData.inclinationAngle,
          panelDirection: apiData.panelDirection,
          sensorHealth: apiData.sensorHealth,
          performanceHistory: prev?.performanceHistory
            ? [...prev.performanceHistory, { time: currentTime, power: apiData.power, lightIntensity: apiData.lightIntensity }]
            : [{ time: currentTime, power: apiData.power, lightIntensity: apiData.lightIntensity }],
          correlationHistory: prev?.correlationHistory
            ? [...prev.correlationHistory, { time: currentTime, efficiency: apiData.totalEfficiency, panelTemp: apiData.panelTemp }]
            : [{ time: currentTime, efficiency: apiData.totalEfficiency, panelTemp: apiData.panelTemp }],
        }));
      }
    } catch (err) {
      console.error("Error fetching solar data:", err);
    }
  };

  useEffect(() => {
    fetchSolarData(); // initial fetch
    const interval = setInterval(fetchSolarData, SIMULATION_INTERVAL_MS);
    return () => clearInterval(interval);
  }, []);

  const handleDownload = useCallback(() => {
    if (!data) return;

    const jsonString = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'solar_live_data.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    console.log("Data download initiated.");
  }, [data]);

  if (!data) return <p style={{ color: '#fff', padding: '20px' }}>Loading data...</p>;

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
            <h2 className="section-title">Primary Core Metrics</h2>
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
            <MetricCard title="Sensor Health" value={data.sensorHealth} unit="" icon={Server} color="primary" precision={0} />
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
