import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Users, ShieldCheck, Calendar, DollarSign } from 'lucide-react';
import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import toast from 'react-hot-toast';

const Analytics = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalAdmins: 0,
    totalBookings: 0,
    totalRevenue: 0
  });
  const [loading, setLoading] = useState(true);

  // Dummy data for charts
  const userGrowthData = [
    { name: 'Jan', users: 120 }, { name: 'Feb', users: 250 },
    { name: 'Mar', users: 380 }, { name: 'Apr', users: 510 },
    { name: 'May', users: 760 }, { name: 'Jun', users: 950 }
  ];

  const roleDistribution = [
    { name: 'Users', value: stats.totalUsers || 100 },
    { name: 'Admins', value: stats.totalAdmins || 20 }
  ];
  const COLORS = ['#3B82F6', '#EF4444'];

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const { data } = await api.get('/superadmin/analytics');
        setStats(data);
      } catch (error) {
        toast.error('Failed to load analytics');
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading) return <div className="p-8 text-white animate-pulse">Loading Platform Analytics...</div>;

  return (
    <div className="h-full flex flex-col space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-white">Platform Analytics</h1>
        <p className="text-gray-400">High-level overview of Smart Parking system performance</p>
      </header>

      {/* Top Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-gray-900 p-6 rounded-2xl border border-gray-800">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-400 text-sm font-medium">Total Users</p>
              <h3 className="text-3xl font-bold text-white mt-1">{stats.totalUsers}</h3>
            </div>
            <div className="p-3 bg-blue-500/20 rounded-xl"><Users className="w-6 h-6 text-blue-500" /></div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-gray-900 p-6 rounded-2xl border border-gray-800">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-400 text-sm font-medium">Verified Admins</p>
              <h3 className="text-3xl font-bold text-white mt-1">{stats.totalAdmins}</h3>
            </div>
            <div className="p-3 bg-red-500/20 rounded-xl"><ShieldCheck className="w-6 h-6 text-red-500" /></div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-gray-900 p-6 rounded-2xl border border-gray-800">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-400 text-sm font-medium">Total Bookings</p>
              <h3 className="text-3xl font-bold text-white mt-1">{stats.totalBookings}</h3>
            </div>
            <div className="p-3 bg-green-500/20 rounded-xl"><Calendar className="w-6 h-6 text-green-500" /></div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-gradient-to-br from-red-600 to-red-900 p-6 rounded-2xl border border-red-500/30">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-red-200 text-sm font-medium">Platform GMV</p>
              <h3 className="text-3xl font-bold text-white mt-1">₹{stats.totalRevenue.toLocaleString()}</h3>
            </div>
            <div className="p-3 bg-white/10 rounded-xl"><DollarSign className="w-6 h-6 text-white" /></div>
          </div>
        </motion.div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1">
        <div className="lg:col-span-2 bg-gray-900 p-6 rounded-2xl border border-gray-800 flex flex-col min-h-[300px]">
          <h3 className="text-lg font-bold text-white mb-6">User Growth</h3>
          <div className="flex-1 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={userGrowthData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1F2937" vertical={false} />
                <XAxis dataKey="name" stroke="#9CA3AF" tick={{fill: '#9CA3AF'}} axisLine={false} tickLine={false} />
                <YAxis stroke="#9CA3AF" tick={{fill: '#9CA3AF'}} axisLine={false} tickLine={false} />
                <RechartsTooltip cursor={{fill: '#1F2937'}} contentStyle={{backgroundColor: '#111827', borderColor: '#374151', color: '#fff'}} />
                <Bar dataKey="users" fill="#3B82F6" radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-gray-900 p-6 rounded-2xl border border-gray-800 flex flex-col min-h-[300px]">
          <h3 className="text-lg font-bold text-white mb-2">Account Distribution</h3>
          <div className="flex-1 w-full flex items-center justify-center relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={roleDistribution} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                  {roleDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <RechartsTooltip contentStyle={{backgroundColor: '#111827', borderColor: '#374151', color: '#fff'}} />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex items-center justify-center flex-col pointer-events-none">
              <span className="text-2xl font-bold text-white">{stats.totalUsers + stats.totalAdmins}</span>
              <span className="text-xs text-gray-500">Total</span>
            </div>
          </div>
          <div className="flex justify-center space-x-4 mt-4">
            <div className="flex items-center"><div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div><span className="text-sm text-gray-400">Users</span></div>
            <div className="flex items-center"><div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div><span className="text-sm text-gray-400">Admins</span></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
