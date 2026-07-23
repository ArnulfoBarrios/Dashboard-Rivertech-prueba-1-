import React, { useState, useMemo, useEffect } from 'react';
import { DashboardType, AppTheme, RivertechLog } from './types/rivertech';
import { DataService } from './services/dataService';
import { Navbar } from './components/layout/Navbar';
import { FileUploaderModal } from './components/common/FileUploaderModal';

import { ControlTowerDashboard } from './components/dashboards/ControlTowerDashboard';
import { NavalFleetDashboard } from './components/dashboards/NavalFleetDashboard';
import { EngineHealthDashboard } from './components/dashboards/EngineHealthDashboard';
import { OperationsFuelDashboard } from './components/dashboards/OperationsFuelDashboard';
import { IotNetworkDashboard } from './components/dashboards/IotNetworkDashboard';
import { FuelEsgDashboard } from './components/dashboards/FuelEsgDashboard';
import { HseSafetyDashboard } from './components/dashboards/HseSafetyDashboard';
import { AuditComplianceDashboard } from './components/dashboards/AuditComplianceDashboard';
import { GeofenceComplianceDashboard } from './components/dashboards/GeofenceComplianceDashboard';
import { FleetBenchmarkDashboard } from './components/dashboards/FleetBenchmarkDashboard';

// Import safe demo dataset (GitHub & Vercel friendly)
import demoData from './data/demoTelemetry.json';

export function App() {
  const [currentDashboard, setCurrentDashboard] = useState<DashboardType>('tower');
  const [currentTheme, setCurrentTheme] = useState<AppTheme>('midnight');
  const [isUploaderOpen, setIsUploaderOpen] = useState(false);
  const [activeFileName, setActiveFileName] = useState('demoTelemetry.json (Dataset Demo)');
  const [rawLogs, setRawLogs] = useState<RivertechLog[]>(() =>
    DataService.parseLogs(demoData)
  );

  // Apply theme attribute to document element
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', currentTheme);
  }, [currentTheme]);

  // Process Summaries
  const summaries = useMemo(() => {
    return DataService.getDeviceSummaries(rawLogs);
  }, [rawLogs]);

  const handleJsonLoaded = (jsonString: string, fileName: string) => {
    const parsed = DataService.parseLogs(jsonString);
    if (parsed.length > 0) {
      setRawLogs(parsed);
      setActiveFileName(fileName);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Navbar with 10 Dashboards Drawer & Theme Selector */}
      <Navbar
        currentDashboard={currentDashboard}
        onSelectDashboard={setCurrentDashboard}
        currentTheme={currentTheme}
        onChangeTheme={setCurrentTheme}
        onOpenUploader={() => setIsUploaderOpen(true)}
        activeFileName={activeFileName}
        totalLogs={rawLogs.length}
      />

      {/* Main Container */}
      <main
        style={{
          maxWidth: '1440px',
          width: '100%',
          margin: '0 auto',
          padding: '24px 20px 60px 20px',
          flex: 1,
        }}
      >
        {currentDashboard === 'tower' && (
          <ControlTowerDashboard logs={rawLogs} summaries={summaries} />
        )}

        {currentDashboard === 'naval' && (
          <NavalFleetDashboard logs={rawLogs} summaries={summaries} />
        )}

        {currentDashboard === 'engine' && (
          <EngineHealthDashboard logs={rawLogs} summaries={summaries} />
        )}

        {currentDashboard === 'operations' && (
          <OperationsFuelDashboard logs={rawLogs} summaries={summaries} />
        )}

        {currentDashboard === 'iot' && (
          <IotNetworkDashboard logs={rawLogs} summaries={summaries} />
        )}

        {currentDashboard === 'esg' && (
          <FuelEsgDashboard logs={rawLogs} summaries={summaries} />
        )}

        {currentDashboard === 'safety' && (
          <HseSafetyDashboard logs={rawLogs} summaries={summaries} />
        )}

        {currentDashboard === 'audit' && (
          <AuditComplianceDashboard logs={rawLogs} summaries={summaries} />
        )}

        {currentDashboard === 'geofence' && (
          <GeofenceComplianceDashboard logs={rawLogs} summaries={summaries} />
        )}

        {currentDashboard === 'benchmark' && (
          <FleetBenchmarkDashboard logs={rawLogs} summaries={summaries} />
        )}
      </main>

      {/* Footer */}
      <footer
        style={{
          borderTop: '1px solid var(--border-glass)',
          padding: '20px 24px',
          textAlign: 'center',
          fontSize: '12px',
          color: 'var(--text-muted)',
          background: 'var(--bg-card)',
        }}
      >
        Rivertech Telemetry Control Center • OpenFreeMap 3D Vector Tiles • Vercel Ready • 2026
      </footer>

      {/* Drag & Drop JSON Uploader Modal */}
      <FileUploaderModal
        isOpen={isUploaderOpen}
        onClose={() => setIsUploaderOpen(false)}
        onJsonLoaded={handleJsonLoaded}
      />
    </div>
  );
}

export default App;
