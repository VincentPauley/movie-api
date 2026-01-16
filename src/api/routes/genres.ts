import express from "express";

import { getAllGenres, addGenre } from "../controllers/genre-controller";

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
/**
 * @openapi
 * /api/v1/genres:
 *   post:
 *     tags:
 *       - Genres
 *     summary: add a new genre to the database
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - genre_name
 *               - genre_level
 *             properties:
 *               genre_name:
 *                 type: string
 *                 default: test_genre
 *               genre_level:
 *                 type: number
 *                 default: 1
 *     responses:
 *       200:
 *         description: Genre successfully added
 *       400:
 *         description: Invalid request body
 */
router.post('/', addGenre)

export default router;