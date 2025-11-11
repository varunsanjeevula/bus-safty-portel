// Map Configuration and Constants
export const MAP_CONFIG = {
  // Google Maps API Configuration
  apiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "",
  defaultCenter: {
    lat: 28.7041, // Default to Delhi, India
    lng: 77.1025,
  },
  defaultZoom: 13,
  
  // Map styling
  mapOptions: {
    zoomControl: true,
    fullscreenControl: true,
    streetViewControl: false,
    mapTypeControl: true,
    styles: [
      {
        featureType: "poi",
        elementType: "labels",
        stylers: [{ visibility: "off" }],
      },
    ],
  },

  // Bus marker configuration
  busMarkerConfig: {
    scale: 1.5,
    opacity: 0.8,
  },

  // Real-time tracking
  trackingConfig: {
    updateInterval: 5000, // 5 seconds
    maxHistoryPoints: 100,
    polylineColor: "#3b82f6",
    polylineWeight: 3,
    polylineOpacity: 0.7,
  },

  // Map bounds for different cities (optional)
  cityBounds: {
    delhi: {
      north: 28.8693,
      south: 28.5244,
      east: 77.3715,
      west: 76.8366,
    },
    mumbai: {
      north: 19.2690,
      south: 19.0176,
      east: 72.9889,
      west: 72.8479,
    },
    bangalore: {
      north: 13.2298,
      south: 12.8337,
      east: 77.7997,
      west: 77.4670,
    },
  },
};

// Bus Status Types
export const BUS_STATUS = {
  ON_TIME: "on_time",
  DELAYED: "delayed",
  COMPLETED: "completed",
  NOT_STARTED: "not_started",
} as const;

// Bus Health Status
export const BUS_HEALTH = {
  GOOD: "good",
  WARNING: "warning",
  CRITICAL: "critical",
} as const;

// Socket Events for Real-time Updates
export const SOCKET_EVENTS = {
  CONNECT: "connect",
  DISCONNECT: "disconnect",
  BUS_LOCATION_UPDATE: "bus:location:update",
  BUS_STATUS_UPDATE: "bus:status:update",
  ROUTE_UPDATE: "route:update",
  INCIDENT_ALERT: "incident:alert",
} as const;

// Marker Icons (Using Unicode/SVG)
export const MARKER_ICONS = {
  bus: "🚌",
  stop: "🛑",
  incident: "⚠️",
  passenger: "👤",
  driver: "👨‍✈️",
} as const;

// Distance calculation units
export const DISTANCE_UNITS = {
  KILOMETERS: "kilometers",
  METERS: "meters",
  MILES: "miles",
} as const;

// Default filter options
export const DEFAULT_FILTERS = {
  showOnlyNearby: false,
  nearbyRadius: 5, // km
  onlyDelayed: false,
  onlyMyRoutes: false,
  routeIds: [] as string[],
};

// Color mapping for different statuses
export const STATUS_COLORS = {
  [BUS_STATUS.ON_TIME]: "#10b981",
  [BUS_STATUS.DELAYED]: "#f97316",
  [BUS_STATUS.COMPLETED]: "#8b5cf6",
  [BUS_STATUS.NOT_STARTED]: "#6b7280",
} as const;

export const HEALTH_COLORS = {
  [BUS_HEALTH.GOOD]: "#10b981",
  [BUS_HEALTH.WARNING]: "#f97316",
  [BUS_HEALTH.CRITICAL]: "#ef4444",
} as const;
