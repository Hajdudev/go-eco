export type Stop = {
  stop_id: string;
  name: string;
  lat: number;
  lng: number;
};

export type StopTime = {
  trip_id: string;
  stop_id: string;
  arrival_time: number;
  departure_time: number;
  stop_sequence: number;
};

export type ShapePoint = {
  lat: number;
  lng: number;
};

export type Trip = {
  trip_id: string;
  route_id: string;
  service_id: string;
  trip_headsign?: string;
  trip_short_name?: string;
  direction_id?: 0 | 1;
  block_id?: string;
  shape_id?: string;
  wheelchair_accessible?: 0 | 1 | 2;
  bikes_allowed?: 0 | 1 | 2;
};

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
