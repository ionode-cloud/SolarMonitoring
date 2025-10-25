import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { COLOR_VIBRANT_ORANGE, COLOR_ELECTRIC_BLUE } from '../utils/utils';
import '../App.css'

const EfficiencyVsTempChart = ({ data }) => (
  <div className="chart-container-stacked">
    <div className="chart-header-title">Efficiency (%) vs. Panel Temperature (°C)</div>
    <div style={{ width: '100%', height: 300 }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart 
          data={data} 
          margin={{ top: 10, right: 20, left: 0, bottom: 5 }}>
          <CartesianGrid 
          strokeDasharray="3 3" 
          stroke="#374151" />
          <XAxis dataKey="time" 
          stroke="#9ca3af" />
          <YAxis yAxisId="left" 
          stroke={COLOR_VIBRANT_ORANGE} 
          domain={[50, 100]} 
          label={{ value: 'Efficiency (%)', 
          angle: -90, 
          position: 'insideLeft', 
          fill: COLOR_VIBRANT_ORANGE }} />
          <YAxis yAxisId="right" 
          orientation="right" 
          stroke={COLOR_ELECTRIC_BLUE} 
          domain={[30, 60]} 
          label={{ value: 'Temp (°C)', 
          angle: 90, position: 'insideRight', 
          fill: COLOR_ELECTRIC_BLUE }} />
          <Tooltip 
          contentStyle={{ backgroundColor: '#1a1a1a', 
          border: `1px solid ${COLOR_VIBRANT_ORANGE}`, 
          borderRadius: '8px', 
          color: '#fff' }} 
          labelStyle={{ color: COLOR_VIBRANT_ORANGE, 
          fontWeight: 'bold' }} 
          formatter={(value, name) => [`${value.toFixed(name.includes('Temp') ? 1 : 1)}`, name]} />
          <Legend 
          wrapperStyle={{ color: '#f3f4f6',
          paddingTop: '10px' }} />
          <Line yAxisId="left" 
          type="monotone" 
          dataKey="efficiency" 
          stroke={COLOR_VIBRANT_ORANGE} 
          dot={false} 
          name="Efficiency (%)" 
          strokeWidth={2} />
          <Line yAxisId="right" 
          type="monotone" 
          dataKey="panelTemp" 
          stroke={COLOR_ELECTRIC_BLUE} 
          dot={false} 
          name="Temperature (°C)" 
          strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  </div>
);

export default EfficiencyVsTempChart;
