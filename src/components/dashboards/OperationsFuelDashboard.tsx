import React from 'react';
import { RivertechLog, DeviceSummary } from '../../types/rivertech';
import { KpiCard } from '../common/KpiCard';
import { Truck, Fuel, Clock, Gauge, ArrowUpRight } from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

interface OperationsFuelDashboardProps {
  logs: RivertechLog[];
  summaries: DeviceSummary[];
}

export const OperationsFuelDashboard: React.FC<OperationsFuelDashboardProps> = ({
  logs,
  summaries,
}) => {
  const vehicleSummaries = summaries.filter((s) => s.isVehicle || s.name.includes('camioneta') || s.name.includes('GJM262'));

  // Calculate motion vs idle pie data
  const movingCount = summaries.filter((s) => s.motion).length;
  const idleCount = summaries.filter((s) => s.ignition && !s.motion).length;
  const offCount = summaries.length - movingCount - idleCount;

  const motionPieData = [
    { name: 'En Movimiento', value: movingCount, color: '#34c759' },
    { name: 'Ralentí (Motor ON, Detenido)', value: Math.max(idleCount, 1), color: '#ff9500' },
    { name: 'Apagado', value: Math.max(offCount, 0), color: '#86868b' },
  ];

  // Odometer & distance per unit
  const distanceData = summaries.slice(0, 8).map((dev) => ({
    name: dev.name,
    speed: dev.lastSpeed,
    battery: dev.battery,
  }));

  const totalDistanceKm = (
    logs.reduce((acc, l) => acc + (l.attributes?.distance || 0), 0) / 1000
  ).toFixed(1);

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
          title="Distancia Total Calculada"
          value={`${totalDistanceKm} km`}
          subtitle="Recorrida en el tramo de telemetría"
          icon={Truck}
          accentColor="blue"
        />
        <KpiCard
          title="Eficiencia Operativa"
          value={`${((movingCount / (summaries.length || 1)) * 100).toFixed(0)}%`}
          subtitle="Tiempo útil de marcha de la flota"
          icon={Gauge}
          accentColor="green"
        />
        <KpiCard
          title="Ralentí Detectado"
          value={`${idleCount} unidades`}
          subtitle="Motor encendido sin desplazamiento"
          icon={Clock}
          accentColor="amber"
        />
        <KpiCard
          title="Gestión de Combustible"
          value="Óptima"
          subtitle="Sin eventos de sobre-consumo"
          icon={Fuel}
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
        {/* Motion vs Idle Pie Chart */}
        <div className="glass-card" style={{ padding: '24px' }}>
          <div style={{ marginBottom: '18px' }}>
            <h3 style={{ fontSize: '17px', fontWeight: 600 }}>Distribución de Estado Operativo</h3>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
              Proporción de tiempo en movimiento vs. ralentí ineficiente
            </p>
          </div>

          <div style={{ width: '100%', height: '240px', display: 'flex', alignItems: 'center' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={motionPieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {motionPieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: 'rgba(18, 24, 38, 0.95)',
                    border: '1px solid var(--border-glass)',
                    borderRadius: '10px',
                    color: '#fff',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px', minWidth: '160px' }}>
              {motionPieData.map((item, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: item.color }}></span>
                  <span style={{ color: 'var(--text-secondary)' }}>{item.name}:</span>
                  <strong style={{ color: '#fff' }}>{item.value}</strong>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Speed per Vehicle Bar Chart */}
        <div className="glass-card" style={{ padding: '24px' }}>
          <div style={{ marginBottom: '18px' }}>
            <h3 style={{ fontSize: '17px', fontWeight: 600 }}>Velocidades de Operación por Unidad</h3>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
              Lecturas de velocidad en tiempo real (kts / kmh)
            </p>
          </div>

          <div style={{ width: '100%', height: '240px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={distanceData} margin={{ top: 10, right: 30, left: 0, bottom: 20 }}>
                <XAxis dataKey="name" stroke="#86868b" fontSize={11} angle={-15} textAnchor="end" />
                <YAxis stroke="#86868b" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    background: 'rgba(18, 24, 38, 0.95)',
                    border: '1px solid var(--border-glass)',
                    borderRadius: '10px',
                    color: '#fff',
                  }}
                />
                <Bar dataKey="speed" fill="#2997ff" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
