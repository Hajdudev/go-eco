export interface Stop {
  stop_id: string;
  name: string;
  lat: number;
  lng: number;
}

export interface StopTime {
  trip_id: string;
  stop_id: string;
  arrival_time: string;
  departure_time: string;
  stop_sequence: number;
}

export interface ShapePoint {
  lat: number;
  lng: number;
}

export interface Trip {
  trip_id: string;
  route_id: string;
  service_id: string;
  trip_headsign?: string;
  trip_short_name?: string;
  direction_id?: number;
  shape_id?: string;
}

export type TransferOption = {
  from_stop_id: string;
  to_stop_id: string;
  transfer_type: number;
  min_transfer_time?: number;
};

/**
 * Routing Types
 */

export type RouteSegment = {
  type: 'TRANSIT' | 'TRANSFER' | 'WAIT';
  from_stop_id: string;
  to_stop_id: string;
  from_stop_name: string;
  to_stop_name: string;
  start_time: number;
  end_time: number;
  trip_id?: string;
  route_id?: string;
  route_color?: string;
};

export type RoutingResult = {
  segments: RouteSegment[];
  total_duration: number;
  start_time: number;
  end_time: number;
};
