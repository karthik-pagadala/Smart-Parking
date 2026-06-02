import nodemailer from 'nodemailer';

const sendEmail = async ({ to, subject, html }) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `Smart Parking <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`Email sent: ${info.response}`);
    return true;
  } catch (error) {
    console.error(`Email Error: ${error.message}`);
    return false;
  }
};

export const sendOTPVerificationEmail = async (email, otp) => {
  const subject = 'Verify your Smart Parking account';
  const html = `
    <h1>Email Verification</h1>
    <p>Your OTP for verifying your account is:</p>
    <h2 style="color: #3B82F6; letter-spacing: 2px;">${otp}</h2>
    <p>This OTP is valid for 10 minutes. Do not share it with anyone.</p>
  `;
  return await sendEmail({ to: email, subject, html });
};

export const sendBookingConfirmationEmail = async (email, bookingDetails) => {
  const subject = 'Booking Confirmed - Smart Parking';
  const html = `
    <h1>Booking Confirmation</h1>
    <p>Your parking spot has been successfully booked!</p>
    <ul>
      <li>Slot: ${bookingDetails.slotNumber}</li>
      <li>Date: ${bookingDetails.date}</li>
      <li>Time: ${bookingDetails.startTime} - ${bookingDetails.endTime}</li>
      <li>Vehicle: ${bookingDetails.vehicleNumber}</li>
    </ul>
    <p>Please show the QR code in the app at the entrance.</p>
  `;
  return await sendEmail({ to: email, subject, html });
};

export default sendEmail;
