import Province from '../models/Province.js';
import District from '../models/District.js';
import PoliceStation from '../models/PoliceStation.js';
import User from '../models/User.js';

//Provinces
export const getProvinces = async (req, res) => {
  try {
    const provinces = await Province.find();
    res.status(200).json(provinces);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const createProvince = async (req, res) => {
  try {
    const province = await Province.create(req.body);
    res.status(201).json(province);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//Districts
export const getDistricts = async (req, res) => {
  try {
    const { province } = req.query;
    const filter = province ? { province } : {};
    const districts = await District.find(filter).populate('province');
    res.status(200).json(districts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const createDistrict = async (req, res) => {
  try {
    const district = await District.create(req.body);
    res.status(201).json(district);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//Police stations
export const getPoliceStations = async (req, res) => {
  try {
    const { province, district } = req.query;
    const filter = {};
    if (province) filter.province = province;
    if (district) filter.district = district;
    const stations = await PoliceStation.find(filter)
      .populate('province district');
    res.status(200).json(stations);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const createPoliceStation = async (req, res) => {
  try {
    const station = await PoliceStation.create(req.body);
    res.status(201).json(station);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//Users
export const getUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password')
      .populate('province district policeStation');
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};