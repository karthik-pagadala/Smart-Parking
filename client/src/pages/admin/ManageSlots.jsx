import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { motion } from 'framer-motion';
import { Plus, Trash2, Edit3, Settings, AlertTriangle } from 'lucide-react';
import toast from 'react-hot-toast';

const ManageSlots = () => {
  const { user } = useAuth();
  const [parkings, setParkings] = useState([]);
  const [selectedParking, setSelectedParking] = useState(null);
  const [loading, setLoading] = useState(true);

  // Since we only generated dummy slots for the UI in the booking page, 
  // here we manage the logical 'activeSlots' and 'totalSlots' for a parking lot.
  // In a more complex DB, this would manage actual Slot documents.

  useEffect(() => {
    const fetchAdminParkings = async () => {
      try {
        const { data } = await api.get('/parking/all');
        const myParkings = data.filter(p => p.adminId === user._id || p.adminId?._id === user._id);
        setParkings(myParkings);
        if (myParkings.length > 0) setSelectedParking(myParkings[0]);
      } catch (error) {
        toast.error('Failed to load parkings');
      } finally {
        setLoading(false);
      }
    };
    fetchAdminParkings();
  }, [user._id]);

  const handleUpdateSlots = async (e) => {
    e.preventDefault();
    try {
      const activeSlots = e.target.activeSlots.value;
      const { data } = await api.put(`/parking/${selectedParking._id}`, { activeSlots });
      
      setParkings(parkings.map(p => p._id === data._id ? data : p));
      setSelectedParking(data);
      toast.success('Slots updated successfully');
    } catch (error) {
      toast.error('Failed to update slots');
    }
  };

  const handleDeleteParking = async (id) => {
    if (!window.confirm('Are you sure you want to completely delete this parking location? This cannot be undone.')) return;
    try {
      await api.delete(`/parking/${id}`);
      setParkings(parkings.filter(p => p._id !== id));
      if (selectedParking?._id === id) setSelectedParking(null);
      toast.success('Parking deleted');
    } catch (error) {
      toast.error('Failed to delete parking');
    }
  };

  if (loading) return <div className="p-8 text-white">Loading your parking locations...</div>;

  return (
    <div className="h-full flex flex-col">
      <header className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white">Manage Slots</h1>
          <p className="text-gray-400">Configure availability and manage maintenance</p>
        </div>
      </header>

      {parkings.length === 0 ? (
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-10 text-center">
          <Settings className="w-16 h-16 text-gray-700 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">No Parking Spaces Found</h3>
          <p className="text-gray-400 mb-6">You need to add a parking location before you can manage slots.</p>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-6 h-full">
          
          {/* Parking List Sidebar */}
          <div className="w-full lg:w-1/3 bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden flex flex-col h-[500px]">
            <div className="p-4 border-b border-gray-800 bg-gray-800/50">
              <h3 className="font-bold text-white">Your Locations</h3>
            </div>
            <div className="flex-1 overflow-y-auto">
              {parkings.map(p => (
                <div 
                  key={p._id}
                  onClick={() => setSelectedParking(p)}
                  className={`p-4 border-b border-gray-800 cursor-pointer transition-colors ${
                    selectedParking?._id === p._id ? 'bg-blue-600/10 border-l-4 border-l-blue-500' : 'hover:bg-gray-800'
                  }`}
                >
                  <h4 className={`font-bold ${selectedParking?._id === p._id ? 'text-blue-400' : 'text-white'}`}>{p.name}</h4>
                  <p className="text-xs text-gray-500 mt-1 truncate">{p.address}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Manage Area */}
          {selectedParking && (
            <div className="w-full lg:w-2/3 bg-gray-900 border border-gray-800 rounded-2xl p-6 shadow-sm overflow-y-auto h-[500px]">
              <div className="flex justify-between items-start mb-6 pb-6 border-b border-gray-800">
                <div>
                  <h2 className="text-2xl font-bold text-white">{selectedParking.name}</h2>
                  <p className="text-gray-400 text-sm mt-1">Total Capacity: {selectedParking.totalSlots} Slots</p>
                </div>
                <button 
                  onClick={() => handleDeleteParking(selectedParking._id)}
                  className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                  title="Delete Location"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleUpdateSlots} className="bg-gray-800/50 p-6 rounded-xl border border-gray-700 mb-8">
                <h3 className="text-white font-bold mb-4 flex items-center">
                  <Edit3 className="w-4 h-4 mr-2 text-blue-500" /> Update Active Slots
                </h3>
                <div className="flex items-end gap-4">
                  <div className="flex-1">
                    <label className="block text-gray-400 text-sm mb-1">Available for Booking</label>
                    <input 
                      type="number" 
                      name="activeSlots"
                      defaultValue={selectedParking.activeSlots}
                      min="0"
                      max={selectedParking.totalSlots}
                      className="w-full bg-gray-900 border border-gray-700 rounded-lg py-2.5 px-4 text-white focus:outline-none focus:border-blue-500" 
                    />
                  </div>
                  <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-6 rounded-lg transition-colors">
                    Save Changes
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-2 flex items-center">
                  <AlertTriangle className="w-3 h-3 mr-1 text-yellow-500" /> 
                  Reduce active slots to mark some as under maintenance.
                </p>
              </form>

              {/* Visual Grid Representation */}
              <div>
                <h3 className="text-white font-bold mb-4">Slot Grid Visualization</h3>
                <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-8 gap-2">
                  {Array.from({ length: selectedParking.totalSlots }).map((_, i) => {
                    const isUnderMaintenance = i >= selectedParking.activeSlots;
                    return (
                      <div 
                        key={i}
                        className={`aspect-square rounded-lg flex items-center justify-center text-xs font-bold border transition-colors ${
                          isUnderMaintenance 
                            ? 'bg-red-500/10 border-red-500/50 text-red-500' 
                            : 'bg-green-500/10 border-green-500/50 text-green-500'
                        }`}
                        title={isUnderMaintenance ? 'Maintenance' : 'Active'}
                      >
                        A-{i+1}
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>
          )}

        </div>
      )}
    </div>
  );
};

export default ManageSlots;
