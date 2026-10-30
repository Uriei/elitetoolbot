export interface ISystemData {
  id64: number;
  name: string;
  mainStar?: string;
  coords: Coords;
  updateTime: number;
  needsPermit?: boolean;
}

export interface Coords {
  x: number;
  y: number;
  z: number;
}

export interface IEdsmSystemData {
  name: string;
  id: number;
  id64: number;
  coords: IEdsmSystemCoords;
  coordsLocked: boolean;
  requirePermit: boolean;
  permitName: string;
  information: IEdsmSystemInfo;
}

export interface IEdsmSystemCoords {
  x: number;
  y: number;
  z: number;
}

export interface IEdsmSystemInfo {
  allegiance: string;
  government: string;
  population: number;
  security: string;
  economy: string;
  secondEconomy: string;
  reserve: string;
  faction: string;
  factionState: string;
}
