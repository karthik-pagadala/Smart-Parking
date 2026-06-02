import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { motion } from 'framer-motion';
import { Check, X, Clock, Car, Calendar, MapPin } from 'lucide-react';
import toast from 'react-hot-toast';

const BookingRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rejectingId, setRejectingId] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const { data } = await api.get('/booking/requests');
        setRequests(data);
      } catch (error) {
        toast.error('Failed to load booking requests');
      } finally {
        setLoading(false);
      }
    };
    fetchRequests();
  }, []);

  const handleApprove = async (id) => {
    try {
      await api.put(`/booking/${id}/approve`);
      toast.success('Booking approved! User notified for payment.');
      setRequests(requests.filter(req => req._id !== id));
    } catch (error) {
      toast.error('Failed to approve booking');
    }
  };

  const handleReject = async (id) => {
    if (!rejectionReason.trim()) {
      return toast.error('Please provide a reason for rejection');
    }
    
    try {
      await api.put(`/booking/${id}/reject`, { rejectionReason });
      toast.success('Booking rejected. User notified.');
      setRequests(requests.filter(req => req._id !== id));
      setRejectingId(null);
      setRejectionReason('');
    } catch (error) {
      toast.error('Failed to reject booking');
    }
  };

  if (loading) return <div className="p-8 text-white">Loading requests...</div>;

  return (
    <div className="h-full flex flex-col">
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-white">Booking Requests</h1>
        <p className="text-gray-400">Review and approve incoming parking reservations</p>
      </header>

      {requests.length === 0 ? (
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-16 text-center flex flex-col items-center justify-center">
          <Clock className="w-16 h-16 text-gray-800 mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">No Pending Requests</h3>
          <p className="text-gray-500">All caught up! You have no new booking requests to review.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {requests.map((req) => (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              key={req._id}
              className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden flex flex-col"
            >
              <div className="p-5 border-b border-gray-800 flex justify-between items-center bg-gray-800/20">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-500 font-bold mr-3">
                    {req.userId?.name?.charAt(0) || 'U'}
                  </div>
                  <div>
                    <h4 className="text-white font-bold">{req.userId?.name || 'Unknown User'}</h4>
                    <p className="text-xs text-gray-400">{req.userId?.phone || req.userId?.email}</p>
                  </div>
                </div>
                <span className="bg-yellow-500/20 text-yellow-500 text-xs font-bold px-2 py-1 rounded-md">
                  PENDING
                </span>
              </div>

              <div className="p-5 flex-1 space-y-4">
                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-gray-400 text-xs uppercase mb-1">Requested Slot</p>
                    <p className="text-2xl font-bold text-white">{req.slotNumber}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-gray-400 text-xs uppercase mb-1">Total</p>
                    <p className="text-xl font-bold text-green-400">₹{req.totalPrice}</p>
                  </div>
                </div>

                <div className="space-y-2 pt-2 border-t border-gray-800">
                  <div className="flex items-center text-sm text-gray-300">
                    <MapPin className="w-4 h-4 mr-2 text-gray-500" /> {req.parkingId?.name}
                  </div>
                  <div className="flex items-center text-sm text-gray-300">
                    <Calendar className="w-4 h-4 mr-2 text-gray-500" /> {new Date(req.date).toLocaleDateString()}
                  </div>
                  <div className="flex items-center text-sm text-gray-300">
                    <Clock className="w-4 h-4 mr-2 text-gray-500" /> {req.startTime} - {req.endTime}
                  </div>
                  <div className="flex items-center text-sm text-gray-300">
                    <Car className="w-4 h-4 mr-2 text-gray-500" /> {req.vehicleNumber} ({req.vehicleType})
                  </div>
                </div>
              </div>

              <div className="p-4 border-t border-gray-800 bg-gray-900/50">
                {rejectingId === req._id ? (
                  <div className="space-y-3">
                    <input 
                      type="text" 
                      placeholder="Reason for rejection..." 
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg py-2 px-3 text-white text-sm focus:outline-none focus:border-red-500"
                      value={rejectionReason}
                      onChange={(e) => setRejectionReason(e.target.value)}
                      autoFocus
                    />
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => handleReject(req._id)}
                        className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg text-sm font-semibold transition-colors"
                      >
                        Confirm Reject
                      </button>
                      <button 
                        onClick={() => { setRejectingId(null); setRejectionReason(''); }}
                        className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-2 rounded-lg text-sm font-semibold transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex space-x-3">
                    <button 
                      onClick={() => handleApprove(req._id)}
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2.5 rounded-lg text-sm font-semibold transition-colors flex justify-center items-center"
                    >
                      <Check className="w-4 h-4 mr-1" /> Approve
                    </button>
                    <button 
                      onClick={() => setRejectingId(req._id)}
                      className="flex-1 bg-gray-800 hover:bg-red-500/20 text-gray-300 hover:text-red-400 py-2.5 rounded-lg text-sm font-semibold transition-colors border border-gray-700 hover:border-red-500/50 flex justify-center items-center"
                    >
                      <X className="w-4 h-4 mr-1" /> Reject
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BookingRequests;
