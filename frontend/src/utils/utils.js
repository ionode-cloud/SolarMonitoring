export const COLOR_VIBRANT_ORANGE = '#FF9900';
export const COLOR_ELECTRIC_BLUE = '#007FFF';
export const COLOR_ALERT = '#ef4444';
export const COLOR_BACKGROUND = '#1c1c1c';

export const MAX_HISTORY_LENGTH = 30;
export const SIMULATION_INTERVAL_MS = 1000;
export const MAX_THEORETICAL_POWER = 50;

export const initialData = {
  voltage: 480.0,
  current: 25.0,
  power: 12.0,
  energy: 1500.0,
  efficiency: 75.0,
  angle: 30,
  panelDirection: 'South',
  lightIntensity: 50000,
  panelTemp: 45.0,
  dustLevel: 5.0,
  performanceHistory: [],
  correlationHistory: []
};

export const fluctuate = (value, range) => {
  const newValue = value + (Math.random() - 0.5) * range;
  return parseFloat(newValue.toFixed(newValue >= 10 ? 1 : 2));
};

export const calculatePowerAndEfficiency = (data) => {
  const { lightIntensity, panelTemp, dustLevel, voltage, current } = data;
  const newVoltage = fluctuate(voltage, 0.5);
  const newCurrent = fluctuate(current, 0.5);
  const basePower = (newVoltage * newCurrent) / 1000;
  const tempPenalty = Math.max(0, panelTemp - 25) * 0.005;
  const dustPenalty = dustLevel / 100 * 0.15;
  const totalPenaltyFactor = 1 - tempPenalty - dustPenalty;
  const newPower = parseFloat((basePower * totalPenaltyFactor).toFixed(2));
  const theoreticalPower = MAX_THEORETICAL_POWER * (lightIntensity / 100000);
  const newEfficiency = (newPower / theoreticalPower) * 100;
  return {
    newPower: Math.max(0, newPower),
    newVoltage,
    newCurrent,
    newEfficiency: Math.min(100, Math.max(0, newEfficiency))
  };
};
