export interface RouteResult {
  tripId: string;
  tripName?: string;
  routeName?: string;
  departureTime: string;
  arrivalTime: string;
  fromStopName: string;
  toStopName: string;
  duration: string;
  departureDayOffset?: number;
  arrivalDayOffset?: number;
  searchDate?: string;
}
