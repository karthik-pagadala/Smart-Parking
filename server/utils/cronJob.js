import cron from 'node-cron';
import Booking from '../models/Booking.js';
import sendEmail from './emailService.js';

export const startCronJobs = () => {
  // Run every 5 minutes
  cron.schedule('*/5 * * * *', async () => {
    try {
      console.log('Running 30-min booking reminder cron job...');
      
      const now = new Date();
      // Calculate time 30 mins from now
      const in30Mins = new Date(now.getTime() + 30 * 60000);
      
      // Find bookings that are 'Paid' and start within the next 30-35 mins
      // Since date and startTime are separate, we need to compare carefully.
      // For simplicity in this demo, we'll assume bookings starting soon on the same day.
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const bookings = await Booking.find({
        status: { $in: ['approved', 'Paid'] },
        date: { $gte: today }
      }).populate('userId', 'email name');

      for (let booking of bookings) {
        // Parse start time (e.g., "14:30")
        const [hours, minutes] = booking.startTime.split(':').map(Number);
        
        const bookingDateTime = new Date(booking.date);
        bookingDateTime.setHours(hours, minutes, 0, 0);

        const timeDiffMins = (bookingDateTime.getTime() - now.getTime()) / 60000;

        // If booking is between 25 and 30 mins away, send email
        if (timeDiffMins > 25 && timeDiffMins <= 30) {
          const subject = 'Your Parking Slot starts in 30 minutes!';
          const html = `
            <h1>Hello ${booking.userId.name},</h1>
            <p>This is a reminder that your parking slot <strong>${booking.slotNumber}</strong> is reserved starting at <strong>${booking.startTime}</strong>.</p>
            <p>Please make sure to arrive on time and have your QR code ready for scanning.</p>
          `;
          await sendEmail({ to: booking.userId.email, subject, html });
          console.log(`Reminder sent to ${booking.userId.email}`);
        }
      }
    } catch (error) {
      console.error('Cron Job Error:', error);
    }
  });
};
