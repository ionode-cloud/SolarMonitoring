import React from 'react';
import { COLOR_VIBRANT_ORANGE, COLOR_ELECTRIC_BLUE, COLOR_ALERT } from '../utils/utils';
import '../App.css'

const MetricCard = ({ title, value, unit, icon: Icon, color, precision = 0 }) => (
  <div className={`metric-card ${color}`}>
    <div className="icon-wrapper">
      <Icon size={24} />
    </div>
    <div className="card-title">{title}</div>
    <div className="card-value">
      {value.toFixed ? value.toFixed(precision) : value} 
      {unit && <span className="card-unit">{unit}</span>}
    </div>
  </div>
);

export default MetricCard;

