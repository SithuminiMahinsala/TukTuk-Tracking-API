import TukTuk from '../models/TukTuk.js';

// GET /api/tuktuk
export const getTukTuks = async (req, res) => {
  try {
    const { province, district, policeStation } = req.query;
    const filter = {};
    if (province) filter.province = province;
    if (district) filter.district = district;
    if (policeStation) filter.policeStation = policeStation;

    const tuktuks = await TukTuk.find(filter)
      .populate('province district policeStation');
    res.status(200).json(tuktuks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/tuktuk/:id
export const getTukTukById = async (req, res) => {
  try {
    const tuktuk = await TukTuk.findById(req.params.id)
      .populate('province district policeStation');
    if (!tuktuk) {
      return res.status(404).json({ message: 'TukTuk not found' });
    }
    res.status(200).json(tuktuk);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/tuktuk
export const createTukTuk = async (req, res) => {
  try {
    const tuktuk = await TukTuk.create(req.body);
    res.status(201).json(tuktuk);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PUT /api/tuktuk/:id
export const updateTukTuk = async (req, res) => {
  try {
    const tuktuk = await TukTuk.findByIdAndUpdate(
      req.params.id, req.body, { new: true }
    );
    if (!tuktuk) {
      return res.status(404).json({ message: 'TukTuk not found' });
    }
    res.status(200).json(tuktuk);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE /api/tuktuk/:id
export const deleteTukTuk = async (req, res) => {
  try {
    const tuktuk = await TukTuk.findByIdAndDelete(req.params.id);
    if (!tuktuk) {
      return res.status(404).json({ message: 'TukTuk not found' });
    }
    res.status(200).json({ message: 'TukTuk deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};