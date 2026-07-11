import React, { useState, useEffect } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import {
  DollarSign,
  Download,
  Calendar,
  TrendingUp,
  Wallet,
} from "lucide-react";

import { motion } from "framer-motion";

const Earnings = () => {
  const [timeRange, setTimeRange] = useState("monthly");
  const [loading, setLoading] = useState(true);

  const earningsData = [
    { name: "Jan", total: 45000 },
    { name: "Feb", total: 52000 },
    { name: "Mar", total: 48000 },
    { name: "Apr", total: 61000 },
    { name: "May", total: 59000 },
    { name: "Jun", total: 75000 },
  ];

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, [timeRange]);

  const cards = [
    {
      title: "Total Earnings",
      value: "₹3,40,000",
      icon: TrendingUp,
      color: "from-cyan-500 to-blue-600",
      sub: "+24% Growth",
    },
    {
      title: "This Month",
      value: "₹75,000",
      icon: DollarSign,
      color: "from-purple-500 to-pink-500",
      sub: "Highest Revenue",
    },
    {
      title: "Pending Payout",
      value: "₹12,400",
      icon: Wallet,
      color: "from-amber-400 to-orange-500",
      sub: "Next Settlement",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-black p-8 rounded-3xl">

      {/* Header */}

      <div className="flex flex-col md:flex-row justify-between items-center mb-8">

        <div>

          <h1 className="text-4xl font-bold text-white">
            Earnings Dashboard
          </h1>

          <p className="text-slate-400 mt-2">
            Track your revenue and financial analytics.
          </p>

        </div>

        <button className="mt-5 md:mt-0 flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:scale-105 duration-300 shadow-lg shadow-cyan-500/20 text-white font-semibold">

          <Download size={18} />

          Export Report

        </button>

      </div>

      {/* Cards */}

      <div className="grid lg:grid-cols-3 gap-6">

        {cards.map((card, index) => {

          const Icon = card.icon;

          return (

            <motion.div

              key={index}

              initial={{ opacity: 0, y: 25 }}

              animate={{ opacity: 1, y: 0 }}

              transition={{ delay: index * 0.15 }}

              whileHover={{ y: -8 }}

              className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl overflow-hidden shadow-2xl"

            >

              <div
                className={`h-2 bg-gradient-to-r ${card.color}`}
              ></div>

              <div className="p-7">

                <div className="flex justify-between">

                  <div>

                    <p className="text-slate-400">{card.title}</p>

                    <h2 className="text-4xl font-bold text-white mt-2">
                      {card.value}
                    </h2>

                    <p className="text-emerald-400 mt-4">{card.sub}</p>

                  </div>

                  <div
                    className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${card.color} flex items-center justify-center`}
                  >

                    <Icon className="text-white" size={30} />

                  </div>

                </div>

              </div>

            </motion.div>

          );

        })}

      </div>

      {/* Chart */}

      <motion.div

        initial={{ opacity: 0 }}

        animate={{ opacity: 1 }}

        transition={{ delay: .4 }}

        className="mt-8 backdrop-blur-xl bg-white/5 rounded-3xl border border-white/10 shadow-2xl p-8"

      >

        <div className="flex justify-between items-center mb-8">

          <div>

            <h2 className="text-2xl font-bold text-white">

              Revenue Analytics

            </h2>

            <p className="text-slate-400">

              Monthly Revenue Performance

            </p>

          </div>

          <div className="flex bg-slate-900 rounded-xl p-1">

            {["weekly", "monthly", "yearly"].map((range) => (

              <button

                key={range}

                onClick={() => setTimeRange(range)}

                className={`px-5 py-2 rounded-lg transition-all capitalize font-medium ${
                  timeRange === range
                    ? "bg-gradient-to-r from-cyan-500 to-indigo-600 text-white"
                    : "text-slate-400 hover:text-white"
                }`}

              >

                {range}

              </button>

            ))}

          </div>

        </div>

        {loading ? (

          <div className="h-[420px] flex items-center justify-center">

            <div className="w-14 h-14 rounded-full border-4 border-cyan-500 border-t-transparent animate-spin"></div>

          </div>

        ) : (

          <div className="h-[420px]">

            <ResponsiveContainer>

              <AreaChart data={earningsData}>

                <defs>

                  <linearGradient id="color1" x1="0" y1="0" x2="0" y2="1">

                    <stop
                      offset="0%"
                      stopColor="#06b6d4"
                      stopOpacity={0.8}
                    />

                    <stop
                      offset="100%"
                      stopColor="#06b6d4"
                      stopOpacity={0}
                    />

                  </linearGradient>

                </defs>

                <CartesianGrid
                  stroke="#334155"
                  strokeDasharray="3 3"
                />

                <XAxis
                  dataKey="name"
                  stroke="#94a3b8"
                />

                <YAxis
                  stroke="#94a3b8"
                />

                <Tooltip
                  contentStyle={{
                    background: "#0f172a",
                    borderRadius: "15px",
                    border: "1px solid #334155",
                    color: "#fff",
                  }}
                />

                <Area
                  type="monotone"
                  dataKey="total"
                  stroke="#06b6d4"
                  strokeWidth={4}
                  fill="url(#color1)"
                />

              </AreaChart>

            </ResponsiveContainer>

          </div>

        )}

      </motion.div>

    </div>
  );
};
export default Earnings;