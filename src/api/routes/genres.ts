import express from "express";

import { getAllGenres, addGenre, deleteGenre } from "../controllers/genre-controller";

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
router.post('/', addGenre);
/**
 * @openapi
 * /api/v1/genres/{id}:
 *   delete:
 *     tags:
 *       - Genres
 *     summary: returns all known genres in the DB
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The movie ID
 *         default: 1071097f-a288-43e8-9539-c6f40ee11c6f
 *     responses:
 *       204:
 *         description: genre has been deleted
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 genres:
 *       404:
 *         description: no genre with provided ID was found
 *       500:
 *         description: something went wrong
 */
router.delete('/:id', deleteGenre)

export default router;