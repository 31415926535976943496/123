export interface GeoCoordinates {
  latitude: number;
  longitude: number;
  accuracy: number | null;
  heading: number | null;
  speed: number | null;
  timestamp: number;
}

export interface AdminData {
  ip: string;
  userAgent: string;
  coords: GeoCoordinates | null;
}

export interface GroundingSource {
  title: string;
  uri: string;
}

export interface AnalysisResult {
  text: string;
  sources: GroundingSource[];
  timestamp: Date;
}

export enum AppStatus {
  IDLE = 'IDLE',
  ANALYZING = 'ANALYZING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}