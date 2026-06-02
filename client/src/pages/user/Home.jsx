import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin } from 'lucide-react';
import api from '../../services/api';
import MapComponent from '../../components/map/MapComponent';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const [parkings, setParkings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchedLocation, setSearchedLocation] = useState(null);
  const navigate = useNavigate();

  // Called by MapComponent when:
  // 1. GPS detected on mount
  // 2. User searches a city
  // 3. User clicks GPS button
  const handleLocationChange = async (lat, lng, locationName) => {
    try {
      setLoading(true);
      setSearchedLocation(locationName);
      const { data } = await api.get(`/parking/all?lat=${lat}&lng=${lng}&radius=10`);
      setParkings(data);
    } catch (error) {
      console.error('Failed to fetch parkings:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-white">Find Parking</h1>
        <p className="text-gray-400">Discover and book parking spaces near you</p>
      </header>

      {/* Map — always renders, handles GPS internally */}
      <div
        className="w-full rounded-2xl overflow-hidden border border-gray-800 shadow-lg"
        style={{ height: '500px' }}
      >
        <MapComponent
          parkings={parkings}
          onBookNow={(p) => navigate(`/user/booking/${p.id}`)}
          onLocationChange={handleLocationChange}
        />
      </div>

      {/* Parking Cards */}
      <div>
        <h2 className="text-xl font-bold text-white mb-1">
          {searchedLocation ? `Parking near "${searchedLocation}"` : 'Finding parking near you...'}
        </h2>
        {searchedLocation && (
          <p className="text-gray-500 text-sm mb-4">Showing results within 10km radius</p>
        )}

        {/* Loading state */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-gray-800 rounded-2xl p-5 h-36 border border-gray-700 animate-pulse"></div>
            ))}
          </div>
        )}

        {/* Parking cards */}
        {!loading && parkings.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {parkings.map((p) => (
              <motion.div
                key={p._id}
                whileHover={{ y: -5 }}
                className="bg-gray-900 rounded-2xl p-5 border border-gray-800 hover:border-blue-500/50 transition-colors cursor-pointer group"
                onClick={() => navigate(`/user/booking/${p._id}`)}
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors">
                      {p.name}
                    </h3>
                    <p className="text-gray-400 text-sm flex items-center mt-1">
                      <MapPin className="w-3 h-3 mr-1" /> {p.address}
                    </p>
                    {p.distance !== undefined && (
                      <p className="text-blue-400 text-xs mt-1 font-medium">
                        📍 {typeof p.distance === 'number' ? p.distance.toFixed(1) : p.distance} km away
                      </p>
                    )}
                  </div>
                  <div className="bg-green-500/20 text-green-400 text-xs font-bold px-2 py-1 rounded-md">
                    {p.activeSlots} slots left
                  </div>
                </div>
                <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-800">
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider">Price/Hr</p>
                    <p className="text-white font-bold text-lg">₹{p.pricing?.car}</p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/user/booking/${p._id}`);
                    }}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
                  >
                    Book Now
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Empty state — only show after location is known */}
        {!loading && parkings.length === 0 && searchedLocation && (
          <div className="text-center py-16 bg-gray-900 rounded-2xl border border-gray-800">
            <p className="text-5xl mb-4">🅿️</p>
            <p className="text-white font-bold text-lg mb-2">
              No parking available near "{searchedLocation}"
            </p>
            <p className="text-gray-400 text-sm mb-4">
              No parking spots found within 10km of this location
            </p>
            <button
              onClick={() => handleLocationChange(16.5062, 80.648, 'Vijayawada')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg text-sm font-semibold transition-colors"
            >
              Search Vijayawada Instead
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;