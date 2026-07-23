import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import {
  Menu,
  X,
  MapPin,
  Ship,
  Gauge,
  Truck,
  Wifi,
  Leaf,
  ShieldAlert,
  FileCheck,
  ChevronRight,
  LayoutGrid,
  Compass,
  BarChart3
} from 'lucide-react';
import { DashboardType } from '../../types/rivertech';

interface HamburgerDrawerProps {
  currentDashboard: DashboardType;
  onSelectDashboard: (type: DashboardType) => void;
}

export const HamburgerDrawer: React.FC<HamburgerDrawerProps> = ({
  currentDashboard,
  onSelectDashboard,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const categories = [
    {
      title: '📍 NAVEGACIÓN & POSICIONAMIENTO',
      items: [
        { id: 'tower' as DashboardType, num: 1, label: 'Torre 3D OpenFreeMap', icon: MapPin, desc: 'Rastreo 3D vectorial en tiempo real' },
        { id: 'geofence' as DashboardType, num: 9, label: 'Geocercas & Zonas de Velocidad', icon: Compass, desc: 'Control de tramos y velocidad límite' },
      ],
    },
    {
      title: '🚢 OPERACIÓN NAVAL & CONVOYES',
      items: [
        { id: 'naval' as DashboardType, num: 2, label: 'Flota Naviera & Convoyes', icon: Ship, desc: 'Barcazas y perfil batimétrico de río' },
      ],
    },
    {
      title: '⚙️ INGENIERÍA & DIAGNÓSTICO ECU',
      items: [
        { id: 'engine' as DashboardType, num: 3, label: 'Motores & ECU CAN-Bus', icon: Gauge, desc: 'Temperaturas, RPMs y voltajes' },
        { id: 'iot' as DashboardType, num: 5, label: 'Red IoT & Sensores Hardware', icon: Wifi, desc: 'Satélites GPS, señal GSM y baterías' },
      ],
    },
    {
      title: '🌿 SOSTENIBILIDAD & EFICIENCIA',
      items: [
        { id: 'operations' as DashboardType, num: 4, label: 'Operación & Combustible', icon: Truck, desc: 'Tiempo en ralentí vs marcha' },
        { id: 'esg' as DashboardType, num: 6, label: 'ESG, Consumo & Emisiones CO₂', icon: Leaf, desc: 'Huella de carbono e inyección' },
        { id: 'benchmark' as DashboardType, num: 10, label: 'Benchmark & KPI de Flotas', icon: BarChart3, desc: 'Comparativa horaria y ranking' },
      ],
    },
    {
      title: '🚨 GOBERNANZA & SEGURIDAD',
      items: [
        { id: 'safety' as DashboardType, num: 7, label: 'Seguridad Marítima HSE', icon: ShieldAlert, desc: 'Prevención de riesgo y sentinas' },
        { id: 'audit' as DashboardType, num: 8, label: 'Auditoría SLA & Latencia', icon: FileCheck, desc: 'Cumplimiento y trazabilidad hash' },
      ],
    },
  ];

  const handleSelect = (id: DashboardType) => {
    onSelectDashboard(id);
    setIsOpen(false);
  };

  const drawerContent = isOpen ? (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 99999,
        background: 'rgba(0, 0, 0, 0.75)',
        backdropFilter: 'blur(16px)',
        display: 'flex',
      }}
      onClick={() => setIsOpen(false)}
    >
      <div
        className="drawer-slide-in"
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '400px',
          maxWidth: '90vw',
          height: '100vh',
          background: 'var(--bg-card-solid)',
          borderRight: '2px solid var(--border-glass-bright)',
          boxShadow: '0 0 60px rgba(0, 0, 0, 0.6)',
          display: 'flex',
          flexDirection: 'column',
          padding: '24px 20px',
          overflowY: 'auto',
        }}
      >
        {/* Drawer Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '20px',
            paddingBottom: '16px',
            borderBottom: '2px solid var(--border-glass-bright)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '10px',
                background: 'var(--apple-blue)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff',
                flexShrink: 0,
              }}
            >
              <LayoutGrid size={22} />
            </div>
            <div>
              <h2 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
                Centros de Control
              </h2>
              <span style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: 600 }}>
                10 Dashboards Telemáticos Rivertech
              </span>
            </div>
          </div>

          <button
            onClick={() => setIsOpen(false)}
            style={{
              background: 'rgba(125, 125, 125, 0.15)',
              border: '1px solid var(--border-glass-bright)',
              borderRadius: '50%',
              width: '34px',
              height: '34px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--text-primary)',
              cursor: 'pointer',
              flexShrink: 0,
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Categorized List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', flex: 1 }}>
          {categories.map((cat, idx) => (
            <div key={idx}>
              <div
                style={{
                  fontSize: '11px',
                  fontWeight: 800,
                  color: 'var(--apple-blue)',
                  letterSpacing: '0.06em',
                  marginBottom: '8px',
                }}
              >
                {cat.title}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {cat.items.map((item) => {
                  const isActive = currentDashboard === item.id;

                  return (
                    <button
                      key={item.id}
                      onClick={() => handleSelect(item.id)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        width: '100%',
                        padding: '12px 14px',
                        borderRadius: '12px',
                        border: `2px solid ${
                          isActive ? 'var(--apple-blue)' : 'var(--border-glass-bright)'
                        }`,
                        background: isActive
                          ? 'rgba(0, 82, 204, 0.18)'
                          : 'rgba(125, 125, 125, 0.05)',
                        color: 'var(--text-primary)',
                        cursor: 'pointer',
                        textAlign: 'left',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div
                          style={{
                            width: '32px',
                            height: '32px',
                            borderRadius: '8px',
                            background: isActive ? 'var(--apple-blue)' : 'rgba(0, 82, 204, 0.12)',
                            color: isActive ? '#ffffff' : 'var(--apple-blue)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '14px',
                            fontWeight: 800,
                            flexShrink: 0,
                          }}
                        >
                          {item.num}
                        </div>

                        <div>
                          <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)' }}>
                            {item.label}
                          </div>
                          <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '2px', fontWeight: 500 }}>
                            {item.desc}
                          </div>
                        </div>
                      </div>

                      <ChevronRight
                        size={16}
                        color={isActive ? 'var(--apple-blue)' : 'var(--text-muted)'}
                        style={{ flexShrink: 0 }}
                      />
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Drawer Footer */}
        <div
          style={{
            marginTop: '20px',
            paddingTop: '14px',
            borderTop: '1px solid var(--border-glass)',
            fontSize: '11px',
            color: 'var(--text-muted)',
            textAlign: 'center',
            fontWeight: 500,
          }}
        >
          Rivertech Telemetry Dashboard • 2026
        </div>
      </div>
    </div>
  ) : null;

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        style={{
          background: 'var(--bg-card-solid)',
          border: '1.5px solid var(--border-glass-bright)',
          borderRadius: '12px',
          padding: '8px 14px',
          fontSize: '13px',
          fontWeight: 700,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          color: 'var(--text-primary)',
          boxShadow: 'var(--shadow-glass)',
          transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        <Menu size={18} color="var(--apple-blue)" />
        <span>Menú Dashboards</span>
        <span
          style={{
            background: 'var(--apple-blue)',
            color: '#ffffff',
            fontSize: '11px',
            padding: '2px 7px',
            borderRadius: '9999px',
            fontWeight: 800,
          }}
        >
          10
        </span>
      </button>

      {typeof document !== 'undefined' && createPortal(drawerContent, document.body)}
    </>
  );
};
