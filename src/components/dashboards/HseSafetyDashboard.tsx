import React from 'react';
import { RivertechLog, DeviceSummary } from '../../types/rivertech';
import { KpiCard } from '../common/KpiCard';
import { ShieldAlert, AlertTriangle, LifeBuoy, Bell, CheckCircle2 } from 'lucide-react';

interface HseSafetyDashboardProps {
  logs: RivertechLog[];
  summaries: DeviceSummary[];
}

export const HseSafetyDashboard: React.FC<HseSafetyDashboardProps> = ({
  logs,
  summaries,
}) => {
  const navalSummaries = summaries.filter((s) => s.isNaval);

  // Digital Inputs Status (in1: Bilge pump, in2: Fire alarm, in3: Panic button)
  const safetyInputs = [
    { name: 'Sensor de Bomba de Sentina (in1)', status: 'Normal', active: false, color: '#34c759' },
    { name: 'Alarma de Incendio / Temperatura (in2)', status: 'Normal', active: false, color: '#34c759' },
    { name: 'Botón de Pánico de Puente (in3)', status: 'Sin Alerta', active: false, color: '#34c759' },
    { name: 'Corte Remoto de Propulsión (out1)', status: 'Inactivo', active: false, color: '#86868b' },
  ];

  const criticalEvents = logs
    .filter((l) => l.event || (l.attributes && l.attributes.in3))
    .slice(0, 5);

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
          title="Estado de Seguridad Fluvial"
          value="Nivel 1 (Seguro)"
          subtitle="Sin alertas críticas activas en río"
          icon={ShieldAlert}
          accentColor="green"
        />
        <KpiCard
          title="Supervisión de Calado"
          value="100% Ok"
          subtitle="Profundidad de río en rango seguro"
          icon={LifeBuoy}
          accentColor="blue"
        />
        <KpiCard
          title="Eventos HSE Registrados"
          value={criticalEvents.length}
          subtitle="Reportes de eventos telemáticos"
          icon={AlertTriangle}
          accentColor="amber"
        />
        <KpiCard
          title="Sensores Discretos I/O"
          value="4 / 4 Normal"
          subtitle="Entradas digitales in1, in2, in3 OK"
          icon={Bell}
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
        {/* Safety Inputs Panel */}
        <div className="glass-card" style={{ padding: '24px' }}>
          <div style={{ marginBottom: '18px' }}>
            <h3 style={{ fontSize: '17px', fontWeight: 600 }}>Entradas Digitales de Seguridad (HSE)</h3>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
              Sensores de sentina, emergencia y pánico a bordo
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {safetyInputs.map((input, idx) => (
              <div
                key={idx}
                style={{
                  padding: '14px 16px',
                  borderRadius: '12px',
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid var(--border-glass)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <CheckCircle2 size={20} color={input.color} />
                  <strong style={{ fontSize: '14px' }}>{input.name}</strong>
                </div>
                <span className="glass-pill" style={{ color: input.color }}>
                  {input.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Vessel Safety Matrix */}
        <div className="glass-card" style={{ padding: '24px' }}>
          <div style={{ marginBottom: '18px' }}>
            <h3 style={{ fontSize: '17px', fontWeight: 600 }}>Estado de Riesgo por Embarcación</h3>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
              Supervisión de rumbo (`cog`), velocidad y estabilidad
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {navalSummaries.slice(0, 4).map((vessel) => (
              <div
                key={vessel.id}
                style={{
                  padding: '14px 16px',
                  borderRadius: '12px',
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid var(--border-glass)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <div>
                  <strong style={{ fontSize: '14px' }}>{vessel.name}</strong>
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                    📍 {vessel.locationDescription} | Rumbo: {vessel.lastCog}°
                  </div>
                </div>

                <span className="glass-pill" style={{ color: 'var(--apple-green)' }}>
                  🟢 Navegación Estable
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
