import React, { useEffect, useRef } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { DeviceSummary } from '../../types/rivertech';

interface OpenFreeMap3DProps {
  summaries: DeviceSummary[];
  onSelectDevice?: (device: DeviceSummary) => void;
  selectedDeviceId?: number | null;
  theme?: string;
}

export const OpenFreeMap3D: React.FC<OpenFreeMap3DProps> = ({
  summaries,
  onSelectDevice,
  selectedDeviceId,
  theme = 'midnight',
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const markersRef = useRef<maplibregl.Marker[]>([]);

  const getOpenFreeMapStyle = (t: string) => {
    if (t === 'light') {
      return 'https://tiles.openfreemap.org/styles/bright';
    }
    if (t === 'ocean') {
      return 'https://tiles.openfreemap.org/styles/fiord-color';
    }
    return 'https://tiles.openfreemap.org/styles/liberty';
  };

  useEffect(() => {
    if (!mapContainerRef.current) return;

    const initialCenter: [number, number] = [-74.0, 9.5];

    const map = new maplibregl.Map({
      container: mapContainerRef.current,
      style: getOpenFreeMapStyle(theme),
      center: initialCenter,
      zoom: 6.8,
      pitch: 52,
      bearing: -15,
      maxPitch: 85,
    });

    map.addControl(new maplibregl.NavigationControl({ visualizePitch: true }), 'top-right');
    map.addControl(new maplibregl.FullscreenControl(), 'top-right');

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, [theme]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    summaries.forEach((dev) => {
      if (!dev.lastLat || !dev.lastLng) return;

      const isSelected = selectedDeviceId === dev.id;
      const statusColor = dev.motion ? '#34c759' : '#94a3b8';
      const iconSymbol = dev.isNaval ? '🚢' : '🚚';

      const el = document.createElement('div');
      el.className = 'openfreemap-3d-marker';
      el.style.cssText = `
        background: ${isSelected ? 'var(--apple-blue)' : 'var(--bg-card-solid)'};
        border: 2px solid ${isSelected ? '#ffffff' : statusColor};
        box-shadow: 0 8px 24px ${dev.motion ? 'rgba(52, 199, 89, 0.6)' : 'rgba(0,0,0,0.5)'};
        width: ${isSelected ? '46px' : '38px'};
        height: ${isSelected ? '46px' : '38px'};
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: ${isSelected ? '20px' : '16px'};
        cursor: pointer;
        transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        transform: translate3d(0, 0, 10px);
      `;
      el.innerHTML = iconSymbol;

      el.addEventListener('click', () => {
        if (onSelectDevice) onSelectDevice(dev);
        map.flyTo({
          center: [dev.lastLng, dev.lastLat],
          zoom: 11,
          pitch: 60,
          speed: 1.2,
        });
      });

      const popupHtml = `
        <div style="padding: 12px; font-family: var(--font-sans);">
          <div style="font-weight: 800; font-size: 15px; color: var(--text-primary); margin-bottom: 4px;">
            ${dev.name}
          </div>
          <div style="font-size: 12px; color: var(--text-secondary); margin-bottom: 10px;">
            📍 ${dev.locationDescription}
          </div>
          <div style="display: flex; flex-direction: column; gap: 6px; font-size: 12px; font-family: var(--font-mono);">
            <div>⚡ Velocidad: <strong>${dev.lastSpeed} kts/kmh</strong></div>
            <div>🧭 Rumbo (COG): <strong>${dev.lastCog}°</strong></div>
            <div>🔋 Batería GPS: <strong>${dev.battery} V</strong></div>
            <div>⏱️ Reporte: <strong>${dev.lastTime}</strong></div>
          </div>
        </div>
      `;

      const popup = new maplibregl.Popup({ offset: 25, closeButton: false }).setHTML(popupHtml);

      const marker = new maplibregl.Marker({ element: el })
        .setLngLat([dev.lastLng, dev.lastLat])
        .setPopup(popup)
        .addTo(map);

      markersRef.current.push(marker);
    });
  }, [summaries, selectedDeviceId, onSelectDevice]);

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', minHeight: '580px' }}>
      <div
        ref={mapContainerRef}
        style={{
          width: '100%',
          height: '100%',
          minHeight: '580px',
          borderRadius: '20px',
          overflow: 'hidden',
        }}
      />

      <div
        className="glass-pill"
        style={{
          position: 'absolute',
          bottom: '16px',
          left: '16px',
          zIndex: 10,
          fontSize: '11px',
          background: 'var(--bg-card-solid)',
          border: '1px solid var(--border-glass-bright)',
          fontFamily: 'var(--font-mono)',
        }}
      >
        <span>🌐 OpenFreeMap 3D Vector Radar</span>
      </div>
    </div>
  );
};
