import { Request, Response } from 'express';

export const getAllMovies = (req: Request, res: Response) => {
  res.json({
    movies: [
      { id: 1, title: 'Inception', director: 'Christopher Nolan' },
      { id: 2, title: 'The Matrix', director: 'The Wachowskis' },
      { id: 3, title: 'Interstellar', director: 'Christopher Nolan' },
    ],
  });
}

export const getMovieById = (req: Request, res: Response) => {
  res.json({
    movies: [
      { id: 4, title: 'Benny & Joon', director: 'Not Sure' },
    ],
  });
}