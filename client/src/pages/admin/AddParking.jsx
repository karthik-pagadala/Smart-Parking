import React, { useState } from 'react';
import api from '../../services/api';
import { motion } from 'framer-motion';
import { Image as ImageIcon, MapPin, CheckCircle, UploadCloud } from 'lucide-react';
import toast from 'react-hot-toast';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet default marker icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const LocationMarker = ({ position, setPosition }) => {
  useMapEvents({
    click(e) {
      setPosition(e.latlng);
    },
  });

  return position === null ? null : (
    <Marker position={position}></Marker>
  );
};

const AddParking = () => {
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    totalSlots: '',
    carPrice: '',
    bikePrice: '',
    heavyPrice: '',
    openTime: '00:00',
    closeTime: '23:59',
    hasEVCharging: 'false'
  });
  
  const [position, setPosition] = useState(null);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleImageChange = (e) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      if (filesArray.length > 5) {
        return toast.error("Maximum 5 images allowed");
      }
      setImages(filesArray);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!position) return toast.error('Please pin the location on the map');
    if (images.length === 0) return toast.error('Please upload at least one image');

    setLoading(true);
    const data = new FormData();
    Object.keys(formData).forEach(key => data.append(key, formData[key]));
    data.append('lat', position.lat);
    data.append('lng', position.lng);
    images.forEach(image => data.append('images', image));

    try {
      await api.post('/parking/add', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      toast.success('Parking space added successfully!');
      // Reset form
      setFormData({ name: '', address: '', totalSlots: '', carPrice: '', bikePrice: '', heavyPrice: '', openTime: '00:00', closeTime: '23:59', hasEVCharging: 'false' });
      setPosition(null);
      setImages([]);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add parking');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto h-full flex flex-col">
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-white">Add Parking Space</h1>
        <p className="text-gray-400">Register a new parking location for users to book</p>
      </header>

      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 shadow-sm flex-1 overflow-y-auto">
        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* Section 1: Basic Details */}
          <section>
            <h3 className="text-lg font-bold text-white mb-4 border-b border-gray-800 pb-2">Basic Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-400 text-sm mb-1">Parking Name</label>
                <input type="text" name="name" required value={formData.name} onChange={handleChange} className="w-full bg-gray-800 border border-gray-700 rounded-lg py-2.5 px-4 text-white focus:outline-none focus:border-blue-500" placeholder="e.g. City Center Mall Parking" />
              </div>
              <div>
                <label className="block text-gray-400 text-sm mb-1">Address</label>
                <input type="text" name="address" required value={formData.address} onChange={handleChange} className="w-full bg-gray-800 border border-gray-700 rounded-lg py-2.5 px-4 text-white focus:outline-none focus:border-blue-500" placeholder="Full street address" />
              </div>
              <div>
                <label className="block text-gray-400 text-sm mb-1">Total Slots</label>
                <input type="number" name="totalSlots" required value={formData.totalSlots} onChange={handleChange} className="w-full bg-gray-800 border border-gray-700 rounded-lg py-2.5 px-4 text-white focus:outline-none focus:border-blue-500" placeholder="e.g. 50" min="1" />
              </div>
              <div>
                <label className="block text-gray-400 text-sm mb-1">EV Charging Available</label>
                <select name="hasEVCharging" value={formData.hasEVCharging} onChange={handleChange} className="w-full bg-gray-800 border border-gray-700 rounded-lg py-2.5 px-4 text-white focus:outline-none focus:border-blue-500">
                  <option value="false">No</option>
                  <option value="true">Yes</option>
                </select>
              </div>
            </div>
          </section>

          {/* Section 2: Pricing & Timings */}
          <section>
            <h3 className="text-lg font-bold text-white mb-4 border-b border-gray-800 pb-2">Pricing & Timings</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-gray-400 text-sm mb-1">Car Price/Hr (₹)</label>
                <input type="number" name="carPrice" required value={formData.carPrice} onChange={handleChange} className="w-full bg-gray-800 border border-gray-700 rounded-lg py-2.5 px-4 text-white focus:outline-none focus:border-blue-500" min="0" />
              </div>
              <div>
                <label className="block text-gray-400 text-sm mb-1">Bike Price/Hr (₹)</label>
                <input type="number" name="bikePrice" required value={formData.bikePrice} onChange={handleChange} className="w-full bg-gray-800 border border-gray-700 rounded-lg py-2.5 px-4 text-white focus:outline-none focus:border-blue-500" min="0" />
              </div>
              <div>
                <label className="block text-gray-400 text-sm mb-1">Heavy Vehicle/Hr (₹)</label>
                <input type="number" name="heavyPrice" required value={formData.heavyPrice} onChange={handleChange} className="w-full bg-gray-800 border border-gray-700 rounded-lg py-2.5 px-4 text-white focus:outline-none focus:border-blue-500" min="0" />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-400 text-sm mb-1">Opening Time</label>
                <input type="time" name="openTime" required value={formData.openTime} onChange={handleChange} className="w-full bg-gray-800 border border-gray-700 rounded-lg py-2.5 px-4 text-white focus:outline-none focus:border-blue-500" />
              </div>
              <div>
                <label className="block text-gray-400 text-sm mb-1">Closing Time</label>
                <input type="time" name="closeTime" required value={formData.closeTime} onChange={handleChange} className="w-full bg-gray-800 border border-gray-700 rounded-lg py-2.5 px-4 text-white focus:outline-none focus:border-blue-500" />
              </div>
            </div>
          </section>

          {/* Section 3: Media & Location */}
          <section>
            <h3 className="text-lg font-bold text-white mb-4 border-b border-gray-800 pb-2">Media & Location</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Image Upload */}
              <div>
                <label className="block text-gray-400 text-sm mb-2">Upload Images (Max 5)</label>
                <div className="border-2 border-dashed border-gray-700 rounded-2xl p-8 flex flex-col items-center justify-center text-center bg-gray-800/50 hover:bg-gray-800 transition-colors cursor-pointer relative">
                  <input type="file" multiple accept="image/*" onChange={handleImageChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                  <UploadCloud className="w-10 h-10 text-gray-500 mb-2" />
                  <p className="text-gray-300 font-medium">Click or drag images here</p>
                  <p className="text-gray-500 text-xs mt-1">Supports JPG, PNG</p>
                  
                  {images.length > 0 && (
                    <div className="mt-4 flex items-center text-green-500 text-sm font-bold">
                      <CheckCircle className="w-4 h-4 mr-1" /> {images.length} file(s) selected
                    </div>
                  )}
                </div>
              </div>

              {/* Map Pinning */}
              <div>
                <label className="block text-gray-400 text-sm mb-2">Pin Location on Map <span className="text-red-500">*</span></label>
                <div className="h-48 rounded-2xl overflow-hidden border border-gray-700">
                  <MapContainer 
                    center={[16.5062, 80.6480]} // Default Vijayawada
                    zoom={12} 
                    style={{ height: "100%", width: "100%", zIndex: 1 }}
                  >
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                    <LocationMarker position={position} setPosition={setPosition} />
                  </MapContainer>
                </div>
                {position && (
                  <p className="text-xs text-green-500 mt-2 font-mono flex items-center">
                    <MapPin className="w-3 h-3 mr-1" /> {position.lat.toFixed(4)}, {position.lng.toFixed(4)}
                  </p>
                )}
              </div>

            </div>
          </section>

          <div className="pt-6 border-t border-gray-800 flex justify-end">
            <button type="submit" disabled={loading} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-xl transition-colors disabled:opacity-50">
              {loading ? 'Uploading & Saving...' : 'Add Parking Space'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddParking;
