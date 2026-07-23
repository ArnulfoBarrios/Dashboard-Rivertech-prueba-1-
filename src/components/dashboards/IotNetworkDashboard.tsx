import React from 'react';
import { RivertechLog, DeviceSummary } from '../../types/rivertech';
import { KpiCard } from '../common/KpiCard';
import { Wifi, Satellite, Battery, Cpu, CheckCircle } from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ScatterChart,
  Scatter
} from 'recharts';

interface IotNetworkDashboardProps {
  logs: RivertechLog[];
  summaries: DeviceSummary[];
}

export const IotNetworkDashboard: React.FC<IotNetworkDashboardProps> = ({
  logs,
  summaries,
}) => {
  // Extract IoT signal data
  const iotSeries = logs
    .filter((l) => l.attributes && l.attributes.sat !== undefined)
    .slice(0, 30)
    .map((l, i) => ({
      time: l.devicetime.split(' ')[1] || `Log ${i}`,
      satellites: l.attributes.sat || 17,
      rssi: l.attributes.rssi || 4,
      hdop: l.attributes.hdop || 0.6,
      battery: l.attributes.battery || 4.09,
      name: l.name,
    }));

  const avgSatellites = (
    iotSeries.reduce((acc, s) => acc + s.satellites, 0) / (iotSeries.length || 1)
  ).toFixed(1);

  const avgRssi = (
    iotSeries.reduce((acc, s) => acc + s.rssi, 0) / (iotSeries.length || 1)
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
          title="Satélites GPS Promedio"
          value={`${avgSatellites} SAT`}
          subtitle="Excelente fijación de posición"
          icon={Satellite}
          accentColor="blue"
        />
        <KpiCard
          title="Nivel de Señal Celular"
          value={`${avgRssi} / 5`}
          subtitle="Conexión GPRS/GSM en río"
          icon={Wifi}
          accentColor="green"
        />
        <KpiCard
          title="Batería de Respaldo GPS"
          value="4.09 V"
          subtitle="Autonomía interna al 100%"
          icon={Battery}
          accentColor="amber"
        />
        <KpiCard
          title="Puertos I/O Sensores"
          value="Activos"
          subtitle="Entradas digitales in1, in2, in3 OK"
          icon={Cpu}
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
        {/* Satellite Count & HDOP Precision Chart */}
        <div className="glass-card" style={{ padding: '24px' }}>
          <div style={{ marginBottom: '18px' }}>
            <h3 style={{ fontSize: '17px', fontWeight: 600 }}>Satélites GPS en Línea (SAT)</h3>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
              Cantidad de satélites visibles para fijación de coordenadas
            </p>
          </div>

          <div style={{ width: '100%', height: '240px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={iotSeries}>
                <XAxis dataKey="time" stroke="#86868b" fontSize={11} />
                <YAxis stroke="#86868b" fontSize={11} domain={[0, 25]} />
                <Tooltip
                  contentStyle={{
                    background: 'rgba(18, 24, 38, 0.95)',
                    border: '1px solid var(--border-glass)',
                    borderRadius: '10px',
                    color: '#fff',
                  }}
                />
                <Line type="monotone" dataKey="satellites" name="Satélites" stroke="#34c759" strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Battery & Power Telemetry */}
        <div className="glass-card" style={{ padding: '24px' }}>
          <div style={{ marginBottom: '18px' }}>
            <h3 style={{ fontSize: '17px', fontWeight: 600 }}>Voltaje de Batería de Respaldo (V)</h3>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
              Monitoreo de estado de carga de la batería Li-ion interna
            </p>
          </div>

          <div style={{ width: '100%', height: '240px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={iotSeries}>
                <XAxis dataKey="time" stroke="#86868b" fontSize={11} />
                <YAxis stroke="#86868b" fontSize={11} domain={[3.5, 4.5]} />
                <Tooltip
                  contentStyle={{
                    background: 'rgba(18, 24, 38, 0.95)',
                    border: '1px solid var(--border-glass)',
                    borderRadius: '10px',
                    color: '#fff',
                  }}
                />
                <Line type="monotone" dataKey="battery" name="Voltaje (V)" stroke="#ff9500" strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
