import { useEffect, useRef, useState, memo } from 'react';
import { type BusStatus } from '@/lib/api';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, MapPin, Activity, Navigation, Clock, Gauge } from 'lucide-react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { calculateDistance, calculateETA, formatTimeRemaining } from '@/services/mapService';

interface BusMapProps {
  busStatus: BusStatus | null;
  height?: string;
  userLocation?: { lat: number; lng: number } | null;
}

/**
 * Leaflet-based map component for displaying bus location and user location
 * Shows distance and estimated time between user and bus
 * Uses OpenStreetMap (free, no API key required)
 * Bus mock location: Madurai, India
 */
export const BusMap = ({ busStatus, height = 'h-96', userLocation }: BusMapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const busMarkerRef = useRef<L.Marker | null>(null);
  const userMarkerRef = useRef<L.Marker | null>(null);
  const routeLineRef = useRef<L.Polyline | null>(null);
  const initializationRef = useRef(false);
  const [error, setError] = useState<string | null>(null);
  const [distanceBetween, setDistanceBetween] = useState<number | null>(null);
  const [estimatedTime, setEstimatedTime] = useState<Date | null>(null);

  // Default location (Madurai, India) - Mock bus location
  const BUS_LOCATION_LAT = 9.9252;
  const BUS_LOCATION_LNG = 78.1198;
  const BUS_LOCATION = { lat: BUS_LOCATION_LAT, lng: BUS_LOCATION_LNG };

  // Initialize map once on mount
  useEffect(() => {
    if (!mapRef.current || initializationRef.current) return;

    try {
      // Initialize map only once
      initializationRef.current = true;
      
      mapInstanceRef.current = L.map(mapRef.current, {
        scrollWheelZoom: true,
        doubleClickZoom: true,
        touchZoom: true,
      }).setView([BUS_LOCATION_LAT, BUS_LOCATION_LNG], 13);

      // Add OpenStreetMap tiles
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19,
        minZoom: 5,
      }).addTo(mapInstanceRef.current);

      setError(null);
    } catch (err) {
      console.error('Error initializing map:', err);
      setError('Failed to initialize map');
      initializationRef.current = false;
    }

    // Cleanup function - don't destroy on unmount
    return () => {
      // Keep map alive
    };
  }, []); // Empty dependency array - initialize only once

  // Update map when user location or bus location changes
  useEffect(() => {
    if (!mapInstanceRef.current) return;

    try {
      // Calculate distance and ETA if user location exists
      if (userLocation) {
        const distance = calculateDistance(userLocation, BUS_LOCATION, 'kilometers');
        setDistanceBetween(distance);

        // Calculate ETA with average bus speed of 40 km/h
        const eta = calculateETA(userLocation, BUS_LOCATION, 40);
        setEstimatedTime(eta);
      }

      // Remove old markers
      if (busMarkerRef.current) {
        mapInstanceRef.current.removeLayer(busMarkerRef.current);
      }
      if (userMarkerRef.current) {
        mapInstanceRef.current.removeLayer(userMarkerRef.current);
      }
      if (routeLineRef.current) {
        mapInstanceRef.current.removeLayer(routeLineRef.current);
      }

      // Create bus marker with custom icon
      const busIcon = L.icon({
        iconUrl:
          'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%234F46E5" width="40" height="40"><rect x="4" y="6" width="16" height="12" rx="2"/><circle cx="7" cy="16" r="1.5" fill="white"/><circle cx="17" cy="16" r="1.5" fill="white"/><rect x="5" y="6" width="14" height="4" fill="%236366f1" opacity="0.5"/></svg>',
        iconSize: [40, 40],
        iconAnchor: [20, 40],
        popupAnchor: [0, -40],
      });

      busMarkerRef.current = L.marker([BUS_LOCATION_LAT, BUS_LOCATION_LNG], {
        icon: busIcon,
      }).addTo(mapInstanceRef.current);

      // Create bus marker popup
      const busPopupContent = `
        <div style="font-family: Arial, sans-serif; min-width: 200px;">
          <div style="font-weight: bold; font-size: 14px; margin-bottom: 8px; color: #1f2937;">
            🚌 Bus ${busStatus?.busId || 'N/A'} - Route ${busStatus?.routeNumber || 'N/A'}
          </div>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; font-size: 12px;">
            <div>
              <div style="color: #6b7280;">Speed</div>
              <div style="font-weight: bold; color: #4f46e5;">${busStatus?.speed || 0} km/h</div>
            </div>
            <div>
              <div style="color: #6b7280;">Status</div>
              <div style="font-weight: bold; color: ${busStatus?.status === 'active' ? '#10b981' : busStatus?.status === 'stopped' ? '#f59e0b' : '#ef4444'}; text-transform: capitalize;">
                ${busStatus?.status || 'N/A'}
              </div>
            </div>
          </div>
          <div style="margin-top: 8px; padding-top: 8px; border-top: 1px solid #e5e7eb; font-size: 11px; color: #6b7280;">
            📍 Location: Madurai (Mock)<br/>
            Driver: <strong style="color: #1f2937;">${busStatus?.driverName || 'Unknown'}</strong><br/>
            Updated: ${new Date(busStatus?.lastUpdate || Date.now()).toLocaleTimeString()}
          </div>
        </div>
      `;

      busMarkerRef.current.bindPopup(busPopupContent).openPopup();

      // Add user marker if user location exists
      if (userLocation) {
        const userIcon = L.icon({
          iconUrl:
            'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%2310b981" width="32" height="32"><circle cx="12" cy="12" r="8" fill="%2310b981"/><circle cx="12" cy="12" r="5" fill="white"/></svg>',
          iconSize: [32, 32],
          iconAnchor: [16, 16],
          popupAnchor: [0, -16],
        });

        userMarkerRef.current = L.marker([userLocation.lat, userLocation.lng], {
          icon: userIcon,
        }).addTo(mapInstanceRef.current);

        const userPopupContent = `
          <div style="font-family: Arial, sans-serif; min-width: 180px;">
            <div style="font-weight: bold; font-size: 14px; margin-bottom: 8px; color: #1f2937;">
              📍 Your Location
            </div>
            <div style="font-size: 12px; color: #6b7280;">
              Lat: ${userLocation.lat.toFixed(4)}<br/>
              Lng: ${userLocation.lng.toFixed(4)}<br/>
              ${distanceBetween ? `<strong style="color: #10b981;">Distance to bus: ${distanceBetween.toFixed(2)} km</strong>` : ''}
            </div>
          </div>
        `;

        userMarkerRef.current.bindPopup(userPopupContent);

        // Draw route line between user and bus
        routeLineRef.current = L.polyline(
          [[userLocation.lat, userLocation.lng], [BUS_LOCATION_LAT, BUS_LOCATION_LNG]],
          {
            color: '#6366f1',
            weight: 2,
            opacity: 0.7,
            dashArray: '5, 5',
          }
        ).addTo(mapInstanceRef.current);

        // Fit map to show both markers
        const group = L.featureGroup([busMarkerRef.current, userMarkerRef.current]);
        mapInstanceRef.current.fitBounds(group.getBounds().pad(0.1));
      } else {
        // Center on bus if no user location
        mapInstanceRef.current.setView([BUS_LOCATION_LAT, BUS_LOCATION_LNG], 13);
      }
    } catch (err) {
      console.error('Error updating marker:', err);
    }
  }, [busStatus?.busId, busStatus?.speed, busStatus?.status, userLocation]);

  if (error) {
    return (
      <Card className="p-4 bg-red-50 border-red-200">
        <div className="flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-semibold text-red-900">Map Error</h4>
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Map Container */}
      <div
        ref={mapRef}
        className={`${height} rounded-lg border-2 border-indigo-200 shadow-md`}
        style={{ minHeight: '384px', zIndex: 1 }}
      />

      {/* Distance and Time Information Card */}
      {userLocation && distanceBetween !== null && (
        <Card className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-200 shadow-md">
          <div className="space-y-3">
            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
              <Navigation className="h-5 w-5 text-blue-600" />
              Distance & Travel Time
            </h3>
            
            <div className="grid grid-cols-2 gap-4">
              {/* Distance Card */}
              <div className="bg-white rounded-lg p-3 border border-blue-100">
                <div className="flex items-start gap-2">
                  <MapPin className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-gray-600 font-medium mb-1">Distance</p>
                    <p className="text-2xl font-bold text-gray-900">{distanceBetween.toFixed(2)}</p>
                    <p className="text-xs text-gray-500 mt-0.5">kilometers</p>
                  </div>
                </div>
              </div>

              {/* Estimated Time Card */}
              {estimatedTime && (
                <div className="bg-white rounded-lg p-3 border border-green-100">
                  <div className="flex items-start gap-2">
                    <Clock className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-xs text-gray-600 font-medium mb-1">Estimated Time</p>
                      <p className="text-lg font-bold text-gray-900">{formatTimeRemaining(estimatedTime)}</p>
                      <p className="text-xs text-gray-500 mt-0.5">at 40 km/h average</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Info Row */}
            <div className="bg-white rounded-lg p-3 border border-blue-100 text-sm">
              <p className="text-gray-700">
                <span className="font-semibold">📍 Bus Location:</span> Madurai, India (Mock Location)
              </p>
              <p className="text-gray-700 mt-1">
                <span className="font-semibold">📱 Your Location:</span> Real-time GPS
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Bus Status Card */}
      {busStatus && (
        <Card className="p-4 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 border-0 text-white shadow-lg">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-lg">🚌 Bus {busStatus.busId}</h3>
              <Badge
                variant="outline"
                className={`${
                  busStatus.status === 'active'
                    ? 'bg-emerald-100 text-emerald-700 border-emerald-300'
                    : busStatus.status === 'stopped'
                      ? 'bg-amber-100 text-amber-700 border-amber-300'
                      : 'bg-rose-100 text-rose-700 border-rose-300'
                }`}
              >
                {busStatus.status.charAt(0).toUpperCase() + busStatus.status.slice(1)}
              </Badge>
            </div>

            <div className="grid grid-cols-3 gap-3 text-sm">
              <div className="bg-white bg-opacity-20 rounded-lg p-3 backdrop-blur-sm border border-white border-opacity-30">
                <p className="text-white text-opacity-80 text-xs mb-1">Route</p>
                <p className="font-bold text-white text-lg">{busStatus.routeNumber}</p>
              </div>
              <div className="bg-white bg-opacity-20 rounded-lg p-3 backdrop-blur-sm border border-white border-opacity-30">
                <p className="text-white text-opacity-80 text-xs mb-1">Speed</p>
                <p className="font-bold text-white text-lg flex items-center gap-1">
                  <Gauge className="w-4 h-4" /> {busStatus.speed} km/h
                </p>
              </div>
              <div className="bg-white bg-opacity-20 rounded-lg p-3 backdrop-blur-sm border border-white border-opacity-30">
                <div className="flex items-center gap-1.5">
                  <Activity className="w-4 h-4" />
                  <div>
                    <p className="text-white text-opacity-80 text-xs">Status</p>
                    <p className="font-bold text-white text-sm capitalize">{busStatus.status}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="text-xs text-white text-opacity-90 bg-white bg-opacity-10 rounded-lg p-2 border border-white border-opacity-20 backdrop-blur-sm">
              � Driver: <span className="font-semibold">{busStatus.driverName}</span> | ⏱️ Last Updated: {new Date(busStatus.lastUpdate).toLocaleTimeString()}
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default memo(BusMap, (prevProps, nextProps) => {
  // Only re-render if busId, routeNumber, userLocation changes
  return (
    prevProps.busStatus?.busId === nextProps.busStatus?.busId &&
    prevProps.busStatus?.routeNumber === nextProps.busStatus?.routeNumber &&
    prevProps.height === nextProps.height &&
    prevProps.userLocation?.lat === nextProps.userLocation?.lat &&
    prevProps.userLocation?.lng === nextProps.userLocation?.lng
  );
});
