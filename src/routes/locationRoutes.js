import express from 'express';
import {
  sendLocationPing, getLastLocation, getLocationHistory
} from '../controllers/locationController.js';
import { protect, authorize } from '../middlewares/authMiddleware.js';

const router = express.Router();

/**
 * @swagger
 * /api/location/{tukTukId}/ping:
 *   post:
 *     summary: Send a GPS location ping from a tuk-tuk device
 *     tags: [Location]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: tukTukId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               latitude:
 *                 type: number
 *               longitude:
 *                 type: number
 *               speed:
 *                 type: number
 *     responses:
 *       201:
 *         description: Location ping saved
 */
router.post('/:tukTukId/ping', protect, authorize('device', 'hq_admin'), sendLocationPing);

/**
 * @swagger
 * /api/location/{tukTukId}/last:
 *   get:
 *     summary: Get last known location of a tuk-tuk
 *     tags: [Location]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: tukTukId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Last known location
 */
router.get('/:tukTukId/last', protect, getLastLocation);

/**
 * @swagger
 * /api/location/{tukTukId}/history:
 *   get:
 *     summary: Get location history for a tuk-tuk
 *     tags: [Location]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: tukTukId
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: from
 *         schema:
 *           type: string
 *         description: Start date (e.g. 2025-04-01)
 *       - in: query
 *         name: to
 *         schema:
 *           type: string
 *         description: End date (e.g. 2025-04-24)
 *     responses:
 *       200:
 *         description: Location history
 */
router.get('/:tukTukId/history', protect, getLocationHistory);

export default router;