import React from 'react';
import { LucideIcon } from 'lucide-react';

interface KpiCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: string;
  trendType?: 'positive' | 'negative' | 'neutral';
  accentColor?: 'blue' | 'green' | 'amber' | 'red' | 'purple';
}

export const KpiCard: React.FC<KpiCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  trendType = 'neutral',
  accentColor = 'blue',
}) => {
  const colorMap = {
    blue: 'var(--apple-blue)',
    green: 'var(--apple-green)',
    amber: 'var(--apple-amber)',
    red: 'var(--apple-red)',
    purple: 'var(--apple-purple)',
  };

  const bgMap = {
    blue: 'rgba(0, 113, 227, 0.12)',
    green: 'rgba(52, 199, 89, 0.12)',
    amber: 'rgba(255, 149, 0, 0.12)',
    red: 'rgba(255, 59, 48, 0.12)',
    purple: 'rgba(175, 82, 222, 0.12)',
  };

  return (
    <div className="glass-card glass-card-interactive" style={{ padding: '22px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <span style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            {title}
          </span>
          <div
            className="mono-val"
            style={{
              fontSize: '28px',
              fontWeight: 700,
              marginTop: '6px',
              letterSpacing: '-0.02em',
              color: 'var(--text-primary)',
            }}
          >
            {value}
          </div>
        </div>

        <div
          style={{
            width: '44px',
            height: '44px',
            borderRadius: '14px',
            background: bgMap[accentColor],
            border: `1px solid ${colorMap[accentColor]}33`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: colorMap[accentColor],
            flexShrink: 0,
          }}
        >
          <Icon size={22} />
        </div>
      </div>

      {(subtitle || trend) && (
        <div
          style={{
            marginTop: '14px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '12px',
            color: 'var(--text-muted)',
          }}
        >
          {trend && (
            <span
              style={{
                color:
                  trendType === 'positive'
                    ? 'var(--apple-green)'
                    : trendType === 'negative'
                    ? 'var(--apple-red)'
                    : 'var(--text-secondary)',
                fontWeight: 700,
              }}
            >
              {trend}
            </span>
          )}
          {subtitle && <span>{subtitle}</span>}
        </div>
      )}
    </div>
  );
};
