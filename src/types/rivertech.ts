export type DashboardType =
  | 'tower'
  | 'naval'
  | 'engine'
  | 'operations'
  | 'iot'
  | 'esg'
  | 'safety'
  | 'audit'
  | 'geofence'
  | 'benchmark';

export type AppTheme = 'midnight' | 'light' | 'ocean' | 'emerald';

export interface VesselConfig {
  length_m: number;
  beam_m: number;
  draft_m: number;
  shape: string;
  gps_from_bow_m: number;
  gps_from_side_m: number;
  gps_side_ref: string;
  alias: string | null;
}

export interface ConvoyConfig {
  schema: number;
  active: boolean;
  profileId: string;
  name: string;
  ref: string;
  hash: string;
  revision: string;
  types: [string, string, number, number, string][];
  items: [number, string, number, number][];
}

export interface RivertechTelemetry {
  ect1?: number;
  ect2?: number;
  ect3?: number;
  eot1?: number;
  eot2?: number;
  eot3?: number;
  eop1?: number;
  eop2?: number;
  eop3?: number;
  rpm1?: number;
  rpm2?: number;
  rpm3?: number;
  vol1?: number;
  vol2?: number;
  vol3?: number;
  hours1?: number;
  hours2?: number;
  hours3?: number;
  depth?: number;
  load1?: number;
  load2?: number;
  load3?: number;
  cfuel1?: number;
  cfuel2?: number;
  cfuel3?: number;
  ifuel1?: number;
  ifuel2?: number;
  ifuel3?: number;
  [key: string]: any;
}

export interface RivertechAttributes {
  motion?: boolean;
  distance?: number;
  totalDistance?: number;
  odometer?: number;
  hours?: number;
  battery?: number;
  power?: number;
  sat?: number;
  hdop?: number;
  pdop?: number;
  rssi?: number;
  operator?: number;
  priority?: number;
  ignition?: boolean;
  location?: string;
  locationDescription?: string;
  ip?: string;
  vessel?: string;
  convoy?: string;
  convoy_hash?: string;
  versionFw?: string;
  in1?: boolean;
  in2?: boolean;
  in3?: boolean;
  out1?: boolean;
  out2?: boolean;
  io24?: number;
  io68?: number;
  io69?: number;
  io200?: number;
  io636?: number;
  io206?: number;
  io113?: number;
  io237?: number;
  ect1?: number;
  ect2?: number;
  ect3?: number;
  rpm1?: number;
  rpm2?: number;
  rpm3?: number;
  [key: string]: any;
}

export interface RivertechLog {
  id: number;
  deviceid: number;
  name: string;
  servertime: string;
  devicetime: string;
  fixtime: string;
  speed: string | number;
  cog: string | number;
  latitude: string | number;
  longitude: string | number;
  altitude: number;
  geofenceids?: any;
  ip?: string | null;
  gpdata?: any;
  status: string;
  location?: string | null;
  hour: number;
  event?: any;
  trip?: any;
  attributes: RivertechAttributes;
  telemetry?: RivertechTelemetry | null;
  created_at: string;
}

export interface DeviceSummary {
  id: number;
  name: string;
  totalLogs: number;
  lastTime: string;
  lastSpeed: number;
  lastCog: number;
  lastLat: number;
  lastLng: number;
  motion: boolean;
  ignition: boolean;
  battery: number;
  power: number;
  locationDescription: string;
  isNaval: boolean;
  isVehicle: boolean;
  vesselParsed?: VesselConfig | null;
  convoyParsed?: ConvoyConfig | null;
}

export interface FilterState {
  deviceId: number | 'all';
  searchQuery: string;
  onlyMoving: boolean;
  onlyIgnition: boolean;
  locationFilter: string | 'all';
}
