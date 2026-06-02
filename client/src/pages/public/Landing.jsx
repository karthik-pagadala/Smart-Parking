import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Car, MapPin, Clock, ShieldCheck, Zap, ChevronRight } from 'lucide-react';

const Landing = () => {
  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  const staggerChildren = {
    animate: { transition: { staggerChildren: 0.2 } }
  };

  return (
    <div className="min-h-screen bg-[#0A0F2C] text-white overflow-hidden selection:bg-blue-500/30">
      
      {/* Navbar */}
      <nav className="container mx-auto px-6 py-6 flex justify-between items-center relative z-10">
        <div className="flex items-center space-x-2">
          <div className="bg-blue-500 p-2 rounded-lg">
            <Car className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-bold tracking-wider">SMART<span className="text-blue-500">PARK</span></span>
        </div>
        <div className="hidden md:flex space-x-8 text-sm font-medium text-gray-300">
          <a href="#features" className="hover:text-white transition-colors">Features</a>
          <a href="#how-it-works" className="hover:text-white transition-colors">How it works</a>
          <a href="#for-business" className="hover:text-white transition-colors">For Business</a>
        </div>
        <div className="flex space-x-4">
          <Link to="/login" className="px-5 py-2 text-sm font-medium hover:text-blue-400 transition-colors">Log In</Link>
          <Link to="/signup" className="px-5 py-2 text-sm font-medium bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-lg shadow-blue-500/30">Sign Up</Link>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative pt-20 pb-32 lg:pt-32 lg:pb-48 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-blue-600/20 blur-[120px] rounded-full pointer-events-none"></div>
        <div className="absolute bottom-0 right-0 w-[500px] h-[400px] bg-purple-600/10 blur-[100px] rounded-full pointer-events-none"></div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="flex flex-col lg:flex-row items-center">
            
            <motion.div 
              className="lg:w-1/2 text-center lg:text-left mb-16 lg:mb-0"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-flex items-center space-x-2 bg-gray-800/50 rounded-full px-4 py-2 mb-6 border border-gray-700 backdrop-blur-sm">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                <span className="text-xs font-medium text-gray-300">Live slot tracking available in your city</span>
              </div>
              <h1 className="text-5xl lg:text-7xl font-extrabold leading-tight mb-6">
                Find Parking in <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">Seconds.</span>
              </h1>
              <p className="text-lg text-gray-400 mb-10 max-w-xl mx-auto lg:mx-0">
                Stop circling the block. Reserve guaranteed parking spots instantly, unlock with a QR code, and pay seamlessly.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start space-y-4 sm:space-y-0 sm:space-x-4">
                <Link to="/signup" className="w-full sm:w-auto px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all shadow-[0_0_20px_rgba(59,130,246,0.4)] hover:shadow-[0_0_30px_rgba(59,130,246,0.6)] flex items-center justify-center group">
                  Find a Spot Now <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link to="/admin/login" className="w-full sm:w-auto px-8 py-4 bg-gray-800 hover:bg-gray-700 text-white font-bold rounded-xl transition-all border border-gray-700 hover:border-gray-600 text-center">
                  List Your Space
                </Link>
              </div>
            </motion.div>

            <motion.div 
              className="lg:w-1/2 relative"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className="relative w-full max-w-lg mx-auto">
                <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/20 to-purple-500/20 rounded-3xl transform rotate-3 blur-xl"></div>
                <img 
                  src="https://images.unsplash.com/photo-1573348722427-f1d6819fdf98?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                  alt="Modern Parking App" 
                  className="rounded-3xl shadow-2xl relative z-10 border border-gray-800 object-cover h-[400px] w-full"
                />
                
                {/* Floating Elements */}
                <motion.div 
                  animate={{ y: [0, -10, 0] }}
                  transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                  className="absolute -bottom-6 -left-6 bg-gray-900 border border-gray-700 p-4 rounded-2xl shadow-xl z-20 flex items-center space-x-4 backdrop-blur-md"
                >
                  <div className="bg-green-500/20 p-3 rounded-xl"><Check className="w-6 h-6 text-green-500" /></div>
                  <div>
                    <p className="text-sm font-bold text-white">Slot A-12 Locked</p>
                    <p className="text-xs text-gray-400">Guaranteed for 5 mins</p>
                  </div>
                </motion.div>

                <motion.div 
                  animate={{ y: [0, 10, 0] }}
                  transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
                  className="absolute -top-6 -right-6 bg-gray-900 border border-gray-700 p-4 rounded-2xl shadow-xl z-20 flex items-center space-x-3 backdrop-blur-md"
                >
                  <div className="bg-blue-500/20 p-2 rounded-lg"><MapPin className="w-5 h-5 text-blue-500" /></div>
                  <p className="text-sm font-bold text-white">2.4 km away</p>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Features */}
      <div id="features" className="py-24 bg-gray-900/50 border-t border-gray-800">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">Why choose SmartPark?</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">We eliminate the stress of parking with cutting-edge technology and real-time data.</p>
          </div>

          <motion.div 
            variants={staggerChildren}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {[
              { icon: Zap, title: "Real-time Availability", desc: "Our live grid system updates instantly via WebSockets, ensuring the slot you see is the slot you get." },
              { icon: ShieldCheck, title: "Secure Payments", desc: "Integrated with Razorpay for safe, fast, and secure transactions. Pay only for what you use." },
              { icon: Clock, title: "Smart Locking", desc: "Temporarily lock a slot for 5 minutes while you complete your booking. No more double bookings." }
            ].map((feature, i) => (
              <motion.div variants={fadeIn} key={i} className="bg-gray-900 border border-gray-800 p-8 rounded-2xl hover:border-blue-500/50 transition-colors group">
                <div className="bg-blue-500/10 w-14 h-14 rounded-xl flex items-center justify-center mb-6 group-hover:bg-blue-500/20 transition-colors">
                  <feature.icon className="w-7 h-7 text-blue-500" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                <p className="text-gray-400 leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-800 py-12 bg-gray-900">
        <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            <Car className="w-6 h-6 text-blue-500" />
            <span className="text-xl font-bold tracking-wider">SMART<span className="text-blue-500">PARK</span></span>
          </div>
          <p className="text-gray-500 text-sm">© 2026 SmartPark Inc. Built for Hackathons & Production.</p>
        </div>
      </footer>
    </div>
  );
};

// Quick mock for Check icon since it wasn't imported at the top
const Check = ({className}) => <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>;

export default Landing;
