import express from 'express';
import {
  getTukTuks,
  getTukTukById,
  createTukTuk,
  updateTukTuk,
  deleteTukTuk
} from '../controllers/tukTukController.js';
import { protect, authorize } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/', protect, getTukTuks);
router.get('/:id', protect, getTukTukById);
router.post('/', protect, authorize('hq_admin', 'provincial_admin'), createTukTuk);
router.put('/:id', protect, authorize('hq_admin', 'provincial_admin'), updateTukTuk);
router.delete('/:id', protect, authorize('hq_admin'), deleteTukTuk);

export default router;