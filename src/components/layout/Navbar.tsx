import React, { useState, useEffect } from 'react';
import {
  Upload,
  Activity,
  Palette,
  Check,
  Clock
} from 'lucide-react';
import { DashboardType, AppTheme } from '../../types/rivertech';
import { HamburgerDrawer } from './HamburgerDrawer';

interface NavbarProps {
  currentDashboard: DashboardType;
  onSelectDashboard: (type: DashboardType) => void;
  currentTheme: AppTheme;
  onChangeTheme: (theme: AppTheme) => void;
  onOpenUploader: () => void;
  activeFileName: string;
  totalLogs: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentDashboard,
  onSelectDashboard,
  currentTheme,
  onChangeTheme,
  onOpenUploader,
  activeFileName,
  totalLogs,
}) => {
  const [isThemeMenuOpen, setIsThemeMenuOpen] = useState(false);
  const [currentTimeStr, setCurrentTimeStr] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTimeStr(now.toLocaleTimeString());
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const themes: { id: AppTheme; label: string; icon: string }[] = [
    { id: 'light', label: 'Blanco & Azul Cobalto (Claro)', icon: '☀️' },
    { id: 'midnight', label: 'Midnight Command Glass (Oscuro)', icon: '🌙' },
    { id: 'ocean', label: 'Ocean Deep (Azul Náutico)', icon: '🌊' },
    { id: 'emerald', label: 'Emerald River (Verde Fluvial)', icon: '🌿' },
  ];

  return (
    <header className="glass-header" style={{ padding: '14px 28px' }}>
      <div
        style={{
          maxWidth: '1440px',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '14px',
        }}
      >
        {/* Left Side: Hamburger Drawer + Brand Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <HamburgerDrawer
            currentDashboard={currentDashboard}
            onSelectDashboard={onSelectDashboard}
          />

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, var(--apple-blue) 0%, var(--apple-green) 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 16px rgba(0, 113, 227, 0.35)',
              }}
            >
              <Activity color="#ffffff" size={22} />
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h1 style={{ fontSize: '18px', fontWeight: 800, letterSpacing: '-0.03em' }}>
                  Rivertech Command Glass
                </h1>
                <span className="glass-pill" style={{ fontSize: '11px', padding: '2px 8px' }}>
                  <span className="status-dot active"></span> TELEMETRY LIVE
                </span>
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: 500 }}>
                {activeFileName} • {totalLogs.toLocaleString()} reportes telemáticos
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Live Clock + Theme Selector + Upload JSON */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', position: 'relative' }}>
          {/* Live Telemetry Clock */}
          <div
            className="glass-pill mono-val"
            style={{
              fontSize: '12px',
              padding: '7px 12px',
              color: 'var(--apple-blue)',
              fontWeight: 700,
            }}
          >
            <Clock size={14} color="var(--apple-blue)" />
            <span>{currentTimeStr || '11:50:37'}</span>
          </div>

          {/* Theme Dropdown */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setIsThemeMenuOpen(!isThemeMenuOpen)}
              className="glass-pill"
              style={{
                padding: '8px 14px',
                fontSize: '12px',
                fontWeight: 700,
                cursor: 'pointer',
                border: '1px solid var(--border-glass-bright)',
                transition: 'all 0.2s ease',
              }}
            >
              <Palette size={15} color="var(--apple-blue)" />
              <span>Tema</span>
            </button>

            {isThemeMenuOpen && (
              <div
                style={{
                  position: 'absolute',
                  top: '46px',
                  right: 0,
                  zIndex: 2000,
                  width: '260px',
                  background: 'var(--bg-card-solid)',
                  border: '1px solid var(--border-glass-bright)',
                  borderRadius: '14px',
                  padding: '8px',
                  boxShadow: 'var(--shadow-glass)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '4px',
                }}
              >
                <div
                  style={{
                    fontSize: '11px',
                    fontWeight: 800,
                    color: 'var(--text-muted)',
                    padding: '6px 10px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                  }}
                >
                  Estilos de Interfaz
                </div>
                {themes.map((theme) => (
                  <button
                    key={theme.id}
                    onClick={() => {
                      onChangeTheme(theme.id);
                      setIsThemeMenuOpen(false);
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: '8px',
                      border: 'none',
                      background: currentTheme === theme.id ? 'rgba(0, 113, 227, 0.15)' : 'transparent',
                      color: 'var(--text-primary)',
                      cursor: 'pointer',
                      fontSize: '13px',
                      textAlign: 'left',
                    }}
                  >
                    <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span>{theme.icon}</span>
                      <span>{theme.label}</span>
                    </span>
                    {currentTheme === theme.id && <Check size={14} color="var(--apple-blue)" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Upload Button */}
          <button
            onClick={onOpenUploader}
            className="glass-pill"
            style={{
              padding: '8px 16px',
              fontSize: '12px',
              fontWeight: 700,
              cursor: 'pointer',
              border: '1px solid var(--border-glass-bright)',
              transition: 'all 0.2s ease',
              background: 'var(--apple-blue)',
              color: '#ffffff',
            }}
          >
            <Upload size={14} color="#ffffff" />
            <span>Cargar JSON</span>
          </button>
        </div>
      </div>
    </header>
  );
};
