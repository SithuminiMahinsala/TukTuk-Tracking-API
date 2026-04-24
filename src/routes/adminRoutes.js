import express from 'express';
import {
  getProvinces, createProvince,
  getDistricts, createDistrict,
  getPoliceStations, createPoliceStation,
  getUsers
} from '../controllers/adminController.js';
import { protect, authorize } from '../middlewares/authMiddleware.js';

const router = express.Router();

/**
 * @swagger
 * /api/admin/provinces:
 *   get:
 *     summary: Get all provinces
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all 9 provinces
 *   post:
 *     summary: Create a new province
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               code:
 *                 type: string
 *     responses:
 *       201:
 *         description: Province created
 */
router.get('/provinces', protect, getProvinces);
router.post('/provinces', protect, authorize('hq_admin'), createProvince);

/**
 * @swagger
 * /api/admin/districts:
 *   get:
 *     summary: Get all districts
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: province
 *         schema:
 *           type: string
 *         description: Filter by province ID
 *     responses:
 *       200:
 *         description: List of districts
 */
router.get('/districts', protect, getDistricts);
router.post('/districts', protect, authorize('hq_admin'), createDistrict);

/**
 * @swagger
 * /api/admin/stations:
 *   get:
 *     summary: Get all police stations
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: province
 *         schema:
 *           type: string
 *         description: Filter by province ID
 *       - in: query
 *         name: district
 *         schema:
 *           type: string
 *         description: Filter by district ID
 *     responses:
 *       200:
 *         description: List of police stations
 */
router.get('/stations', protect, getPoliceStations);
router.post('/stations', protect, authorize('hq_admin'), createPoliceStation);

/**
 * @swagger
 * /api/admin/users:
 *   get:
 *     summary: Get all users
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all users
 */
router.get('/users', protect, authorize('hq_admin'), getUsers);

export default router;