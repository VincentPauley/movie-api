import { Request, Response } from 'express';
import mysql from 'mysql2/promise';

// TODO: this can be made available globally
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
})

export const getAllMovies = async (req: Request, res: Response) => {
  try {
    const [rows] = await pool.query('SELECT * FROM movies');
    res.json({ movies: rows });
  } catch (e) {
    res.json({ message: e })
  }
}

export const getMovieById = (req: Request, res: Response) => {
  res.json({
    movies: [
      { id: 4, title: 'Benny & Joon', director: 'Not Sure' },
    ],
  });
}