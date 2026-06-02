import React, { useState, useEffect, useMemo, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import axios from 'axios';
import L from 'leaflet';
import { Search, Navigation } from 'lucide-react';
import toast from 'react-hot-toast';

import RecenterMap from './RecenterMap';
import FixMapResize from './FixMapResize';
import { calculateDistance } from '../../utils/calculateDistance';

import 'leaflet/dist/leaflet.css';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const parkingIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const userDotIcon = new L.DivIcon({
  className: '',
  html: `<div style="
    background: #3B82F6;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    border: 3px solid white;
    box-shadow: 0 0 0 3px rgba(59,130,246,0.4);
  "></div>`,
  iconSize: [16, 16],
  iconAnchor: [8, 8],
});

// Vijayawada as fallback only if GPS fails
const FALLBACK_CENTER = { lat: 16.5062, lng: 80.648 };

const MapComponent = ({ parkings = [], onBookNow, onLocationChange }) => {
  const [mapCenter, setMapCenter] = useState(FALLBACK_CENTER);
  const [userLocation, setUserLocation] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searching, setSearching] = useState(false);
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [gpsLoading, setGpsLoading] = useState(true);

  const abortControllerRef = useRef(null);

  // On mount: get GPS, move map to user location, fetch nearby parkings
  useEffect(() => {
    if (!navigator.geolocation) {
      setGpsLoading(false);
      // No GPS support — load parkings at default Vijayawada
      if (onLocationChange) onLocationChange(FALLBACK_CENTER.lat, FALLBACK_CENTER.lng, 'Vijayawada');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const loc = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        setUserLocation(loc);
        setMapCenter(loc);
        setGpsLoading(false);
        // Fetch parkings near actual user location
        if (onLocationChange) onLocationChange(loc.lat, loc.lng, 'Your Location');
      },
      () => {
        // GPS denied or failed — use Vijayawada as fallback
        setGpsLoading(false);
        if (onLocationChange) onLocationChange(FALLBACK_CENTER.lat, FALLBACK_CENTER.lng, 'Vijayawada');
      },
      { enableHighAccuracy: true, timeout: 8000, maximumAge: 0 }
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      toast.error('Please enter a location');
      return;
    }

    if (abortControllerRef.current) abortControllerRef.current.abort();
    abortControllerRef.current = new AbortController();

    try {
      setSearching(true);
      const response = await axios.get(
        'https://nominatim.openstreetmap.org/search',
        {
          params: { q: searchQuery, format: 'json', limit: 1 },
          headers: { 'Accept-Language': 'en' },
          signal: abortControllerRef.current.signal,
        }
      );

      if (!response.data || response.data.length === 0) {
        toast.error('Location not found');
        return;
      }

      const newCenter = {
        lat: parseFloat(response.data[0].lat),
        lng: parseFloat(response.data[0].lon),
      };

      setMapCenter(newCenter);

      if (onLocationChange) {
        onLocationChange(newCenter.lat, newCenter.lng, searchQuery);
      }
    } catch (error) {
      if (!axios.isCancel(error)) {
        toast.error('Failed to search location');
      }
    } finally {
      setSearching(false);
    }
  };

  // GPS button — re-center to user's real location
  const centerToUser = () => {
    if (!navigator.geolocation) {
      toast.error('Geolocation not supported');
      return;
    }
    setLoadingLocation(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const loc = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        setUserLocation(loc);
        setMapCenter(loc);
        if (onLocationChange) onLocationChange(loc.lat, loc.lng, 'Your Location');
        toast.success('Moved to your location');
        setLoadingLocation(false);
      },
      () => {
        toast.error('Unable to fetch your location');
        setLoadingLocation(false);
      }
    );
  };

  // Only show markers within 10km of current map center
  // Strictly skip parkings without valid coordinates
  const nearbyParkings = useMemo(() => {
    return parkings
      .map((p) => {
        const pLat = p.location?.lat;
        const pLng = p.location?.lng;
        if (!pLat || !pLng) return null;

        const dist = calculateDistance(mapCenter.lat, mapCenter.lng, pLat, pLng);
        return {
          id: p._id,
          name: p.name || 'Parking Space',
          lat: pLat,
          lng: pLng,
          slots: p.activeSlots || 0,
          price: p.pricing?.car || 0,
          distance: dist,
        };
      })
      .filter(Boolean)
      .filter((p) => p.distance <= 10);
  }, [parkings, mapCenter]);

  return (
    <div
      className="relative w-full rounded-2xl overflow-hidden shadow-lg"
      style={{ height: '500px' }}
    >
      {/* GPS loading indicator */}
      {gpsLoading && (
        <div className="absolute inset-0 z-[2000] bg-gray-900/80 flex flex-col items-center justify-center rounded-2xl">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-3"></div>
          <p className="text-white text-sm">Detecting your location...</p>
        </div>
      )}

      {/* Search Bar */}
      <div className="absolute top-4 left-0 right-0 z-[1000] flex justify-center px-4 pointer-events-none">
        <form
          onSubmit={handleSearch}
          className="flex items-center w-full max-w-md bg-white/95 backdrop-blur-sm rounded-full shadow-lg p-1.5 pointer-events-auto border border-gray-200"
        >
          <input
            type="text"
            placeholder="Search city or area..."
            className="flex-1 bg-transparent px-4 py-2 outline-none text-gray-800 placeholder-gray-400 text-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button
            type="submit"
            disabled={searching}
            className="bg-blue-600 hover:bg-blue-700 text-white p-2.5 rounded-full transition-colors disabled:bg-blue-400"
          >
            <Search className={`w-4 h-4 ${searching ? 'animate-spin' : ''}`} />
          </button>
        </form>
      </div>

      {/* GPS Button */}
      <button
        onClick={centerToUser}
        title="Go to my location"
        className="absolute bottom-6 right-6 z-[1000] bg-white p-3.5 rounded-full shadow-xl text-blue-600 hover:bg-blue-50 transition-all border border-gray-100"
      >
        <Navigation className={`w-5 h-5 ${loadingLocation ? 'animate-pulse text-blue-400' : ''}`} />
      </button>

      <MapContainer
        center={[FALLBACK_CENTER.lat, FALLBACK_CENTER.lng]}
        zoom={14}
        style={{ height: '500px', width: '100%', zIndex: 1 }}
        zoomControl={false}
      >
        <FixMapResize />
        <RecenterMap center={mapCenter} zoom={14} />

        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Blue dot = real GPS location */}
        {userLocation && (
          <Marker
            position={[userLocation.lat, userLocation.lng]}
            icon={userDotIcon}
          >
            <Popup>
              <div style={{ textAlign: 'center', padding: '4px', fontWeight: '600', color: '#1f2937' }}>
                📍 You are here
              </div>
            </Popup>
          </Marker>
        )}

        {/* Parking markers — only within 10km of map center */}
        {nearbyParkings.map((parking) => (
          <Marker key={parking.id} position={[parking.lat, parking.lng]} icon={parkingIcon}>
            <Popup>
              <div style={{ minWidth: '180px', padding: '4px' }}>
                <h3 style={{ fontWeight: 'bold', marginBottom: '8px', color: '#1f2937' }}>
                  {parking.name}
                </h3>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', fontSize: '13px' }}>
                  <span style={{ color: '#6b7280' }}>Available:</span>
                  <span style={{ fontWeight: 'bold', color: parking.slots > 0 ? '#16a34a' : '#dc2626' }}>
                    {parking.slots > 0 ? `${parking.slots} slots` : 'Full'}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', fontSize: '13px' }}>
                  <span style={{ color: '#6b7280' }}>Price:</span>
                  <span style={{ fontWeight: 'bold', color: '#2563eb' }}>₹{parking.price}/hr</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', fontSize: '13px' }}>
                  <span style={{ color: '#6b7280' }}>Distance:</span>
                  <span style={{ fontWeight: 'bold', color: '#6b7280' }}>{parking.distance.toFixed(1)} km</span>
                </div>
                <button
                  onClick={() => onBookNow && onBookNow(parking)}
                  disabled={parking.slots === 0}
                  style={{
                    width: '100%', padding: '8px', borderRadius: '8px', border: 'none',
                    cursor: parking.slots > 0 ? 'pointer' : 'not-allowed',
                    backgroundColor: parking.slots > 0 ? '#2563eb' : '#9ca3af',
                    color: 'white', fontWeight: '600', fontSize: '13px',
                  }}
                >
                  {parking.slots > 0 ? 'Book Now' : 'Currently Full'}
                </button>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default MapComponent;