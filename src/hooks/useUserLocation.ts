import { useEffect, useState } from 'react';

interface UserLocation {
  lat: number;
  lng: number;
  accuracy?: number;
  timestamp: Date;
}

interface UseUserLocationOptions {
  enableHighAccuracy?: boolean;
  timeout?: number;
  maximumAge?: number;
  watchPosition?: boolean;
}

/**
 * Custom hook to get and track user's real-time GPS location
 * Uses browser's Geolocation API
 */
export const useUserLocation = (options: UseUserLocationOptions = {}) => {
  const {
    enableHighAccuracy = true,
    timeout = 10000,
    maximumAge = 0,
    watchPosition = true,
  } = options;

  const [location, setLocation] = useState<UserLocation | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [watchId, setWatchId] = useState<number | null>(null);

  useEffect(() => {
    // Check if geolocation is available
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by this browser');
      setLoading(false);
      return;
    }

    const geoOptions: PositionOptions = {
      enableHighAccuracy,
      timeout,
      maximumAge,
    };

    const handleSuccess = (position: GeolocationPosition) => {
      const userLocation: UserLocation = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
        accuracy: position.coords.accuracy,
        timestamp: new Date(),
      };
      setLocation(userLocation);
      setError(null);
      setLoading(false);
    };

    const handleError = (error: GeolocationPositionError) => {
      let errorMessage = 'Unable to get your location';
      
      switch (error.code) {
        case error.PERMISSION_DENIED:
          errorMessage = 'Permission denied. Please enable location access in browser settings.';
          break;
        case error.POSITION_UNAVAILABLE:
          errorMessage = 'Location information is unavailable.';
          break;
        case error.TIMEOUT:
          errorMessage = 'The request to get user location timed out.';
          break;
      }
      
      setError(errorMessage);
      setLoading(false);
    };

    if (watchPosition) {
      // Continuously watch user's position
      const id = navigator.geolocation.watchPosition(
        handleSuccess,
        handleError,
        geoOptions
      );
      setWatchId(id);
    } else {
      // Get position once
      navigator.geolocation.getCurrentPosition(
        handleSuccess,
        handleError,
        geoOptions
      );
    }

    // Cleanup
    return () => {
      if (watchId !== null) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, [enableHighAccuracy, timeout, maximumAge, watchPosition]);

  return {
    location,
    error,
    loading,
    watchId,
  };
};

export default useUserLocation;
