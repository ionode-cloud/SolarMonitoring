import React from 'react';
import { COLOR_VIBRANT_ORANGE, COLOR_ELECTRIC_BLUE, COLOR_ALERT } from '../utils/utils';
import { TrendingUp } from 'lucide-react';
import '../App.css'

const EfficiencyPanel = ({ efficiency }) => {
  let color = COLOR_VIBRANT_ORANGE;
  let statusText = 'Optimal';
  if (efficiency < 75) { color = COLOR_ELECTRIC_BLUE; statusText = 'Monitoring'; }
  if (efficiency < 60) { color = COLOR_ALERT; statusText = 'Critical Low'; }

  return (
    <div className="efficiency-card" style={{ border: `1px solid ${color}` }}>
      <div className="efficiency-title" style={{ color }}>
        <TrendingUp size={20} style={{ marginRight: '8px' }} />
        Total Array Efficiency
      </div>
      <div className="efficiency-value" style={{ color }}>{efficiency.toFixed(1)}%</div>
      <div className="efficiency-status" style={{ color: '#9ca3af' }}>
        Status: <span style={{ color }}>{statusText}</span>
      </div>
    </div>
  );
};

export default EfficiencyPanel;
