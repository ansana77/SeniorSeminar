import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import axios from 'axios';
import type { Restroom } from '../../Types/restroom.types';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './MapView.scss';

// Fix for default marker icons in React-Leaflet
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

const DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

// Custom green icon for user location
const UserLocationIcon = L.divIcon({
  className: 'user-location-marker',
  html: `
    <div class="user-marker-pin">
      <div class="user-marker-inner"></div>
    </div>
  `,
  iconSize: [30, 30],
  iconAnchor: [15, 15],
});

// Component to recenter map when user location changes
function RecenterMap({ lat, lng }: { lat: number; lng: number }) {
  const map = useMap();
  useEffect(() => {
    map.setView([lat, lng], 13);
  }, [lat, lng, map]);
  return null;
}

export function Map() {
  const [restrooms, setRestrooms] = useState<Restroom[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locationEnabled, setLocationEnabled] = useState(false);
  const [nearestRestroom, setNearestRestroom] = useState<Restroom | null>(null);

  // Default center: Nashville, TN
  const defaultCenter: [number, number] = [36.1627, -86.7816];

  useEffect(() => {
    fetchRestrooms();
  }, []);

  useEffect(() => {
    if (userLocation && restrooms.length > 0) {
      findNearestRestroom();
    }
  }, [userLocation, restrooms]);

  const fetchRestrooms = async () => {
    try {
      const response = await axios.get<Restroom[]>('http://localhost:3001/api/restrooms');
      setRestrooms(response.data);
    } catch (err) {
      setError('Failed to load restrooms');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLocationToggle = () => {
    if (!locationEnabled) {
      if ('geolocation' in navigator) {
        setError('Requesting location access...');
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setUserLocation({
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            });
            setLocationEnabled(true);
            setError('');
          },
          (error) => {
            console.error('Error getting location:', error);
            let errorMessage = 'Unable to get your location. ';
            
            switch (error.code) {
              case error.PERMISSION_DENIED:
                errorMessage += 'Please enable location permissions in your browser settings.';
                break;
              case error.POSITION_UNAVAILABLE:
                errorMessage += 'Location information is unavailable.';
                break;
              case error.TIMEOUT:
                errorMessage += 'Location request timed out. Please try again.';
                break;
              default:
                errorMessage += 'An unknown error occurred.';
            }
            
            setError(errorMessage);
            setLocationEnabled(false);
          },
          {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0
          }
        );
      } else {
        setError('Geolocation is not supported by your browser');
      }
    } else {
      setLocationEnabled(false);
      setUserLocation(null);
      setNearestRestroom(null);
      setError('');
    }
  };
  
  // Calculates distance using haversine formula
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371; // Radius of the Earth in km
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) *
        Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const findNearestRestroom = () => {
    if (!userLocation) return;

    let nearest: Restroom | null = null;
    let minDistance = Infinity;

    restrooms.forEach((restroom) => {
      const [lng, lat] = restroom.location.coordinates;
      const distance = calculateDistance(userLocation.lat, userLocation.lng, lat, lng);
      
      if (distance < minDistance) {
        minDistance = distance;
        nearest = restroom;
      }
    });

    setNearestRestroom(nearest);
  };

  if (loading) {
    return (
      <div className="map-container">
        <div className="loading">Loading map...</div>
      </div>
    );
  }

  if (error && restrooms.length === 0) {
    return (
      <div className="map-container">
        <div className="error">{error}</div>
      </div>
    );
  }

  const mapCenter: [number, number] = userLocation
    ? [userLocation.lat, userLocation.lng]
    : defaultCenter;

  return (
    <div className="map-container">
      <div className="map-controls">
        <h1>Restroom Map</h1>
        <div className="controls-row">
          <button
            onClick={handleLocationToggle}
            className={`location-button ${locationEnabled ? 'active' : ''}`}
          >
            {locationEnabled ? '📍 Location Enabled' : '📍 Enable Location'}
          </button>
          {error && (
            <div className={`error-message ${error.includes('Requesting') ? 'info' : ''}`}>
              {error}
            </div>
          )}
        </div>
        
        {!locationEnabled && !error && (
          <div className="location-prompt">
            <p>💡 Enable your location to find the nearest restroom and see your position on the map.</p>
          </div>
        )}
        
        {nearestRestroom && locationEnabled && (
          <div className="nearest-restroom">
            <h3>Nearest Restroom</h3>
            <div className="restroom-info">
              <strong>{nearestRestroom.name}</strong>
              <p>{nearestRestroom.address.street}, {nearestRestroom.address.city}</p>
              <div className="tags">
                {nearestRestroom.isAccessible && <span className="tag">Accessible</span>}
                {nearestRestroom.isGenderNeutral && <span className="tag">Unisex</span>}
                {nearestRestroom.hasChangingTable && <span className="tag">Changing Table</span>}
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="map-wrapper">
        <MapContainer
          center={mapCenter}
          zoom={13}
          scrollWheelZoom={true}
          className="leaflet-map"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {locationEnabled && userLocation && (
            <>
              <RecenterMap lat={userLocation.lat} lng={userLocation.lng} />
              <Marker 
                position={[userLocation.lat, userLocation.lng]}
                icon={UserLocationIcon}
              >
                <Popup>
                  <div className="user-location-popup">
                    <strong>📍 You're Here</strong>
                  </div>
                </Popup>
              </Marker>
            </>
          )}

          {restrooms.map((restroom) => {
            const [lng, lat] = restroom.location.coordinates;
            return (
              <Marker key={restroom._id} position={[lat, lng]}>
                <Popup>
                  <div className="popup-content">
                    <h3>{restroom.name}</h3>
                    <p className="address">
                      {restroom.address.street}<br />
                      {restroom.address.city}, {restroom.address.state} {restroom.address.zipCode}
                    </p>
                    <div className="popup-tags">
                      {restroom.isAccessible && <span className="tag accessible">Accessible</span>}
                      {restroom.isGenderNeutral && <span className="tag unisex">Unisex</span>}
                      {restroom.hasChangingTable && <span className="tag changing">Changing Table</span>}
                    </div>
                    {restroom.comments && (
                      <p className="comments"><strong>Info:</strong> {restroom.comments}</p>
                    )}
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>
      </div>
    </div>
  );
}
