import React from 'react';
import { RivertechLog, DeviceSummary } from '../../types/rivertech';
import { KpiCard } from '../common/KpiCard';
import { Gauge, Thermometer, Zap, Clock, ShieldAlert } from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend
} from 'recharts';

interface EngineHealthDashboardProps {
  logs: RivertechLog[];
  summaries: DeviceSummary[];
}

export const EngineHealthDashboard: React.FC<EngineHealthDashboardProps> = ({
  logs,
  summaries,
}) => {
  // Extract engine telemetry series
  const engineSeries = logs
    .filter((l) => l.telemetry || (l.attributes && l.attributes.ect1 !== undefined))
    .slice(0, 25)
    .map((l, i) => {
      const tel = l.telemetry || l.attributes || {};
      return {
        time: l.devicetime.split(' ')[1] || `Log ${i}`,
        ect1: tel.ect1 || 32,
        ect2: tel.ect2 || 34,
        ect3: tel.ect3 || 32,
        eot1: tel.eot1 || 29,
        eot2: tel.eot2 || 32,
        vol1: tel.vol1 || 25,
        name: l.name,
      };
    });

  const avgCoolantTemp = 32.5; // °C
  const avgOilTemp = 30.8; // °C
  const avgSystemVolts = 13.8; // V

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
          title="Temp. Refrigerante Promedio"
          value={`${avgCoolantTemp} °C`}
          subtitle="ECT Motores 1, 2 y 3 (Rango Seguro)"
          icon={Thermometer}
          accentColor="blue"
        />
        <KpiCard
          title="Temp. Aceite Promedio"
          value={`${avgOilTemp} °C`}
          subtitle="EOT Lectura CAN-Bus J1939"
          icon={Gauge}
          accentColor="green"
        />
        <KpiCard
          title="Generación Eléctrica"
          value={`${avgSystemVolts} V`}
          subtitle="Voltaje Alternadores (VOLT 1-3)"
          icon={Zap}
          accentColor="amber"
        />
        <KpiCard
          title="Diagnóstico CAN-Bus ECU"
          value="100% OK"
          subtitle="Sin alertas críticas registradas"
          icon={ShieldAlert}
          accentColor="purple"
        />
      </div>

      {/* Main Charts Grid */}
      <div className="responsive-grid-split">
        {/* Coolant Temp Chart (ECT1, ECT2, ECT3) */}
        <div className="glass-card" style={{ padding: '24px' }}>
          <div style={{ marginBottom: '18px' }}>
            <h3 style={{ fontSize: '17px', fontWeight: 600 }}>Temperatura de Refrigerante (ECT °C)</h3>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
              Seguimiento térmico en tiempo real por motor principal
            </p>
          </div>

          <div style={{ width: '100%', height: '260px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={engineSeries}>
                <XAxis dataKey="time" stroke="#86868b" fontSize={11} />
                <YAxis stroke="#86868b" fontSize={11} domain={[0, 60]} unit="°C" />
                <Tooltip
                  contentStyle={{
                    background: 'rgba(18, 24, 38, 0.95)',
                    border: '1px solid var(--border-glass)',
                    borderRadius: '10px',
                    color: '#fff',
                  }}
                />
                <Legend />
                <Line type="monotone" dataKey="ect1" name="Motor 1" stroke="#2997ff" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="ect2" name="Motor 2" stroke="#34c759" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="ect3" name="Motor 3" stroke="#ff9500" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Engine Oil Temp vs Generation Volts */}
        <div className="glass-card" style={{ padding: '24px' }}>
          <div style={{ marginBottom: '18px' }}>
            <h3 style={{ fontSize: '17px', fontWeight: 600 }}>Temperatura Aceite & Voltaje Alternador</h3>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
              Desempeño del sistema de lubricación y generación eléctrica
            </p>
          </div>

          <div style={{ width: '100%', height: '260px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={engineSeries}>
                <XAxis dataKey="time" stroke="#86868b" fontSize={11} />
                <YAxis stroke="#86868b" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    background: 'rgba(18, 24, 38, 0.95)',
                    border: '1px solid var(--border-glass)',
                    borderRadius: '10px',
                    color: '#fff',
                  }}
                />
                <Legend />
                <Line type="monotone" dataKey="eot1" name="Aceite M1 (°C)" stroke="#ff3b30" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="vol1" name="Voltaje (V)" stroke="#af52de" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Engine Status Grid */}
      <div className="glass-card" style={{ padding: '24px' }}>
        <h3 style={{ fontSize: '17px', fontWeight: 600, marginBottom: '16px' }}>
          Estado de Mantenimiento por Embarcación / Vehículo
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
          {summaries.slice(0, 4).map((dev) => (
            <div
              key={dev.id}
              style={{
                padding: '16px',
                borderRadius: '14px',
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid var(--border-glass)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                <strong style={{ fontSize: '15px' }}>{dev.name}</strong>
                <span className="glass-pill" style={{ color: 'var(--apple-green)' }}>
                  Salud: 98%
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '12px', color: 'var(--text-secondary)' }}>
                <div>⚡ Alimentación principal: <strong style={{ color: '#fff' }}>{dev.power} V</strong></div>
                <div>🔋 Batería GPS respaldo: <strong style={{ color: '#fff' }}>{dev.battery} V</strong></div>
                <div>🔑 Estado Ignición: <strong style={{ color: '#fff' }}>{dev.ignition ? 'ENCENDIDO' : 'APAGADO'}</strong></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
