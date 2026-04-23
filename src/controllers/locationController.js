import LocationPing from '../models/LocationPing.js';
import TukTuk from '../models/TukTuk.js';

// POST /api/location/:tukTukId/ping
export const sendLocationPing = async (req, res) => {
  try {
    const { latitude, longitude, speed } = req.body;
    const { tukTukId } = req.params;

    const tuktuk = await TukTuk.findById(tukTukId);
    if (!tuktuk) {
      return res.status(404).json({ message: 'TukTuk not found' });
    }

    // Save location ping
    const ping = await LocationPing.create({
      tukTuk: tukTukId,
      latitude, longitude, speed,
    });

    // Update last known location on TukTuk
    await TukTuk.findByIdAndUpdate(tukTukId, {
      lastLocation: { latitude, longitude, timestamp: new Date() },
    });

    res.status(201).json({ message: 'Location ping saved', ping });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/location/:tukTukId/last
export const getLastLocation = async (req, res) => {
  try {
    const tuktuk = await TukTuk.findById(req.params.tukTukId);
    if (!tuktuk) {
      return res.status(404).json({ message: 'TukTuk not found' });
    }
    res.status(200).json(tuktuk.lastLocation);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/location/:tukTukId/history?from=&to=
export const getLocationHistory = async (req, res) => {
  try {
    const { from, to } = req.query;
    const filter = { tukTuk: req.params.tukTukId };

    if (from || to) {
      filter.timestamp = {};
      if (from) filter.timestamp.$gte = new Date(from);
      if (to) filter.timestamp.$lte = new Date(to);
    }

    const history = await LocationPing.find(filter)
      .sort({ timestamp: -1 })
      .limit(500);

    res.status(200).json(history);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};