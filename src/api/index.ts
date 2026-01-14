import express from "express";

import type MessageResponse from "../interfaces/message-response.js";

import movies from "./routes/movies";

const router = express.Router();

router.use("/movies", movies);

router.get<object, MessageResponse>("/", (req, res) => {
  res.json({
    message: "API - 👋🌎🌍🌏",
  });
});


export default router;
