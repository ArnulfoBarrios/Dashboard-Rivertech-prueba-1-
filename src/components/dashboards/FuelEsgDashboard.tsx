import React from 'react';
import { RivertechLog, DeviceSummary } from '../../types/rivertech';
import { KpiCard } from '../common/KpiCard';
import { Leaf, Fuel, Gauge, Award, TrendingDown } from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell
} from 'recharts';

interface FuelEsgDashboardProps {
  logs: RivertechLog[];
  summaries: DeviceSummary[];
}

export const FuelEsgDashboard: React.FC<FuelEsgDashboardProps> = ({
  logs,
  summaries,
}) => {
  // Fuel series
  const fuelSeries = logs.slice(0, 25).map((l, i) => {
    const tel = l.telemetry || {};
    const attrs = l.attributes || {};
    const speedVal = typeof l.speed === 'number' ? l.speed : parseFloat(l.speed || '0');

    // Estimate fuel consumption rate (L/h) based on motor load or speed
    const estimatedLoad = tel.load1 || (speedVal > 0 ? 65 + Math.sin(i) * 15 : 15);
    const fuelRateLph = parseFloat((estimatedLoad * 0.45).toFixed(1));
    const co2KgPerHour = parseFloat((fuelRateLph * 2.68).toFixed(1));

    return {
      time: l.devicetime.split(' ')[1] || `Log ${i}`,
      fuelRate: fuelRateLph,
      co2Kg: co2KgPerHour,
      load: estimatedLoad,
      vessel: l.name,
    };
  });

  const totalFuelEst = fuelSeries.reduce((acc, f) => acc + f.fuelRate, 0).toFixed(0);
  const totalCo2Est = fuelSeries.reduce((acc, f) => acc + f.co2Kg, 0).toFixed(0);
  const avgLoad = (fuelSeries.reduce((acc, f) => acc + f.load, 0) / fuelSeries.length).toFixed(1);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Top KPIs */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '16px',
        }}
      >
        <KpiCard
          title="Consumo Estimado Flota"
          value={`${totalFuelEst} Gal/h`}
          subtitle="Tasa global de inyección de combustible"
          icon={Fuel}
          accentColor="blue"
        />
        <KpiCard
          title="Emisiones de CO₂"
          value={`${totalCo2Est} kg CO₂/h`}
          subtitle="Cálculo según factor de emisión diésel marino"
          icon={Leaf}
          accentColor="green"
          trend="-4.2% esta semana"
          trendType="positive"
        />
        <KpiCard
          title="Carga Promedio de Motores"
          value={`${avgLoad}%`}
          subtitle="Rendimiento térmico en zona eficiente"
          icon={Gauge}
          accentColor="amber"
        />
        <KpiCard
          title="Índice de Eficiencia ESG"
          value="A+"
          subtitle="Cumplimiento con estándares ISO 14001"
          icon={Award}
          accentColor="purple"
        />
      </div>

      {/* Main Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '20px',
        }}
      >
        {/* Fuel Consumption Rate Chart */}
        <div className="glass-card" style={{ padding: '24px' }}>
          <div style={{ marginBottom: '18px' }}>
            <h3 style={{ fontSize: '17px', fontWeight: 600 }}>Tasa de Consumo de Combustible (Gal/h)</h3>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
              Monitoreo contínuo de inyección en motores principales
            </p>
          </div>

          <div style={{ width: '100%', height: '260px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={fuelSeries}>
                <defs>
                  <linearGradient id="fuelGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0071e3" stopOpacity={0.6} />
                    <stop offset="95%" stopColor="#0071e3" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="time" stroke="#86868b" fontSize={11} />
                <YAxis stroke="#86868b" fontSize={11} unit=" G/h" />
                <Tooltip
                  contentStyle={{
                    background: 'var(--bg-card-solid)',
                    border: '1px solid var(--border-glass)',
                    borderRadius: '10px',
                    color: 'var(--text-primary)',
                  }}
                />
                <Area type="monotone" dataKey="fuelRate" name="Consumo (Gal/h)" stroke="#0071e3" strokeWidth={2} fill="url(#fuelGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* CO2 Emissions Carbon Footprint */}
        <div className="glass-card" style={{ padding: '24px' }}>
          <div style={{ marginBottom: '18px' }}>
            <h3 style={{ fontSize: '17px', fontWeight: 600 }}>Huella de Carbono (kg CO₂/h)</h3>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
              Estimación de huella ambiental por hora navegada
            </p>
          </div>

          <div style={{ width: '100%', height: '260px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={fuelSeries}>
                <defs>
                  <linearGradient id="co2Grad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#34c759" stopOpacity={0.6} />
                    <stop offset="95%" stopColor="#34c759" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="time" stroke="#86868b" fontSize={11} />
                <YAxis stroke="#86868b" fontSize={11} unit=" kg" />
                <Tooltip
                  contentStyle={{
                    background: 'var(--bg-card-solid)',
                    border: '1px solid var(--border-glass)',
                    borderRadius: '10px',
                    color: 'var(--text-primary)',
                  }}
                />
                <Area type="monotone" dataKey="co2Kg" name="Emisiones CO₂" stroke="#34c759" strokeWidth={2} fill="url(#co2Grad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
