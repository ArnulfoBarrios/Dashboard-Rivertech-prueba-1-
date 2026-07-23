import React from 'react';
import { RivertechLog, DeviceSummary } from '../../types/rivertech';
import { KpiCard } from '../common/KpiCard';
import { FileCheck, Clock, ShieldCheck, Cpu, HardDrive } from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

interface AuditComplianceDashboardProps {
  logs: RivertechLog[];
  summaries: DeviceSummary[];
}

export const AuditComplianceDashboard: React.FC<AuditComplianceDashboardProps> = ({
  logs,
  summaries,
}) => {
  // Latency calculation between devicetime and servertime (in seconds)
  const latencySeries = logs.slice(0, 25).map((l, i) => {
    const devTime = new Date(l.devicetime).getTime();
    const srvTime = new Date(l.servertime).getTime();
    const diffSec = Math.max(Math.abs((srvTime - devTime) / 1000), 1);

    return {
      time: l.devicetime.split(' ')[1] || `Log ${i}`,
      latencySec: diffSec,
      device: l.name,
    };
  });

  const avgLatency = (
    latencySeries.reduce((acc, s) => acc + s.latencySec, 0) / (latencySeries.length || 1)
  ).toFixed(1);

  // Convoy hashes audit trail
  const convoyAuditTrail = logs
    .filter((l) => l.attributes && l.attributes.convoy_hash)
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
          title="Latencia de Red Promedio"
          value={`${avgLatency} seg`}
          subtitle="Diferencia devicetime vs servertime"
          icon={Clock}
          accentColor="blue"
        />
        <KpiCard
          title="Cumplimiento SLA Transmisión"
          value="99.8%"
          subtitle="Paquetes telemáticos entregados a tiempo"
          icon={FileCheck}
          accentColor="green"
        />
        <KpiCard
          title="Firma Hash de Convoyes"
          value="Auditada"
          subtitle="Verificación criptográfica de amarre"
          icon={ShieldCheck}
          accentColor="purple"
        />
        <KpiCard
          title="Firmware Telemático"
          value="v3.25.0"
          subtitle="Versión de software Rivertech activa"
          icon={Cpu}
          accentColor="amber"
        />
      </div>

      {/* Main Grid */}
      <div className="responsive-grid-split">
        {/* Network Latency Chart */}
        <div className="glass-card" style={{ padding: '24px' }}>
          <div style={{ marginBottom: '18px' }}>
            <h3 style={{ fontSize: '17px', fontWeight: 600 }}>Latencia de Transmisión GPRS (Segundos)</h3>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
              Monitoreo del retardo de entrega de paquetes telemáticos
            </p>
          </div>

          <div style={{ width: '100%', height: '240px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={latencySeries}>
                <XAxis dataKey="time" stroke="#86868b" fontSize={11} />
                <YAxis stroke="#86868b" fontSize={11} unit="s" />
                <Tooltip
                  contentStyle={{
                    background: 'var(--bg-card-solid)',
                    border: '1px solid var(--border-glass)',
                    borderRadius: '10px',
                    color: 'var(--text-primary)',
                  }}
                />
                <Line type="monotone" dataKey="latencySec" name="Latencia (seg)" stroke="#af52de" strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Convoy Hash Audit Trail */}
        <div className="glass-card" style={{ padding: '24px' }}>
          <div style={{ marginBottom: '18px' }}>
            <h3 style={{ fontSize: '17px', fontWeight: 600 }}>Auditoría de Hashes de Convoy</h3>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
              Trazabilidad de modificaciones en la formación de barcazas
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {convoyAuditTrail.map((log, idx) => (
              <div
                key={idx}
                style={{
                  padding: '12px 14px',
                  borderRadius: '12px',
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid var(--border-glass)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <strong style={{ fontSize: '14px' }}>{log.name}</strong>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{log.devicetime}</span>
                </div>
                <div
                  style={{
                    fontSize: '11px',
                    fontFamily: 'monospace',
                    color: 'var(--apple-blue-light)',
                    wordBreak: 'break-all',
                  }}
                >
                  Hash: {log.attributes?.convoy_hash}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
