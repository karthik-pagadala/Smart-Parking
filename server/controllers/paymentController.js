import Razorpay from 'razorpay';
import crypto from 'crypto';
import Booking from '../models/Booking.js';

// @desc    Create Razorpay order
// @route   POST /api/payment/create-order
export const createOrder = async (req, res) => {
  try {
    const { bookingId } = req.body;
    
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (booking.status !== 'approved') {
      return res.status(400).json({ message: 'Booking must be approved before payment' });
    }

    const instance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const options = {
      amount: booking.totalPrice * 100, // amount in smallest currency unit (paise for INR)
      currency: "INR",
      receipt: `receipt_${bookingId}`,
    };

    const order = await instance.orders.create(options);
    
    // Save order id to booking
    booking.razorpayOrderId = order.id;
    await booking.save();

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Verify Razorpay payment
// @route   POST /api/payment/verify
export const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, bookingId } = req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    if (expectedSignature === razorpay_signature) {
      const booking = await Booking.findById(bookingId);
      if (booking) {
        booking.paymentStatus = 'Paid';
        booking.razorpayPaymentId = razorpay_payment_id;
        await booking.save();
        
        res.json({ success: true, message: "Payment verified successfully" });
      } else {
        res.status(404).json({ success: false, message: "Booking not found" });
      }
    } else {
      res.status(400).json({ success: false, message: "Invalid signature" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
