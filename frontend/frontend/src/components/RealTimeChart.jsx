import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { COLOR_VIBRANT_ORANGE, COLOR_ELECTRIC_BLUE } from '../utils/utils';
import '../App.css'

const RealTimeChart = ({ data }) => (
  <div className="chart-container-stacked">
    <div className="chart-header-title">Power Generation (kW) & Light Intensity (Lux)</div>
    <div style={{ width: '100%', height: 300 }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="colorPower" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={COLOR_VIBRANT_ORANGE} stopOpacity={0.8} />
              <stop offset="95%" stopColor={COLOR_VIBRANT_ORANGE} stopOpacity={0.1} />
            </linearGradient>
            <linearGradient id="colorLight" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={COLOR_ELECTRIC_BLUE} stopOpacity={0.8} />
              <stop offset="95%" stopColor={COLOR_ELECTRIC_BLUE} stopOpacity={0.1} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis dataKey="time" stroke="#9ca3af" />
          <YAxis yAxisId="left" stroke={COLOR_VIBRANT_ORANGE} label={{ value: 'Power (kW)', angle: -90, position: 'insideLeft', fill: COLOR_VIBRANT_ORANGE }} />
          <YAxis yAxisId="right" orientation="right" stroke={COLOR_ELECTRIC_BLUE} label={{ value: 'Light (Lux)', angle: 90, position: 'insideRight', fill: COLOR_ELECTRIC_BLUE }} />
          <Tooltip contentStyle={{ backgroundColor: '#1a1a1a', border: `1px solid ${COLOR_VIBRANT_ORANGE}`, borderRadius: '8px', color: '#fff' }} labelStyle={{ color: COLOR_VIBRANT_ORANGE, fontWeight: 'bold' }} formatter={(value, name) => [`${value.toFixed(name.includes('Lux') ? 0 : 2)}`, name]} />
          <Area yAxisId="left" type="monotone" dataKey="power" stroke={COLOR_VIBRANT_ORANGE} fillOpacity={1} fill="url(#colorPower)" name="Power (kW)" strokeWidth={2} />
          <Area yAxisId="right" type="monotone" dataKey="lightIntensity" stroke={COLOR_ELECTRIC_BLUE} fillOpacity={1} fill="url(#colorLight)" name="Light (Lux)" strokeWidth={2} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  </div>
);

export default RealTimeChart;
