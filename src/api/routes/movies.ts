import express from "express";

const router = express.Router();

import { getAllMovies, getMovieById } from "../controllers/movie-controller";

router.get("/", getAllMovies)
router.get("/:id", getMovieById)

export default router;