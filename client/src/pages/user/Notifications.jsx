import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Bell, Check, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    try {
      const { data } = await api.get('/notifications');
      setNotifications(data);
    } catch (error) {
      toast.error('Failed to load notifications');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
    // In a full implementation, you would also listen to socket events here
    // socket.on('new_notification', (newNotif) => setNotifications(prev => [newNotif, ...prev]));
  }, []);

  const markAsRead = async (id) => {
    try {
      await api.put(`/notifications/${id}/read`);
      setNotifications(notifications.map(n => n._id === id ? { ...n, isRead: true } : n));
    } catch (error) {
      toast.error('Failed to update notification');
    }
  };

  const markAllAsRead = async () => {
    try {
      await api.put('/notifications/read-all');
      setNotifications(notifications.map(n => ({ ...n, isRead: true })));
      toast.success('All marked as read');
    } catch (error) {
      toast.error('Failed to update notifications');
    }
  };

  const deleteNotification = async (id) => {
    try {
      await api.delete(`/notifications/${id}`);
      setNotifications(notifications.filter(n => n._id !== id));
      toast.success('Notification deleted');
    } catch (error) {
      toast.error('Failed to delete notification');
    }
  };

  if (loading) return <div className="p-8 text-white">Loading notifications...</div>;

  return (
    <div className="max-w-4xl mx-auto h-full flex flex-col">
      <header className="mb-6 flex justify-between items-center bg-gray-900 p-6 rounded-2xl border border-gray-800 shadow-sm">
        <div className="flex items-center space-x-4">
          <div className="bg-blue-500/20 p-3 rounded-xl text-blue-500">
            <Bell className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Notifications</h1>
            <p className="text-gray-400 text-sm">Stay updated with your booking status</p>
          </div>
        </div>
        
        {notifications.some(n => !n.isRead) && (
          <button 
            onClick={markAllAsRead}
            className="text-sm font-medium text-blue-500 hover:text-blue-400 transition-colors flex items-center"
          >
            <Check className="w-4 h-4 mr-1" /> Mark all as read
          </button>
        )}
      </header>

      <div className="flex-1 overflow-y-auto space-y-4 pb-10">
        {notifications.length === 0 ? (
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-12 text-center text-gray-400">
            You're all caught up! No new notifications.
          </div>
        ) : (
          notifications.map((notif) => (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              key={notif._id} 
              className={`bg-gray-900 border ${notif.isRead ? 'border-gray-800' : 'border-blue-500/50'} rounded-2xl p-5 flex items-start justify-between transition-colors hover:border-gray-700 relative overflow-hidden`}
            >
              {!notif.isRead && <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500"></div>}
              
              <div className="pl-2">
                <h3 className={`font-bold ${notif.isRead ? 'text-gray-300' : 'text-white'} mb-1`}>{notif.title}</h3>
                <p className="text-gray-400 text-sm">{notif.message}</p>
                <p className="text-gray-500 text-xs mt-3">{new Date(notif.createdAt).toLocaleString()}</p>
              </div>
              
              <div className="flex space-x-2">
                {!notif.isRead && (
                  <button 
                    onClick={() => markAsRead(notif._id)}
                    className="p-2 bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white rounded-lg transition-colors"
                    title="Mark as read"
                  >
                    <Check className="w-4 h-4" />
                  </button>
                )}
                <button 
                  onClick={() => deleteNotification(notif._id)}
                  className="p-2 bg-gray-800 hover:bg-red-500/20 text-gray-400 hover:text-red-400 rounded-lg transition-colors"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};

export default Notifications;
