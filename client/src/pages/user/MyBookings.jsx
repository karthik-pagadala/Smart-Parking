import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { QRCodeSVG } from 'qrcode.react';
import { motion } from 'framer-motion';
import { Calendar, Clock, MapPin, CreditCard } from 'lucide-react';
import toast from 'react-hot-toast';

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const { data } = await api.get('/booking/my-bookings');
        setBookings(data);
      } catch (error) {
        toast.error('Failed to load bookings');
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  const handlePayment = async (bookingId) => {
    try {
      const { data: order } = await api.post('/payment/create-order', { bookingId });
      
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_SokPsS473vLJUj', // Fallback to provided key
        amount: order.amount,
        currency: order.currency,
        name: "Smart Parking",
        description: "Parking Slot Booking",
        order_id: order.id,
        handler: async function (response) {
          try {
            await api.post('/payment/verify', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              bookingId
            });
            toast.success("Payment Successful!");
            // Refresh bookings
            const { data } = await api.get('/booking/my-bookings');
            setBookings(data);
          } catch (err) {
            toast.error("Payment verification failed");
          }
        },
        theme: {
          color: "#3B82F6"
        }
      };
      
      // Load Razorpay script dynamically if not in index.html
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => {
        const rzp = new window.Razorpay(options);
        rzp.open();
      };
      document.body.appendChild(script);
      
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to initiate payment');
    }
  };

  const handleCancel = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return;
    try {
      await api.put(`/booking/${bookingId}/cancel`);
      toast.success('Booking cancelled');
      setBookings(bookings.filter(b => b._id !== bookingId));
    } catch (error) {
      toast.error('Failed to cancel booking');
    }
  };

  if (loading) return <div className="p-8 text-white">Loading your bookings...</div>;

  return (
    <div className="h-full">
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-white">My Active Bookings</h1>
        <p className="text-gray-400">View and manage your upcoming parking reservations</p>
      </header>

      {bookings.length === 0 ? (
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-10 text-center">
          <Calendar className="w-16 h-16 text-gray-700 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">No Active Bookings</h3>
          <p className="text-gray-400 mb-6">You don't have any pending or upcoming parking reservations.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bookings.map((booking) => (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              key={booking._id} 
              className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden flex flex-col"
            >
              <div className="p-6 flex-1">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      booking.status === 'pending' ? 'bg-yellow-500/20 text-yellow-500' :
                      booking.status === 'approved' ? 'bg-green-500/20 text-green-500' :
                      'bg-gray-500/20 text-gray-500'
                    }`}>
                      {booking.status.toUpperCase()}
                    </span>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-white">Slot {booking.slotNumber}</p>
                    <p className="text-sm text-gray-400 uppercase">{booking.vehicleNumber}</p>
                  </div>
                </div>

                <h3 className="text-lg font-bold text-white mb-4">{booking.parkingId?.name}</h3>
                
                <div className="space-y-3 mb-6">
                  <div className="flex items-center text-gray-400 text-sm">
                    <MapPin className="w-4 h-4 mr-3 text-blue-500" />
                    <span className="truncate">{booking.parkingId?.address}</span>
                  </div>
                  <div className="flex items-center text-gray-400 text-sm">
                    <Calendar className="w-4 h-4 mr-3 text-blue-500" />
                    <span>{new Date(booking.date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center text-gray-400 text-sm">
                    <Clock className="w-4 h-4 mr-3 text-blue-500" />
                    <span>{booking.startTime} - {booking.endTime}</span>
                  </div>
                  <div className="flex items-center text-gray-400 text-sm">
                    <CreditCard className="w-4 h-4 mr-3 text-blue-500" />
                    <span>₹{booking.totalPrice} ({booking.paymentStatus})</span>
                  </div>
                </div>

                {/* QR Code Section - Only show if approved AND paid */}
                {booking.status === 'approved' && booking.paymentStatus === 'Paid' && (
                  <div className="flex flex-col items-center justify-center p-4 bg-white rounded-xl mb-4">
                    <QRCodeSVG 
                      value={JSON.stringify({ bookingId: booking._id, userId: booking.userId })} 
                      size={120} 
                      level="H"
                    />
                    <p className="text-xs text-gray-600 mt-2 font-bold text-center">Scan at Entrance</p>
                  </div>
                )}
              </div>

              <div className="p-4 border-t border-gray-800 bg-gray-900/50 flex space-x-3">
                {booking.status === 'approved' && booking.paymentStatus === 'Unpaid' && (
                  <button 
                    onClick={() => handlePayment(booking._id)}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-semibold transition-colors text-sm"
                  >
                    Pay Now
                  </button>
                )}
                <button 
                  onClick={() => handleCancel(booking._id)}
                  className="flex-1 bg-gray-800 hover:bg-red-500/20 hover:text-red-400 text-gray-300 py-2 rounded-lg font-semibold transition-colors text-sm border border-gray-700 hover:border-red-500/50"
                >
                  Cancel Booking
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyBookings;
