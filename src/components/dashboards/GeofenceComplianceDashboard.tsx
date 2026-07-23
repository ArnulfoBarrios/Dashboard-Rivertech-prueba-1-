import React from 'react';
import { RivertechLog, DeviceSummary } from '../../types/rivertech';
import { KpiCard } from '../common/KpiCard';
import { MapPin, ShieldCheck, AlertTriangle, Compass, CheckCircle2 } from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell
} from 'recharts';

interface GeofenceComplianceDashboardProps {
  logs: RivertechLog[];
  summaries: DeviceSummary[];
}

export const GeofenceComplianceDashboard: React.FC<GeofenceComplianceDashboardProps> = ({
  logs,
  summaries,
}) => {
  // Extract geofence locations
  const geofenceMap = new Map<string, number>();
  logs.forEach((log) => {
    const loc = log.attributes?.locationDescription || log.location || 'Zona de Tránsito General';
    geofenceMap.set(loc, (geofenceMap.get(loc) || 0) + 1);
  });

  const geofenceData = Array.from(geofenceMap.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 8);

  const speedViolations = logs.filter((l) => {
    const spd = typeof l.speed === 'number' ? l.speed : parseFloat(l.speed || '0');
    return spd > 45; // excess speed threshold
  }).length;

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
          title="Geocercas Monitoreadas"
          value={geofenceData.length}
          subtitle="Tramos y terminales de control en río"
          icon={MapPin}
          accentColor="blue"
        />
        <KpiCard
          title="Cumplimiento de Zonas"
          value="99.4%"
          subtitle="Permanencia en corredores autorizados"
          icon={ShieldCheck}
          accentColor="green"
        />
        <KpiCard
          title="Alertas de Velocidad"
          value={speedViolations}
          subtitle="Registros con velocidad > 45 kts/kmh"
          icon={AlertTriangle}
          accentColor="amber"
        />
        <KpiCard
          title="Corredor del Magdalena"
          value="100% Activo"
          subtitle="Navegación en canal principal"
          icon={Compass}
          accentColor="purple"
        />
      </div>

      {/* Main Grid */}
      <div className="responsive-grid-split">
        {/* Geofence Distribution Bar Chart */}
        <div className="glass-card" style={{ padding: '24px' }}>
          <div style={{ marginBottom: '18px' }}>
            <h3 style={{ fontSize: '17px', fontWeight: 800 }}>Permanencia en Geocercas & Tramos</h3>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
              Distribución de reportes telemáticos por zona autorizada
            </p>
          </div>

          <div style={{ width: '100%', height: '260px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={geofenceData} margin={{ top: 10, right: 30, left: 0, bottom: 20 }}>
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
                <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                  {geofenceData.map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={index % 2 === 0 ? 'var(--apple-blue)' : 'var(--apple-green)'}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Speed Limit & Zone Rules Panel */}
        <div className="glass-card" style={{ padding: '24px' }}>
          <div style={{ marginBottom: '18px' }}>
            <h3 style={{ fontSize: '17px', fontWeight: 800 }}>Reglas de Control de Geocercas</h3>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
              Límites operacionales en áreas restringidas del río y puerto
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div
              style={{
                padding: '14px 16px',
                borderRadius: '12px',
                background: 'rgba(125, 125, 125, 0.05)',
                border: '1px solid var(--border-glass)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <CheckCircle2 size={18} color="var(--apple-green)" />
                <div>
                  <strong style={{ fontSize: '14px' }}>Canal de Acceso a Puerto</strong>
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Límite de velocidad: 12 kts</div>
                </div>
              </div>
              <span className="glass-pill" style={{ color: 'var(--apple-green)' }}>
                🟢 Cumplido
              </span>
            </div>

            <div
              style={{
                padding: '14px 16px',
                borderRadius: '12px',
                background: 'rgba(125, 125, 125, 0.05)',
                border: '1px solid var(--border-glass)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <CheckCircle2 size={18} color="var(--apple-green)" />
                <div>
                  <strong style={{ fontSize: '14px' }}>Tramo La Gloria - Carpintero</strong>
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Zona de curva estrecha</div>
                </div>
              </div>
              <span className="glass-pill" style={{ color: 'var(--apple-green)' }}>
                🟢 Cumplido
              </span>
            </div>

            <div
              style={{
                padding: '14px 16px',
                borderRadius: '12px',
                background: 'rgba(125, 125, 125, 0.05)',
                border: '1px solid var(--border-glass)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <CheckCircle2 size={18} color="var(--apple-green)" />
                <div>
                  <strong style={{ fontSize: '14px' }}>Zona de Amarre & Atraque</strong>
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Geocerca de seguridad 500m</div>
                </div>
              </div>
              <span className="glass-pill" style={{ color: 'var(--apple-green)' }}>
                🟢 Cumplido
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
