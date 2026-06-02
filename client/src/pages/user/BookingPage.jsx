import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { motion } from 'framer-motion';
import { Clock, Calendar, Car, Bike, Truck, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';

const BookingPage = () => {
  const { id: parkingId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [parking, setParking] = useState(null);
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [lockExpiresAt, setLockExpiresAt] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0);

  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [startTime, setStartTime] = useState('10:00');
  const [endTime, setEndTime] = useState('12:00');
  const [vehicleType, setVehicleType] = useState('car');
  const [vehicleNumber, setVehicleNumber] = useState('');

  const socketRef = useRef();

  useEffect(() => {
    // Connect to Socket.io on correct port 5001
    socketRef.current = io('http://localhost:5001', {
      withCredentials: true,
    });

    socketRef.current.on('slot_locked', (data) => {
      if (data.parkingId === parkingId) {
        updateSlotStatus(data.slotNumber, 'locked', data.userId);
      }
    });

    socketRef.current.on('slot_released', (data) => {
      if (data.parkingId === parkingId) {
        updateSlotStatus(data.slotNumber, 'available', null);
      }
    });

    fetchParkingDetails();

    return () => {
      if (socketRef.current) socketRef.current.disconnect();
    };
  }, [parkingId]);

  // Re-fetch slots when date changes
  useEffect(() => {
    if (parking) {
      fetchBookedSlots();
    }
  }, [date, parking]);

  useEffect(() => {
    if (lockExpiresAt) {
      const interval = setInterval(() => {
        const remaining = Math.max(
          0,
          Math.floor((new Date(lockExpiresAt).getTime() - Date.now()) / 1000)
        );
        setTimeLeft(remaining);
        if (remaining === 0) {
          setSelectedSlot(null);
          setLockExpiresAt(null);
          toast.error('Slot lock expired!');
        }
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [lockExpiresAt]);

  const fetchParkingDetails = async () => {
    try {
      const { data } = await api.get(`/parking/${parkingId}`);
      setParking(data);

      // Generate slots
      const generatedSlots = Array.from(
        { length: data.totalSlots },
        (_, i) => ({
          id: `A-${i + 1}`,
          status: 'available',
          lockedBy: null
        })
      );
      setSlots(generatedSlots);

      // Now fetch booked slots
      await fetchBookedSlotsForDate(data.totalSlots);
    } catch (error) {
      toast.error('Failed to load parking details');
    } finally {
      setLoading(false);
    }
  };

  const fetchBookedSlotsForDate = async (totalSlots) => {
    try {
      const { data } = await api.get(
        `/booking/booked-slots?parkingId=${parkingId}&date=${date}`
      );
      const bookedSlotNumbers = data.bookedSlots || [];

      // Update slots with booked status
      setSlots(
        Array.from({ length: totalSlots }, (_, i) => ({
          id: `A-${i + 1}`,
          status: bookedSlotNumbers.includes(`A-${i + 1}`)
            ? 'booked'
            : 'available',
          lockedBy: null
        }))
      );
    } catch (error) {
      console.error('Failed to fetch booked slots:', error);
    }
  };

  const fetchBookedSlots = async () => {
    if (!parking) return;
    await fetchBookedSlotsForDate(parking.totalSlots);
  };

  const updateSlotStatus = (slotId, status, userId) => {
    setSlots((prev) =>
      prev.map((s) =>
        s.id === slotId ? { ...s, status, lockedBy: userId } : s
      )
    );
  };

  const handleSlotClick = async (slot) => {
    if (
      slot.status === 'booked' ||
      (slot.status === 'locked' && slot.lockedBy !== user._id)
    ) {
      return toast.error('Slot unavailable');
    }

    try {
      const { data } = await api.post('/slots/lock', {
        parkingId,
        slotNumber: slot.id
      });
      setSelectedSlot(slot.id);
      setLockExpiresAt(data.lock?.expiresAt || data.expiresAt);
      toast.success(`Slot ${slot.id} locked for 5 minutes!`);

      if (socketRef.current) {
        socketRef.current.emit('lock_slot', {
          parkingId,
          slotNumber: slot.id,
          userId: user._id
        });
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to lock slot');
    }
  };

  const calculateTotal = () => {
    if (!parking) return 0;
    const rate = parking.pricing[vehicleType] || 0;
    const start = new Date(`2000-01-01T${startTime}`);
    const end = new Date(`2000-01-01T${endTime}`);
    const diffHours = Math.max(1, (end - start) / (1000 * 60 * 60));
    return rate * diffHours;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedSlot) return toast.error('Please select a slot');
    if (!vehicleNumber) return toast.error('Please enter vehicle number');

    try {
      await api.post('/booking/create', {
        parkingId,
        adminId: parking.adminId?._id || parking.adminId,
        slotNumber: selectedSlot,
        date,
        startTime,
        endTime,
        vehicleType,
        vehicleNumber,
        totalPrice: calculateTotal()
      });

      toast.success('Booking requested! Waiting for admin approval.');
      navigate('/user/my-bookings');
    } catch (error) {
      toast.error(
        error.response?.data?.message || 'Booking failed'
      );
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!parking) {
    return (
      <div className="p-8 text-white text-center">
        <p>Parking not found.</p>
        <button
          onClick={() => navigate('/user/home')}
          className="mt-4 bg-blue-600 px-6 py-2 rounded-lg"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      {/* Left: Slot Grid */}
      <div className="lg:w-1/2 bg-gray-900 p-6 rounded-2xl border border-gray-800">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-white">Select a Slot</h2>
          <div className="flex space-x-3 text-xs font-medium text-gray-400">
            <span className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-green-500"></div> Available
            </span>
            <span className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-red-500"></div> Booked
            </span>
            <span className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div> Locked
            </span>
          </div>
        </div>

        <div className="overflow-y-auto max-h-[500px] pr-1">
          <div className="grid grid-cols-4 sm:grid-cols-5 gap-3">
            {slots.map((slot) => {
              const isSelected = selectedSlot === slot.id;
              let bgColor = 'bg-gray-800 hover:bg-green-900/40 cursor-pointer';
              let borderColor = 'border-green-500/50';
              let textColor = 'text-gray-300';

              if (slot.status === 'booked') {
                bgColor = 'bg-red-500/20 cursor-not-allowed';
                borderColor = 'border-red-500/50';
                textColor = 'text-red-400';
              } else if (
                slot.status === 'locked' &&
                slot.lockedBy !== user._id
              ) {
                bgColor = 'bg-yellow-500/20 cursor-not-allowed';
                borderColor = 'border-yellow-500/50';
                textColor = 'text-yellow-400';
              } else if (isSelected) {
                bgColor = 'bg-blue-600 cursor-pointer';
                borderColor = 'border-blue-400';
                textColor = 'text-white';
              }

              return (
                <motion.button
                  whileHover={{
                    scale: slot.status === 'available' ? 1.05 : 1
                  }}
                  key={slot.id}
                  onClick={() => handleSlotClick(slot)}
                  className={`relative p-4 rounded-xl border ${bgColor} ${borderColor} transition-all flex flex-col items-center justify-center`}
                >
                  <span className={`text-sm font-bold ${textColor}`}>
                    {slot.id}
                  </span>
                  {isSelected && (
                    <div className="absolute -top-2 -right-2 bg-blue-500 rounded-full p-0.5">
                      <CheckCircle2 className="w-4 h-4 text-white" />
                    </div>
                  )}
                </motion.button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Right: Booking Form */}
      <div className="lg:w-1/2 bg-gray-900 p-6 rounded-2xl border border-gray-800">
        <h2 className="text-2xl font-bold text-white mb-1">{parking.name}</h2>
        <p className="text-gray-400 text-sm mb-6">{parking.address}</p>

        {/* Lock Timer */}
        {selectedSlot && timeLeft > 0 && (
          <div className="bg-yellow-500/10 border border-yellow-500/50 rounded-xl p-4 mb-6 flex justify-between items-center">
            <div>
              <p className="text-yellow-400 font-bold">
                Slot {selectedSlot} Locked
              </p>
              <p className="text-sm text-yellow-400/70">
                Complete booking before lock expires
              </p>
            </div>
            <div className="text-2xl font-mono text-yellow-400 font-bold">
              {Math.floor(timeLeft / 60)}:
              {(timeLeft % 60).toString().padStart(2, '0')}
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Vehicle Type & Number */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-400 text-sm mb-1">
                Vehicle Type
              </label>
              <div className="flex bg-gray-800 rounded-lg p-1">
                {['car', 'bike', 'heavy'].map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setVehicleType(type)}
                    className={`flex-1 py-2 text-sm font-medium rounded-md capitalize transition-colors flex justify-center items-center ${vehicleType === type
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-400 hover:text-white'
                      }`}
                  >
                    {type === 'car' && <Car className="w-4 h-4" />}
                    {type === 'bike' && <Bike className="w-4 h-4" />}
                    {type === 'heavy' && <Truck className="w-4 h-4" />}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-gray-400 text-sm mb-1">
                Vehicle Number
              </label>
              <input
                type="text"
                required
                placeholder="AP 16 X 1234"
                className="w-full bg-gray-800 border border-gray-700 rounded-lg py-2.5 px-4 text-white focus:outline-none focus:border-blue-500 uppercase"
                value={vehicleNumber}
                onChange={(e) =>
                  setVehicleNumber(e.target.value.toUpperCase())
                }
              />
            </div>
          </div>

          {/* Date */}
          <div>
            <label className="block text-gray-400 text-sm mb-1">Date</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-3 w-5 h-5 text-gray-500" />
              <input
                type="date"
                required
                min={new Date().toISOString().split('T')[0]}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg py-2.5 pl-10 pr-4 text-white focus:outline-none focus:border-blue-500"
                value={date}
                onChange={(e) => {
                  setDate(e.target.value);
                  setSelectedSlot(null);
                }}
              />
            </div>
          </div>

          {/* Time */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-400 text-sm mb-1">
                Start Time
              </label>
              <div className="relative">
                <Clock className="absolute left-3 top-3 w-5 h-5 text-gray-500" />
                <input
                  type="time"
                  required
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg py-2.5 pl-10 pr-4 text-white focus:outline-none focus:border-blue-500"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                />
              </div>
            </div>
            <div>
              <label className="block text-gray-400 text-sm mb-1">
                End Time
              </label>
              <div className="relative">
                <Clock className="absolute left-3 top-3 w-5 h-5 text-gray-500" />
                <input
                  type="time"
                  required
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg py-2.5 pl-10 pr-4 text-white focus:outline-none focus:border-blue-500"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Total & Submit */}
          <div className="pt-4 border-t border-gray-800 flex justify-between items-center">
            <div>
              <p className="text-gray-400 text-sm">Total Price</p>
              <p className="text-3xl font-bold text-white">
                ₹{calculateTotal()}
              </p>
            </div>
            <button
              type="submit"
              disabled={!selectedSlot}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Request Booking
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookingPage;