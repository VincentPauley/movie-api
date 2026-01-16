import express from "express";

const router = express.Router();

import { getAllMovies, getMovieById } from "../controllers/movie-controller";

/**
 * @openapi
 * /api/v1/movies:
 *  get:
 *    tags:
 *      - Movies
 *    summary: Returns all data from the movies table
 *    responses:
 *      200:
 *        description: list of all movies
 *        content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 movies:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       title:
 *                         type: string
 *                       year:
 *                         type: number
 *                       rated:
 *                         type: string
 */
router.get("/", getAllMovies)

/**
 * @openapi
 * /api/v1/movies/{id}:
 *  get:
 *    tags:
 *      - Movies
 *    summary: returns 1 movie data and includes genre
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        schema:
 *          type: string
 *        description: The movie ID
 *        default: 8b5b0bc7-6fdc-478f-bcc8-2747ba44ff03
 *    responses:
 *      200:
 *        description: movie with genres
 *        content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 movie:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     title:
 *                       type: string
 *                     year:
 *                       type: number
 *                     rated:
 *                       type: string
 *                     genres:
 *                       type: array
 *                       items:
 *                          type: object
 *                          properties:
 *                            genre_id:
 *                                type: string
 *                            genre_name:
 *                                type: string
 *                            genre_level:
 *                                type: number
 */
router.get("/:id", getMovieById)

export default router;