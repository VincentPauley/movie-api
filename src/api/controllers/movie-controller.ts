import { Request, Response } from 'express';
import { RowDataPacket } from 'mysql2/promise';
import { z } from 'zod';

import db from '@/db'

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

interface MovieSearchId extends RowDataPacket {
  id: string;
}

const movieSearchSchema = z.object({
  genres: z.string().optional().transform(val => val?.split(','))
})

// search should look only for the movies ids themeselve and then supply a list to another query for full lookup of the movie

export const searchMovies = async (req: Request, res: Response) => {
  try {

    const params = movieSearchSchema.parse(req.query)

    const clauses: string[] = []

    const query_args: string[] = [];

    if (params.genres?.length) {
      const genre_match_cases: string[] = []

      params.genres?.forEach(genre => {
        genre_match_cases.push(`mg.genre_id = ?`)
        query_args.push(genre)
      })

      const full_cases = genre_match_cases.join(' OR ')

      clauses.push(full_cases) 
    }

    const queryTemplate = 'SELECT DISTINCT m.id FROM movies m JOIN movie_genres mg ON mg.movie_id = m.id WHERE'  

    const full_query = `${queryTemplate} ${clauses.join(' ')}`

    const [rows] = await db.query<MovieSearchId[]>(full_query, query_args)

    const matchingIds = rows.map(row => row.id)

    const full_results = await getMoviesByIds(matchingIds)

    res.status(200).json({ message: 'matching movie ids.', full_results })
  } catch (e) {
    const error = e as Error;
      console.error(error.message)
      res
        .status(500)
        .json({ message: 'movie search failure' })
  }
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

export const getMoviesByIds = async (movieIds: string[]): Promise<any[]> => {
  if (movieIds.length === 0) {
    return [];
  }

  const placeholders = movieIds.map(() => '?').join(',');
  
  const [rows] = await db.query<MovieWithGenre[]>(`
    SELECT
      m.id,
      m.title,
      m.year,
      m.rated,
      mg.genre_id,
      g.genre_name,
      g.genre_level
    FROM
      movies m
    INNER JOIN movie_genres mg ON m.id = mg.movie_id
    INNER JOIN genres g ON g.id = mg.genre_id
    WHERE m.id IN (${placeholders})
    ORDER BY m.id, g.genre_level`,
    movieIds
  );

  // Group results by movie ID
  const moviesMap = new Map<string, any>();

  rows.forEach(row => {
    if (!moviesMap.has(row.id)) {
      moviesMap.set(row.id, {
        id: row.id,
        title: row.title,
        year: row.year,
        rated: row.rated,
        genres: []
      });
    }

    moviesMap.get(row.id)!.genres.push({
      genre_id: row.genre_id,
      genre_name: row.genre_name,
      genre_level: row.genre_level
    });
  });

  return Array.from(moviesMap.values());
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