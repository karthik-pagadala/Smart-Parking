import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';
import { DollarSign, Download, Calendar as CalendarIcon, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';

const Earnings = () => {
  const [timeRange, setTimeRange] = useState('monthly');
  const [loading, setLoading] = useState(true);

  // Dummy earnings data for the UI
  const earningsData = [
    { name: 'Jan', total: 45000, offline: 10000, online: 35000 },
    { name: 'Feb', total: 52000, offline: 12000, online: 40000 },
    { name: 'Mar', total: 48000, offline: 9000, online: 39000 },
    { name: 'Apr', total: 61000, offline: 15000, online: 46000 },
    { name: 'May', total: 59000, offline: 11000, online: 48000 },
    { name: 'Jun', total: 75000, offline: 14000, online: 61000 },
  ];

  useEffect(() => {
    // Simulate fetch
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, [timeRange]);

  return (
    <div className="h-full flex flex-col space-y-6">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-white">Earnings & Revenue</h1>
          <p className="text-gray-400">Detailed breakdown of your financial performance</p>
        </div>
        <button className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors border border-gray-700 flex items-center">
          <Download className="w-4 h-4 mr-2" /> Export Report
        </button>
      </header>

      {/* Top Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-gradient-to-br from-blue-600 to-blue-800 p-6 rounded-2xl shadow-lg border border-blue-500/30">
          <p className="text-blue-100 text-sm font-medium mb-1">Total Lifetime Earnings</p>
          <h3 className="text-4xl font-bold text-white">₹3,40,000</h3>
          <p className="text-blue-200 text-sm mt-4 font-medium flex items-center">
            <TrendingUp className="w-4 h-4 mr-1" /> +24% Year over Year
          </p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-gray-900 p-6 rounded-2xl border border-gray-800 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-400 text-sm font-medium">This Month</p>
              <h3 className="text-3xl font-bold text-white mt-1">₹75,000</h3>
            </div>
            <div className="p-3 bg-green-500/20 rounded-xl">
              <DollarSign className="w-6 h-6 text-green-500" />
            </div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-gray-900 p-6 rounded-2xl border border-gray-800 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-400 text-sm font-medium">Pending Payout</p>
              <h3 className="text-3xl font-bold text-white mt-1">₹12,400</h3>
            </div>
            <div className="p-3 bg-yellow-500/20 rounded-xl">
              <CalendarIcon className="w-6 h-6 text-yellow-500" />
            </div>
          </div>
          <p className="text-gray-500 text-sm mt-4">Expected settling on 1st of next month</p>
        </motion.div>
      </div>

      {/* Chart */}
      <div className="bg-gray-900 p-6 rounded-2xl border border-gray-800 shadow-sm flex-1 flex flex-col min-h-[400px]">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-bold text-white">Revenue Analysis</h3>
          <div className="flex bg-gray-800 p-1 rounded-lg">
            {['weekly', 'monthly', 'yearly'].map(range => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors capitalize ${
                  timeRange === range ? 'bg-blue-600 text-white shadow-sm' : 'text-gray-400 hover:text-white'
                }`}
              >
                {range}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="flex-1 w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={earningsData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1F2937" vertical={false} />
                <XAxis dataKey="name" stroke="#9CA3AF" tick={{fill: '#9CA3AF'}} axisLine={false} tickLine={false} />
                <YAxis stroke="#9CA3AF" tick={{fill: '#9CA3AF'}} axisLine={false} tickLine={false} tickFormatter={(val) => `₹${val/1000}k`} />
                <RechartsTooltip contentStyle={{backgroundColor: '#111827', borderColor: '#374151', color: '#fff'}} />
                <Area type="monotone" dataKey="total" stroke="#3B82F6" strokeWidth={3} fillOpacity={1} fill="url(#colorTotal)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
};

export default Earnings;
