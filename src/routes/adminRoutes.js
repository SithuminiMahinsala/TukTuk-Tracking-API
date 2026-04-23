import express from 'express';
import {
  getProvinces, createProvince,
  getDistricts, createDistrict,
  getPoliceStations, createPoliceStation,
  getUsers
} from '../controllers/adminController.js';
import { protect, authorize } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Province routes
router.get('/provinces', protect, getProvinces);
router.post('/provinces', protect, authorize('hq_admin'), createProvince);

// District routes
router.get('/districts', protect, getDistricts);
router.post('/districts', protect, authorize('hq_admin'), createDistrict);

// Police station routes
router.get('/stations', protect, getPoliceStations);
router.post('/stations', protect, authorize('hq_admin'), createPoliceStation);

// User routes
router.get('/users', protect, authorize('hq_admin'), getUsers);

export default router;