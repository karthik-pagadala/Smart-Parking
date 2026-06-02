import SlotLock from '../models/SlotLock.js';

// @desc    Lock a slot temporarily
// @route   POST /api/slots/lock
export const lockSlot = async (req, res) => {
  try {
    const { parkingId, slotNumber } = req.body;

    // Check if it's already locked by someone else
    const existingLock = await SlotLock.findOne({ parkingId, slotNumber });
    if (existingLock && existingLock.userId.toString() !== req.user._id.toString()) {
      return res.status(400).json({ message: 'Slot is already locked by another user' });
    }

    // Set lock expiration to 5 minutes from now
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    let lock = await SlotLock.findOne({ userId: req.user._id, parkingId, slotNumber });
    if (lock) {
      lock.expiresAt = expiresAt;
      await lock.save();
    } else {
      lock = await SlotLock.create({
        userId: req.user._id,
        parkingId,
        slotNumber,
        expiresAt
      });
    }

    res.json({ message: 'Slot locked successfully', lock });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Release a slot lock manually
// @route   POST /api/slots/release
export const releaseSlot = async (req, res) => {
  try {
    const { parkingId, slotNumber } = req.body;

    await SlotLock.findOneAndDelete({ userId: req.user._id, parkingId, slotNumber });

    res.json({ message: 'Slot lock released' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get status of a specific slot (locked or not)
// @route   GET /api/slots/status/:parkingId/:slotNumber
export const getSlotStatus = async (req, res) => {
  try {
    const { parkingId, slotNumber } = req.params;

    const lock = await SlotLock.findOne({ parkingId, slotNumber });
    
    if (lock) {
      res.json({ 
        isLocked: true, 
        lockedByMe: req.user && lock.userId.toString() === req.user._id.toString(),
        expiresAt: lock.expiresAt 
      });
    } else {
      res.json({ isLocked: false });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
