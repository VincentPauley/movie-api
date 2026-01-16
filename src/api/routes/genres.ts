import express from "express";

import { getAllGenres } from "../controllers/genre-controller";

const router = express.Router();

/**
 * @openapi
 * /api/v1/genres:
 *   get:
 *     tags:
 *       - Genres
 *     summary: returns all known genres in the DB
 *     responses:
 *       200:
 *         description: will have all the genres
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 genres:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       genre_name:
 *                         type: string
 *                       genre_level:
 *                         type: number
 */
router.get('/', getAllGenres);

export default router;