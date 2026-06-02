import Parking from '../models/Parking.js';

// @desc    Get all parkings
// @route   GET /api/parking/all
export const getAllParkings = async (req, res) => {
  try {
    const { cheapest, highestRated, lat, lng, radius = 10 } = req.query;

    let parkings = await Parking.find({}).lean();

    // Filter by location if lat/lng provided
    if (lat && lng) {
      const userLat = parseFloat(lat);
      const userLng = parseFloat(lng);
      const radiusKm = parseFloat(radius);

      const toRad = (value) => (value * Math.PI) / 180;

      parkings = parkings
        .map(p => {
          // Skip parkings without valid coordinates
          if (!p.location?.lat || !p.location?.lng) return null;

          const R = 6371; // Earth radius in km
          const dLat = toRad(p.location.lat - userLat);
          const dLng = toRad(p.location.lng - userLng);
          const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(toRad(userLat)) *
            Math.cos(toRad(p.location.lat)) *
            Math.sin(dLng / 2) * Math.sin(dLng / 2);
          const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
          const distance = R * c;

          return { ...p, distance };
        })
        .filter(p => p !== null && p.distance <= radiusKm)
        .sort((a, b) => a.distance - b.distance);
    }

    // Apply sorting filters after location filter
    if (highestRated === 'true') {
      parkings.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    }
    if (cheapest === 'true') {
      parkings.sort((a, b) => (a.pricing?.car || 0) - (b.pricing?.car || 0));
    }

    res.json(parkings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get parking by ID
// @route   GET /api/parking/:id
export const getParkingById = async (req, res) => {
  try {
    const parking = await Parking.findById(req.params.id).populate(
      'adminId',
      'name businessName email phone'
    );
    if (parking) {
      res.json(parking);
    } else {
      res.status(404).json({ message: 'Parking not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add new parking (Admin only)
// @route   POST /api/parking/add
export const addParking = async (req, res) => {
  try {
    const {
      name,
      address,
      lat,
      lng,
      totalSlots,
      carPrice,
      bikePrice,
      heavyPrice,
      openTime,
      closeTime,
      hasEVCharging
    } = req.body;

    // Process uploaded images
    const images = req.files ? req.files.map(file => file.path) : [];

    const parking = new Parking({
      adminId: req.user._id,
      name,
      address,
      location: { lat: Number(lat), lng: Number(lng) },
      images,
      totalSlots: Number(totalSlots),
      activeSlots: Number(totalSlots),
      pricing: {
        car: Number(carPrice),
        bike: Number(bikePrice),
        heavy: Number(heavyPrice)
      },
      timings: {
        open: openTime,
        close: closeTime
      },
      hasEVCharging: hasEVCharging === 'true'
    });

    const createdParking = await parking.save();
    res.status(201).json(createdParking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update parking
// @route   PUT /api/parking/:id
export const updateParking = async (req, res) => {
  try {
    const parking = await Parking.findById(req.params.id);

    if (!parking) {
      return res.status(404).json({ message: 'Parking not found' });
    }

    if (parking.adminId.toString() !== req.user._id.toString()) {
      return res.status(401).json({
        message: 'Not authorized to update this parking'
      });
    }

    const { name, activeSlots } = req.body;
    if (name) parking.name = name;
    if (activeSlots !== undefined) parking.activeSlots = Number(activeSlots);

    const updatedParking = await parking.save();
    res.json(updatedParking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete parking
// @route   DELETE /api/parking/:id
export const deleteParking = async (req, res) => {
  try {
    const parking = await Parking.findById(req.params.id);

    if (!parking) {
      return res.status(404).json({ message: 'Parking not found' });
    }

    if (
      parking.adminId.toString() !== req.user._id.toString() &&
      req.user.role !== 'superadmin'
    ) {
      return res.status(401).json({
        message: 'Not authorized to delete this parking'
      });
    }

    await parking.deleteOne();
    res.json({ message: 'Parking removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get nearby parkings
// @route   GET /api/parking/nearby
export const getNearbyParkings = async (req, res) => {
  try {
    const { lat, lng, radius = 5 } = req.query;

    const latDiff = Number(radius) / 111;
    const lngDiff =
      Number(radius) /
      (111 * Math.cos(Number(lat) * (Math.PI / 180)));

    const minLat = Number(lat) - latDiff;
    const maxLat = Number(lat) + latDiff;
    const minLng = Number(lng) - lngDiff;
    const maxLng = Number(lng) + lngDiff;

    const parkings = await Parking.find({
      'location.lat': { $gte: minLat, $lte: maxLat },
      'location.lng': { $gte: minLng, $lte: maxLng }
    });

    res.json(parkings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};