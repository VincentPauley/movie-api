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

export const getMovieById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params

    const [rows] = await pool.query(`
      SELECT
        *
      FROM
        movies m
      INNER JOIN movie_genres mg ON m.id = mg.movie_id
      INNER JOIN genres g on g.id = mg.genre_id
      WHERE m.id = ?`,
      [id]
    );

    if (!Array.isArray(rows)) {
      throw new Error('improper query response')
    }

    if (rows.length < 1) {
      return res.status(404).json({ message: 'no movie with that id' })
    }

    const movieFullRecord: any = {
      id: 'N/A',
      title: 'N/A',
      year: 0,
      rated: 'EMPTY',
      genres: []
    }

    rows.forEach((row: any, index) => {
      if (index === 0) {
        movieFullRecord.id = row.id;
        movieFullRecord.title = row.title;
        movieFullRecord.year = row.year;
        movieFullRecord.rated = row.rated;
      }

      movieFullRecord.genres.push({
        genre_id: row.genre_id,
        genre_name: row.genre_name,
        genre_level: row.genre_level
      })
    })

    res.json({ movie: movieFullRecord })
  } catch (e) {
    console.error(e)
    res.status(500).json({ message: 'Error: getMovieById failed...' })
  }
}