import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { jsPDF } from 'jspdf';
import { History as HistoryIcon, Download, Search } from 'lucide-react';
import toast from 'react-hot-toast';

const History = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const { data } = await api.get('/booking/history');
        setHistory(data);
      } catch (error) {
        toast.error('Failed to load booking history');
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  const generatePDF = (booking) => {
    const doc = new jsPDF();
    
    // Header
    doc.setFillColor(10, 15, 44); // Dark Navy
    doc.rect(0, 0, 210, 40, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.text('SMART PARKING', 20, 25);
    
    // Receipt Details
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(16);
    doc.text('Booking Receipt', 20, 60);
    
    doc.setFontSize(12);
    doc.text(`Booking ID: ${booking._id}`, 20, 80);
    doc.text(`Status: ${booking.status.toUpperCase()}`, 20, 90);
    doc.text(`Payment: ${booking.paymentStatus}`, 20, 100);
    
    doc.text('Location Details:', 20, 120);
    doc.text(`Parking Name: ${booking.parkingId?.name || 'N/A'}`, 30, 130);
    doc.text(`Address: ${booking.parkingId?.address || 'N/A'}`, 30, 140);
    doc.text(`Slot Number: ${booking.slotNumber}`, 30, 150);
    
    doc.text('Booking Details:', 20, 170);
    doc.text(`Date: ${new Date(booking.date).toLocaleDateString()}`, 30, 180);
    doc.text(`Time: ${booking.startTime} - ${booking.endTime}`, 30, 190);
    doc.text(`Vehicle: ${booking.vehicleNumber} (${booking.vehicleType})`, 30, 200);
    
    doc.setFontSize(16);
    doc.text(`Total Paid: INR ${booking.totalPrice}`, 20, 230);
    
    // Footer
    doc.setFontSize(10);
    doc.setTextColor(150, 150, 150);
    doc.text('Thank you for using Smart Parking.', 105, 280, { align: 'center' });

    doc.save(`Receipt_${booking._id}.pdf`);
    toast.success('Receipt downloaded successfully');
  };

  const filteredHistory = history.filter(b => 
    b.parkingId?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.vehicleNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="h-full flex flex-col">
      <header className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Booking History</h1>
          <p className="text-gray-400">View your past transactions and download receipts</p>
        </div>
        
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-500" />
          <input 
            type="text" 
            placeholder="Search history..."
            className="w-full bg-gray-900 border border-gray-800 rounded-lg py-2 pl-10 pr-4 text-white focus:outline-none focus:border-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </header>

      <div className="flex-1 bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden flex flex-col">
        {loading ? (
          <div className="p-8 text-center text-gray-400">Loading history...</div>
        ) : filteredHistory.length === 0 ? (
          <div className="p-16 text-center flex flex-col items-center justify-center h-full">
            <HistoryIcon className="w-16 h-16 text-gray-800 mb-4" />
            <h3 className="text-xl font-bold text-gray-400 mb-2">No history found</h3>
            <p className="text-gray-600">Your past bookings will appear here.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-400">
              <thead className="text-xs text-gray-500 uppercase bg-gray-800/50">
                <tr>
                  <th className="px-6 py-4 font-medium">Date</th>
                  <th className="px-6 py-4 font-medium">Location & Slot</th>
                  <th className="px-6 py-4 font-medium">Vehicle</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium">Amount</th>
                  <th className="px-6 py-4 font-medium text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredHistory.map((booking) => (
                  <tr key={booking._id} className="border-b border-gray-800 hover:bg-gray-800/20 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-white font-medium">{new Date(booking.date).toLocaleDateString()}</div>
                      <div className="text-xs">{booking.startTime} - {booking.endTime}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-white font-medium">{booking.parkingId?.name}</div>
                      <div className="text-xs">Slot {booking.slotNumber}</div>
                    </td>
                    <td className="px-6 py-4 uppercase">
                      {booking.vehicleNumber}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                        booking.status === 'completed' ? 'bg-blue-500/20 text-blue-500' :
                        booking.status === 'cancelled' ? 'bg-gray-500/20 text-gray-400' :
                        'bg-red-500/20 text-red-500'
                      }`}>
                        {booking.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-white font-medium">
                      ₹{booking.totalPrice}
                    </td>
                    <td className="px-6 py-4 text-right">
                      {booking.status === 'completed' && booking.paymentStatus === 'Paid' && (
                        <button 
                          onClick={() => generatePDF(booking)}
                          className="text-blue-500 hover:text-blue-400 p-2 hover:bg-blue-500/10 rounded-lg transition-colors inline-flex items-center"
                          title="Download Receipt"
                        >
                          <Download className="w-5 h-5" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default History;
