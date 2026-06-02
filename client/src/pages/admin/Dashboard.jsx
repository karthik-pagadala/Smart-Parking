import React, { useState, useEffect } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  LineChart, Line 
} from 'recharts';
import { CreditCard, CalendarCheck, MapPin, TrendingUp, Users } from 'lucide-react';
import { motion } from 'framer-motion';

const Dashboard = () => {
  const [loading, setLoading] = useState(true);

  // In a real app, you would fetch these stats from the backend (/api/admin/stats)
  // For UI implementation we'll use dummy data reflecting typical Smart Parking metrics
  const stats = {
    totalRevenue: 45890,
    activeBookings: 24,
    totalSlots: 150,
    occupancyRate: 85,
  };

  const revenueData = [
    { name: 'Mon', revenue: 4000 },
    { name: 'Tue', revenue: 3000 },
    { name: 'Wed', revenue: 5500 },
    { name: 'Thu', revenue: 4500 },
    { name: 'Fri', revenue: 7000 },
    { name: 'Sat', revenue: 9000 },
    { name: 'Sun', revenue: 8500 },
  ];

  useEffect(() => {
    // Simulate API fetch delay
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="h-full flex flex-col space-y-6 animate-pulse">
        <div className="h-10 bg-gray-900 rounded-lg w-1/4"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1,2,3,4].map(i => <div key={i} className="h-32 bg-gray-900 rounded-2xl"></div>)}
        </div>
        <div className="h-96 bg-gray-900 rounded-2xl"></div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col space-y-6">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white">Dashboard Overview</h1>
          <p className="text-gray-400">Monitor your parking space performance in real-time</p>
        </div>
      </header>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-gray-900 p-6 rounded-2xl border border-gray-800 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-400 text-sm font-medium">Total Revenue</p>
              <h3 className="text-3xl font-bold text-white mt-1">₹{stats.totalRevenue.toLocaleString()}</h3>
            </div>
            <div className="p-3 bg-green-500/20 rounded-xl">
              <CreditCard className="w-6 h-6 text-green-500" />
            </div>
          </div>
          <p className="text-green-500 text-sm mt-4 font-medium flex items-center">
            <TrendingUp className="w-4 h-4 mr-1" /> +12.5% from last week
          </p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-gray-900 p-6 rounded-2xl border border-gray-800 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-400 text-sm font-medium">Active Bookings</p>
              <h3 className="text-3xl font-bold text-white mt-1">{stats.activeBookings}</h3>
            </div>
            <div className="p-3 bg-blue-500/20 rounded-xl">
              <CalendarCheck className="w-6 h-6 text-blue-500" />
            </div>
          </div>
          <p className="text-gray-400 text-sm mt-4 font-medium">
            Currently parked vehicles
          </p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-gray-900 p-6 rounded-2xl border border-gray-800 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-400 text-sm font-medium">Occupancy Rate</p>
              <h3 className="text-3xl font-bold text-white mt-1">{stats.occupancyRate}%</h3>
            </div>
            <div className="p-3 bg-purple-500/20 rounded-xl">
              <Users className="w-6 h-6 text-purple-500" />
            </div>
          </div>
          <div className="w-full bg-gray-800 rounded-full h-2 mt-4">
            <div className="bg-purple-500 h-2 rounded-full" style={{ width: `${stats.occupancyRate}%` }}></div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-gray-900 p-6 rounded-2xl border border-gray-800 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-400 text-sm font-medium">Total Slots</p>
              <h3 className="text-3xl font-bold text-white mt-1">{stats.totalSlots}</h3>
            </div>
            <div className="p-3 bg-yellow-500/20 rounded-xl">
              <MapPin className="w-6 h-6 text-yellow-500" />
            </div>
          </div>
          <p className="text-gray-400 text-sm mt-4 font-medium">
            Across all locations
          </p>
        </motion.div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1">
        <div className="lg:col-span-2 bg-gray-900 p-6 rounded-2xl border border-gray-800 shadow-sm flex flex-col">
          <h3 className="text-lg font-bold text-white mb-6">Weekly Revenue</h3>
          <div className="flex-1 w-full min-h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1F2937" vertical={false} />
                <XAxis dataKey="name" stroke="#9CA3AF" tick={{fill: '#9CA3AF'}} axisLine={false} tickLine={false} />
                <YAxis stroke="#9CA3AF" tick={{fill: '#9CA3AF'}} axisLine={false} tickLine={false} tickFormatter={(val) => `₹${val/1000}k`} />
                <RechartsTooltip cursor={{fill: '#1F2937'}} contentStyle={{backgroundColor: '#111827', borderColor: '#374151', color: '#fff'}} />
                <Bar dataKey="revenue" fill="#3B82F6" radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-gray-900 p-6 rounded-2xl border border-gray-800 shadow-sm flex flex-col">
          <h3 className="text-lg font-bold text-white mb-6">Recent Activity</h3>
          <div className="flex-1 overflow-y-auto pr-2 space-y-4">
            {[1,2,3,4,5].map((item) => (
              <div key={item} className="flex items-start space-x-3 pb-4 border-b border-gray-800 last:border-0">
                <div className="w-2 h-2 mt-2 rounded-full bg-blue-500 flex-shrink-0"></div>
                <div>
                  <p className="text-sm text-white font-medium">New Booking #BK{Math.floor(Math.random() * 10000)}</p>
                  <p className="text-xs text-gray-500">Slot A-12 • Just now</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
