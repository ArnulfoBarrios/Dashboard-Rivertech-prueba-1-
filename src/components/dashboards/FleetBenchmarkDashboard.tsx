import React from 'react';
import { RivertechLog, DeviceSummary } from '../../types/rivertech';
import { KpiCard } from '../common/KpiCard';
import { BarChart3, TrendingUp, Award, Zap, Ship, Truck } from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell
} from 'recharts';

interface FleetBenchmarkDashboardProps {
  logs: RivertechLog[];
  summaries: DeviceSummary[];
}

export const FleetBenchmarkDashboard: React.FC<FleetBenchmarkDashboardProps> = ({
  logs,
  summaries,
}) => {
  const navalCount = summaries.filter((s) => s.isNaval).length;
  const vehicleCount = summaries.filter((s) => s.isVehicle).length;

  // Hourly log activity distribution (0 to 23)
  const hourMap = new Map<number, number>();
  logs.forEach((log) => {
    const h = log.hour !== undefined ? log.hour : 16;
    hourMap.set(h, (hourMap.get(h) || 0) + 1);
  });

  const hourlyData = Array.from({ length: 24 }, (_, i) => ({
    hour: `${i}:00`,
    count: hourMap.get(i) || 0,
  })).filter((d) => d.count > 0 || d.hour === '16:00');

  // Asset ranking by total logs
  const topAssets = [...summaries]
    .sort((a, b) => b.totalLogs - a.totalLogs)
    .slice(0, 6)
    .map((s) => ({
      name: s.name,
      logs: s.totalLogs,
      speed: s.lastSpeed,
    }));

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
          title="Embarcaciones Náuticas"
          value={navalCount}
          subtitle="Empujadores en la cuenca del río"
          icon={Ship}
          accentColor="blue"
        />
        <KpiCard
          title="Vehículos Terrestres"
          value={vehicleCount}
          subtitle="Soporte y logística en carretera"
          icon={Truck}
          accentColor="green"
        />
        <KpiCard
          title="Tasa de Utilización"
          value="87.5%"
          subtitle="Disponibilidad operativa global"
          icon={TrendingUp}
          accentColor="amber"
        />
        <KpiCard
          title="Activo Más Productivo"
          value={topAssets[0]?.name || 'WGW011'}
          subtitle={`${topAssets[0]?.logs || 385} reportes registrados`}
          icon={Award}
          accentColor="purple"
        />
      </div>

      {/* Main Grid */}
      <div className="responsive-grid-split">
        {/* Hourly Log Activity Distribution Chart */}
        <div className="glass-card" style={{ padding: '24px' }}>
          <div style={{ marginBottom: '18px' }}>
            <h3 style={{ fontSize: '17px', fontWeight: 800 }}>Distribución Horaria de Transmisión</h3>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
              Intensidad de reportes telemáticos por hora del día (0 a 23h)
            </p>
          </div>

          <div style={{ width: '100%', height: '250px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={hourlyData}>
                <XAxis dataKey="hour" stroke="#86868b" fontSize={11} />
                <YAxis stroke="#86868b" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    background: 'var(--bg-card-solid)',
                    border: '1px solid var(--border-glass)',
                    borderRadius: '10px',
                    color: 'var(--text-primary)',
                  }}
                />
                <Bar dataKey="count" fill="var(--apple-blue)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Productive Assets Ranking Bar Chart */}
        <div className="glass-card" style={{ padding: '24px' }}>
          <div style={{ marginBottom: '18px' }}>
            <h3 style={{ fontSize: '17px', fontWeight: 800 }}>Ranking de Productividad por Activo</h3>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
              Total de registros telemáticos procesados por unidad
            </p>
          </div>

          <div style={{ width: '100%', height: '250px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topAssets} margin={{ top: 10, right: 30, left: 0, bottom: 20 }}>
                <XAxis dataKey="name" stroke="#86868b" fontSize={11} angle={-15} textAnchor="end" />
                <YAxis stroke="#86868b" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    background: 'var(--bg-card-solid)',
                    border: '1px solid var(--border-glass)',
                    borderRadius: '10px',
                    color: 'var(--text-primary)',
                  }}
                />
                <Bar dataKey="logs" radius={[6, 6, 0, 0]}>
                  {topAssets.map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={index === 0 ? 'var(--apple-purple)' : 'var(--apple-blue)'}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
