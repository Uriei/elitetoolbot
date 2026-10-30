export interface ISpanshCarrierRoute {
  job: string;
  parameters?: Parameters;
  state?: "started" | "completed";
  status: "queued" | "ok" | "failed";
  result?: Result;
  error?: string;
}

export interface Parameters {
  calculate_starting_fuel: number;
  capacity: number;
  capacity_used: number;
  current_fuel: number;
  destination_systems: string[];
  mass: number;
  refuel_destinations: string[];
  source_system: string;
  tritium_amount: number;
}

export interface Result {
  calculate_starting_fuel: boolean;
  capacity: number;
  capacity_used: number;
  destinations: string[];
  fuel_loaded: number;
  jumps: Jump[];
  mass: number;
  refuel_destinations: string[];
  source: string;
  tritium_stored: number;
}

export interface Jump {
  distance: number;
  distance_to_destination: number;
  fuel_in_tank: number;
  fuel_used: number;
  has_icy_ring: boolean;
  id64: number;
  is_desired_destination: number;
  is_system_pristine: boolean;
  must_restock: number;
  name: string;
  restock_amount: number;
  tritium_in_market: number;
  x: number;
  y: number;
  z: number;
}
