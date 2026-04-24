import express from 'express';
import {
  getTukTuks, getTukTukById,
  createTukTuk, updateTukTuk, deleteTukTuk
} from '../controllers/tukTukController.js';
import { protect, authorize } from '../middlewares/authMiddleware.js';

const router = express.Router();

/**
 * @swagger
 * /api/tuktuk:
 *   get:
 *     summary: Get all tuk-tuks with optional filters
 *     tags: [TukTuk]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: province
 *         schema:
 *           type: string
 *       - in: query
 *         name: district
 *         schema:
 *           type: string
 *       - in: query
 *         name: policeStation
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of tuk-tuks
 *   post:
 *     summary: Register a new tuk-tuk
 *     tags: [TukTuk]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: TukTuk created
 */
router.get('/', protect, getTukTuks);
router.post('/', protect, authorize('hq_admin', 'provincial_admin'), createTukTuk);

/**
 * @swagger
 * /api/tuktuk/{id}:
 *   get:
 *     summary: Get a single tuk-tuk by ID
 *     tags: [TukTuk]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: TukTuk details
 *       404:
 *         description: TukTuk not found
 *   put:
 *     summary: Update a tuk-tuk
 *     tags: [TukTuk]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: TukTuk updated
 *   delete:
 *     summary: Delete a tuk-tuk
 *     tags: [TukTuk]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: TukTuk deleted
 */
router.get('/:id', protect, getTukTukById);
router.put('/:id', protect, authorize('hq_admin', 'provincial_admin'), updateTukTuk);
router.delete('/:id', protect, authorize('hq_admin'), deleteTukTuk);

export default router;