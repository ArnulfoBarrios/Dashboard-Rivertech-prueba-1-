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
    <header className="glass-header" style={{ padding: '12px 24px' }}>
      <div
        style={{
          maxWidth: '1440px',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
        }}
      >
        {/* Left Side: Hamburger Drawer + Brand Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <HamburgerDrawer
            currentDashboard={currentDashboard}
            onSelectDashboard={onSelectDashboard}
          />

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, var(--apple-blue) 0%, var(--apple-green) 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 16px rgba(0, 113, 227, 0.35)',
                flexShrink: 0,
              }}
            >
              <Activity color="#ffffff" size={20} />
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <h1 style={{ fontSize: '16px', fontWeight: 800, letterSpacing: '-0.03em' }}>
                  Rivertech
                </h1>
                <span className="glass-pill header-hide-mobile" style={{ fontSize: '10px', padding: '2px 6px' }}>
                  <span className="status-dot active"></span> LIVE 3D
                </span>
              </div>
              <div className="header-hide-mobile" style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: 500 }}>
                {activeFileName} • {totalLogs.toLocaleString()} reportes
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Live Clock + Theme Selector + Upload JSON */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', position: 'relative' }}>
          {/* Live Telemetry Clock */}
          <div
            className="glass-pill mono-val header-hide-mobile"
            style={{
              fontSize: '12px',
              padding: '6px 10px',
              color: 'var(--apple-blue)',
              fontWeight: 700,
            }}
          >
            <Clock size={14} color="var(--apple-blue)" />
            <span>{currentTimeStr || '16:24:00'}</span>
          </div>

          {/* Theme Dropdown */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setIsThemeMenuOpen(!isThemeMenuOpen)}
              className="glass-pill"
              style={{
                padding: '7px 12px',
                fontSize: '12px',
                fontWeight: 700,
                cursor: 'pointer',
                border: '1px solid var(--border-glass-bright)',
                transition: 'all 0.2s ease',
              }}
            >
              <Palette size={14} color="var(--apple-blue)" />
              <span className="header-hide-mobile">Tema</span>
            </button>

            {isThemeMenuOpen && (
              <div
                style={{
                  position: 'absolute',
                  top: '42px',
                  right: 0,
                  zIndex: 2000,
                  width: '240px',
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
                    fontSize: '10px',
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
                      padding: '8px 10px',
                      borderRadius: '8px',
                      border: 'none',
                      background: currentTheme === theme.id ? 'rgba(0, 113, 227, 0.15)' : 'transparent',
                      color: 'var(--text-primary)',
                      cursor: 'pointer',
                      fontSize: '12px',
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
              padding: '7px 12px',
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
            <span>Cargar</span>
          </button>
        </div>
      </div>
    </header>
  );
};
