import { distance as turfDistance, point, bearing as turfBearing } from "@turf/turf";
import { DISTANCE_UNITS, MAP_CONFIG } from "../lib/mapConfig";

export interface BusLocation {
  busId: string;
  latitude: number;
  longitude: number;
  speed: number;
  direction: number;
  timestamp: Date;
}

export interface BusStop {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  area?: string;
}

export interface Route {
  id: string;
  number: string;
  name: string;
  startStop: BusStop;
  endStop: BusStop;
  stops: BusStop[];
  polyline?: { lat: number; lng: number }[];
}

export interface BusStatus {
  busId: string;
  currentStop: BusStop;
  nextStop: BusStop;
  passengersCount: number;
  capacity: number;
  delayMinutes: number;
  status: "on_time" | "delayed" | "completed" | "not_started";
  estimatedArrivalTime: Date;
}

/**
 * Calculate distance between two points
 */
export const calculateDistance = (
  from: { lat: number; lng: number },
  to: { lat: number; lng: number },
  unit: "kilometers" | "meters" | "miles" = "kilometers"
): number => {
  const fromPoint = point([from.lng, from.lat]);
  const toPoint = point([to.lng, to.lat]);
  
  const distance = turfDistance(fromPoint, toPoint, { units: unit as any });
  return Math.round(distance * 100) / 100;
};

/**
 * Calculate bearing between two points (direction)
 */
export const calculateBearing = (
  from: { lat: number; lng: number },
  to: { lat: number; lng: number }
): number => {
  const fromPoint = point([from.lng, from.lat]);
  const toPoint = point([to.lng, to.lat]);
  
  return turfBearing(fromPoint, toPoint);
};

/**
 * Generate polyline from array of coordinates
 */
export const generatePolyline = (
  coordinates: { lat: number; lng: number }[]
): google.maps.LatLng[] => {
  return coordinates.map((coord) => new google.maps.LatLng(coord.lat, coord.lng));
};

/**
 * Get marker color based on bus status
 */
export const getStatusColor = (
  status: "on_time" | "delayed" | "completed" | "not_started"
): string => {
  const colors = {
    on_time: "#10b981",
    delayed: "#f97316",
    completed: "#8b5cf6",
    not_started: "#6b7280",
  };
  return colors[status];
};

/**
 * Calculate ETA (Estimated Time of Arrival)
 */
export const calculateETA = (
  currentLocation: { lat: number; lng: number },
  destination: { lat: number; lng: number },
  averageSpeed: number = 30 // km/h, default 30 km/h for city buses
): Date => {
  const distanceKm = calculateDistance(currentLocation, destination, "kilometers");
  const timeMinutes = (distanceKm / averageSpeed) * 60;
  
  const eta = new Date();
  eta.setMinutes(eta.getMinutes() + Math.round(timeMinutes));
  
  return eta;
};

/**
 * Find nearest stop from a location
 */
export const findNearestStop = (
  userLocation: { lat: number; lng: number },
  stops: BusStop[],
  radiusKm: number = 1
): BusStop | null => {
  let nearestStop: BusStop | null = null;
  let minDistance = radiusKm;

  stops.forEach((stop) => {
    const dist = calculateDistance(userLocation, { lat: stop.latitude, lng: stop.longitude }, "kilometers");
    if (dist < minDistance) {
      minDistance = dist;
      nearestStop = stop;
    }
  });

  return nearestStop;
};

/**
 * Find nearby buses from user location
 */
export const findNearbyBuses = (
  userLocation: { lat: number; lng: number },
  busLocations: BusLocation[],
  radiusKm: number = 2
): BusLocation[] => {
  return busLocations.filter((busLocation) => {
    const distance = calculateDistance(
      userLocation,
      { lat: busLocation.latitude, lng: busLocation.longitude },
      "kilometers"
    );
    return distance <= radiusKm;
  });
};

/**
 * Format time remaining until arrival
 */
export const formatTimeRemaining = (eta: Date): string => {
  const now = new Date();
  const diffMs = eta.getTime() - now.getTime();
  
  if (diffMs < 0) return "Arrived";
  
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 1) return "Arriving soon";
  if (diffMins === 1) return "1 min";
  if (diffMins < 60) return `${diffMins} mins`;
  
  const hours = Math.floor(diffMins / 60);
  const mins = diffMins % 60;
  return `${hours}h ${mins}m`;
};

/**
 * Check if bus is significantly delayed
 */
export const isSignificantlyDelayed = (delayMinutes: number, threshold: number = 5): boolean => {
  return delayMinutes >= threshold;
};

/**
 * Get delay status message
 */
export const getDelayMessage = (delayMinutes: number): string => {
  if (delayMinutes <= 0) return "On time";
  if (delayMinutes < 5) return `${delayMinutes} min delay`;
  if (delayMinutes < 15) return `${delayMinutes} mins delay`;
  return `${Math.round(delayMinutes / 5) * 5} mins delay`;
};

/**
 * Format location coordinates
 */
export const formatCoordinates = (
  lat: number,
  lng: number,
  precision: number = 4
): string => {
  return `${lat.toFixed(precision)}, ${lng.toFixed(precision)}`;
};

/**
 * Check if two locations are similar (within tolerance)
 */
export const areLocationsSimilar = (
  loc1: { lat: number; lng: number },
  loc2: { lat: number; lng: number },
  toleranceMeters: number = 50
): boolean => {
  const distance = calculateDistance(loc1, loc2, "meters");
  return distance <= toleranceMeters;
};

/**
 * Calculate route progress percentage
 */
export const calculateRouteProgress = (
  totalStops: number,
  currentStopIndex: number
): number => {
  if (totalStops === 0) return 0;
  return Math.round(((currentStopIndex + 1) / totalStops) * 100);
};

/**
 * Get occupancy level
 */
export const getOccupancyLevel = (
  passengersCount: number,
  capacity: number
): "low" | "moderate" | "high" | "full" => {
  const percentage = (passengersCount / capacity) * 100;
  
  if (percentage === 100) return "full";
  if (percentage >= 75) return "high";
  if (percentage >= 50) return "moderate";
  return "low";
};

/**
 * Get occupancy percentage
 */
export const getOccupancyPercentage = (
  passengersCount: number,
  capacity: number
): number => {
  return Math.round((passengersCount / capacity) * 100);
};
