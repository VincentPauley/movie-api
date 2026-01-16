import { Request, Response } from 'express';
import { RowDataPacket } from 'mysql2/promise';

import db from '../../db'

interface Movie extends RowDataPacket {
  id: string;
  title: string;
  year: number;
  rated: string;
}

interface MovieWithGenre extends RowDataPacket {
  id: string;
  title: string;
  year: number;
  rated: string;
  genre_id: string;
  genre_name: string;
  genre_level: number;
}

export const getAllMovies = async (req: Request, res: Response) => {
  try {
    const [rows] = await db.query<Movie[]>('SELECT * FROM movies');
    res
      .status(200)
      .json({ movies: rows });
  } catch (e) {
    const error = e as Error;
    console.error(error.message)
    res
      .status(500)
      .json({ message: 'Failed to fetch movies' })
  }
}

export const getMovieById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params

    const [rows] = await db.query<MovieWithGenre[]>(`
      SELECT
        *
      FROM
        movies m
      INNER JOIN movie_genres mg ON m.id = mg.movie_id
      INNER JOIN genres g on g.id = mg.genre_id
      WHERE m.id = ?`,
      [id]
    );

    if (rows.length < 1) {
      return res.status(404).json({ message: 'no movie with that id' })
    }

    interface GenreRecord {
      genre_id: string;
      genre_name: string;
      genre_level: number;
    }

    interface movieFullRecord {
      id: string;
      title: string;
      year: number;
      rated: string;
      genres: GenreRecord[]
    }

    const movieFullRecord: movieFullRecord = {
      id: 'N/A',
      title: 'N/A',
      year: 0,
      rated: 'EMPTY',
      genres: []
    }

    rows.forEach((row, index) => {
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