import React, { useState } from 'react';
import { RivertechLog, DeviceSummary } from '../../types/rivertech';
import { KpiCard } from '../common/KpiCard';
import { OpenFreeMap3D } from '../common/OpenFreeMap3D';
import { Navigation, Ship, Activity, Search, Zap, Compass, MapPin } from 'lucide-react';

interface ControlTowerDashboardProps {
  logs: RivertechLog[];
  summaries: DeviceSummary[];
}

export const ControlTowerDashboard: React.FC<ControlTowerDashboardProps> = ({
  logs,
  summaries,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDevice, setSelectedDevice] = useState<DeviceSummary | null>(null);

  const filteredSummaries = summaries.filter(
    (s) =>
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.locationDescription.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalActive = summaries.filter((s) => s.motion).length;
  const avgSpeed = (
    summaries.reduce((acc, s) => acc + s.lastSpeed, 0) / (summaries.length || 1)
  ).toFixed(1);
  const maxSpeed = Math.max(...summaries.map((s) => s.lastSpeed), 0).toFixed(1);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Top KPI Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '16px',
        }}
      >
        <KpiCard
          title="Flota Monitoreada"
          value={summaries.length}
          subtitle="Embarcaciones y vehículos en mapa 3D"
          icon={Ship}
          accentColor="blue"
        />
        <KpiCard
          title="Unidades en Marcha"
          value={totalActive}
          subtitle={`${((totalActive / (summaries.length || 1)) * 100).toFixed(0)}% de la flota activa`}
          icon={Activity}
          accentColor="green"
          trend={`${totalActive} activos`}
          trendType="positive"
        />
        <KpiCard
          title="Velocidad Máxima"
          value={`${maxSpeed} kts/kmh`}
          subtitle="Registrada en la red telemática"
          icon={Zap}
          accentColor="amber"
        />
        <KpiCard
          title="Velocidad Promedio"
          value={`${avgSpeed} kts/kmh`}
          subtitle="Operación global en tiempo real"
          icon={Navigation}
          accentColor="purple"
        />
      </div>

      {/* Main OpenFreeMap 3D + Sidebar Grid */}
      <div className="responsive-map-split">
        {/* OpenFreeMap 3D Vector View */}
        <div className="glass-card" style={{ padding: 0, position: 'relative' }}>
          <OpenFreeMap3D
            summaries={filteredSummaries}
            onSelectDevice={setSelectedDevice}
            selectedDeviceId={selectedDevice?.id}
          />
        </div>

        {/* Sidebar Asset List */}
        <div className="glass-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column' }}>
          <div style={{ marginBottom: '16px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Compass size={18} color="var(--apple-blue-light)" />
              <span>Activos Telemáticos ({filteredSummaries.length})</span>
            </h3>

            {/* Search Box */}
            <div
              style={{
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <Search
                size={16}
                color="var(--text-secondary)"
                style={{ position: 'absolute', left: '12px' }}
              />
              <input
                type="text"
                placeholder="Buscar activo o tramo..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid var(--border-glass)',
                  borderRadius: '10px',
                  padding: '8px 12px 8px 36px',
                  color: 'var(--text-primary)',
                  fontSize: '13px',
                  outline: 'none',
                }}
              />
            </div>
          </div>

          {/* List Scroll */}
          <div
            style={{
              flex: 1,
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
              maxHeight: '480px',
            }}
          >
            {filteredSummaries.map((dev) => {
              const isSelected = selectedDevice?.id === dev.id;

              return (
                <div
                  key={dev.id}
                  onClick={() => setSelectedDevice(dev)}
                  style={{
                    padding: '12px 14px',
                    borderRadius: '12px',
                    background: isSelected ? 'rgba(0, 113, 227, 0.2)' : 'rgba(255, 255, 255, 0.03)',
                    border: `1px solid ${
                      isSelected ? 'var(--apple-blue)' : 'var(--border-glass)'
                    }`,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span className={`status-dot ${dev.motion ? 'active' : 'inactive'}`}></span>
                      <strong style={{ fontSize: '14px' }}>{dev.name}</strong>
                    </div>
                    <span className="glass-pill" style={{ fontSize: '10px', padding: '2px 6px' }}>
                      {dev.isNaval ? 'NÁUTICO' : 'TERRESTRE'}
                    </span>
                  </div>

                  <div
                    style={{
                      fontSize: '12px',
                      color: 'var(--text-secondary)',
                      marginTop: '6px',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    📍 {dev.locationDescription}
                  </div>

                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      marginTop: '8px',
                      fontSize: '11px',
                      color: 'var(--text-muted)',
                    }}
                  >
                    <span>⚡ {dev.lastSpeed} kts/kmh</span>
                    <span>🧭 {dev.lastCog}°</span>
                    <span>📊 {dev.totalLogs} logs</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
