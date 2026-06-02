import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
    LayoutDashboard, PlusCircle, Settings,
    Bell, User, LogOut, Menu, Car,
    ClipboardList, DollarSign, Layers
} from 'lucide-react';

const AdminLayout = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const navItems = [
        { path: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
        { path: '/admin/add-parking', icon: PlusCircle, label: 'Add Parking' },
        { path: '/admin/manage-slots', icon: Layers, label: 'Manage Slots' },
        { path: '/admin/booking-requests', icon: ClipboardList, label: 'Booking Requests' },
        { path: '/admin/earnings', icon: DollarSign, label: 'Earnings' },
        { path: '/admin/notifications', icon: Bell, label: 'Notifications' },
        { path: '/admin/profile', icon: User, label: 'Profile' },
    ];

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="flex h-screen bg-[#0A0F2C] text-white overflow-hidden">

            {/* Mobile Overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`
        fixed lg:static inset-y-0 left-0 z-30
        w-64 bg-[#0D1333] border-r border-blue-900/30
        transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        flex flex-col
      `}>
                {/* Logo */}
                <div className="flex items-center gap-3 p-6 border-b border-blue-900/30">
                    <div className="w-10 h-10 bg-green-600 rounded-xl flex items-center justify-center">
                        <Car size={20} />
                    </div>
                    <div>
                        <span className="text-xl font-bold text-white">
                            Smart<span className="text-green-400">Park</span>
                        </span>
                        <p className="text-xs text-green-400">Admin Panel</p>
                    </div>
                </div>

                {/* Admin Info */}
                <div className="p-4 border-b border-blue-900/30">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center text-white font-bold">
                            {user?.name?.charAt(0)?.toUpperCase() || 'A'}
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-white">{user?.name || 'Admin'}</p>
                            <p className="text-xs text-green-400">Admin Account</p>
                        </div>
                    </div>
                </div>

                {/* Nav Items */}
                <nav className="flex-1 p-4 space-y-1">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            onClick={() => setSidebarOpen(false)}
                            className={({ isActive }) =>
                                `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${isActive
                                    ? 'bg-green-600 text-white shadow-lg shadow-green-600/20'
                                    : 'text-gray-400 hover:bg-green-900/20 hover:text-white'
                                }`
                            }
                        >
                            <item.icon size={20} />
                            <span className="font-medium">{item.label}</span>
                        </NavLink>
                    ))}
                </nav>

                {/* Logout */}
                <div className="p-4 border-t border-blue-900/30">
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:bg-red-900/20 hover:text-red-400 transition-all duration-200 w-full"
                    >
                        <LogOut size={20} />
                        <span className="font-medium">Logout</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">

                {/* Top Navbar */}
                <header className="bg-[#0D1333] border-b border-blue-900/30 px-6 py-4 flex items-center justify-between">
                    <button
                        onClick={() => setSidebarOpen(true)}
                        className="lg:hidden text-gray-400 hover:text-white"
                    >
                        <Menu size={24} />
                    </button>
                    <div className="flex items-center gap-2">
                        <span className="text-gray-400 text-sm">Admin:</span>
                        <span className="text-white font-semibold">{user?.name || 'Admin'}</span>
                    </div>
                    <NavLink to="/admin/notifications" className="relative text-gray-400 hover:text-white">
                        <Bell size={22} />
                        <span className="absolute -top-1 -right-1 w-4 h-4 bg-green-600 rounded-full text-xs flex items-center justify-center">
                            5
                        </span>
                    </NavLink>
                </header>

                {/* Page Content */}
                <main className="flex-1 overflow-y-auto p-6">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;