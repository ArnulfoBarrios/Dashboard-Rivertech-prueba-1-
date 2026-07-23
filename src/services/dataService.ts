import {
  RivertechLog,
  DeviceSummary,
  VesselConfig,
  ConvoyConfig,
  FilterState
} from '../types/rivertech';

export class DataService {
  /**
   * Parse JSON string into typed array of RivertechLog
   */
  static parseLogs(rawJson: string | object[]): RivertechLog[] {
    try {
      const parsed = typeof rawJson === 'string' ? JSON.parse(rawJson) : rawJson;
      if (!Array.isArray(parsed)) return [];

      return parsed.map((item: any) => ({
        ...item,
        speed: parseFloat(item.speed || '0'),
        cog: parseFloat(item.cog || '0'),
        latitude: parseFloat(item.latitude || '0'),
        longitude: parseFloat(item.longitude || '0'),
        altitude: parseFloat(item.altitude || '0'),
      }));
    } catch (err) {
      console.error('Error parsing Rivertech JSON:', err);
      return [];
    }
  }

  /**
   * Extract summaries per unique device ID
   */
  static getDeviceSummaries(logs: RivertechLog[]): DeviceSummary[] {
    const map = new Map<number, RivertechLog[]>();

    for (const log of logs) {
      if (!map.has(log.deviceid)) {
        map.set(log.deviceid, []);
      }
      map.get(log.deviceid)!.push(log);
    }

    const summaries: DeviceSummary[] = [];

    map.forEach((deviceLogs, devId) => {
      // Sort logs by devicetime descending (newest first)
      deviceLogs.sort(
        (a, b) => new Date(b.devicetime).getTime() - new Date(a.devicetime).getTime()
      );

      const latest = deviceLogs[0];
      const attrs = latest.attributes || {};

      let vesselParsed: VesselConfig | null = null;
      let convoyParsed: ConvoyConfig | null = null;

      if (attrs.vessel) {
        try {
          vesselParsed = typeof attrs.vessel === 'string' ? JSON.parse(attrs.vessel) : attrs.vessel;
        } catch (e) {}
      }

      if (attrs.convoy) {
        try {
          convoyParsed = typeof attrs.convoy === 'string' ? JSON.parse(attrs.convoy) : attrs.convoy;
        } catch (e) {}
      }

      const nameLower = latest.name.toLowerCase();
      const isNaval =
        nameLower.includes('ama') ||
        nameLower.includes('vessel') ||
        vesselParsed !== null ||
        convoyParsed !== null;

      const isVehicle =
        nameLower.includes('camioneta') ||
        nameLower.includes('jetta') ||
        nameLower.includes('karen') ||
        nameLower.includes('vanessa') ||
        attrs.odometer !== undefined;

      summaries.push({
        id: devId,
        name: latest.name,
        totalLogs: deviceLogs.length,
        lastTime: latest.devicetime,
        lastSpeed: typeof latest.speed === 'number' ? latest.speed : parseFloat(latest.speed || '0'),
        lastCog: typeof latest.cog === 'number' ? latest.cog : parseFloat(latest.cog || '0'),
        lastLat: typeof latest.latitude === 'number' ? latest.latitude : parseFloat(latest.latitude || '0'),
        lastLng: typeof latest.longitude === 'number' ? latest.longitude : parseFloat(latest.longitude || '0'),
        motion: !!attrs.motion,
        ignition: attrs.ignition !== undefined ? !!attrs.ignition : true,
        battery: attrs.battery || 4.0,
        power: attrs.power || 13.8,
        locationDescription: attrs.locationDescription || latest.location || 'Sin ubicación específica',
        isNaval,
        isVehicle,
        vesselParsed,
        convoyParsed,
      });
    });

    return summaries.sort((a, b) => b.totalLogs - a.totalLogs);
  }

  /**
   * Filter logs based on FilterState
   */
  static filterLogs(logs: RivertechLog[], filter: FilterState): RivertechLog[] {
    return logs.filter((log) => {
      if (filter.deviceId !== 'all' && log.deviceid !== filter.deviceId) {
        return false;
      }

      if (filter.searchQuery) {
        const query = filter.searchQuery.toLowerCase();
        const nameMatch = log.name.toLowerCase().includes(query);
        const locMatch = (log.attributes?.locationDescription || log.location || '').toLowerCase().includes(query);
        if (!nameMatch && !locMatch) return false;
      }

      if (filter.onlyMoving && !log.attributes?.motion) {
        return false;
      }

      if (filter.onlyIgnition && log.attributes?.ignition === false) {
        return false;
      }

      if (filter.locationFilter !== 'all') {
        const loc = log.attributes?.locationDescription || log.location || '';
        if (!loc.includes(filter.locationFilter)) return false;
      }

      return true;
    });
  }

  /**
   * Get unique location descriptions
   */
  static getLocations(logs: RivertechLog[]): { name: string; count: number }[] {
    const locMap = new Map<string, number>();

    logs.forEach((log) => {
      const loc = log.attributes?.locationDescription || log.location;
      if (loc) {
        locMap.set(loc, (locMap.get(loc) || 0) + 1);
      }
    });

    return Array.from(locMap.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);
  }
}
