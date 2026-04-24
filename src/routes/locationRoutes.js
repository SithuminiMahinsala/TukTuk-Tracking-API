import express from 'express';
import {
  sendLocationPing,
  getLastLocation,
  getLocationHistory
} from '../controllers/locationController.js';
import { protect, authorize } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/:tukTukId/ping', protect, authorize('device', 'hq_admin'), sendLocationPing);
router.get('/:tukTukId/last', protect, getLastLocation);
router.get('/:tukTukId/history', protect, getLocationHistory);

export default router;