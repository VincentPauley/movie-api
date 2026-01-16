import { Request, Response } from 'express';
import { z } from 'zod'
import db from '@/db'
import logger from '@/config/logger'
import { RowDataPacket, ResultSetHeader } from 'mysql2';

const addGenreSchema = z.object({
    genre_name: z.string().min(1, 'genre_name is a required param'),
    genre_level: z.number().int().min(0).max(4, 'Genre level must be provided')
});

interface Genre extends RowDataPacket {
    id: string;
    genre_name: string;
    genre_level: number;
}

interface GenreJunction extends RowDataPacket {
    movie_id: string;
    genre_id: string;
}

export const getAllGenres = async (req: Request, res: Response) => {
    try {
        const [rows] = await db.query<Genre[]>('SELECT * FROM genres');

        res.json({ total: rows.length, genres: rows });
    } catch (e) {
        const error = e as Error;
        logger.error('Failed to add genre', { error: error.message, stack: error.stack });
        res.status(500).json({ message: 'Failed to add genre' });
    }
}

export const addGenre = async (req: Request, res: Response) => {
    try {
        const validatedData = addGenreSchema.parse(req.body);
        const id = crypto.randomUUID();

        await db.query(
            'INSERT INTO genres (id, genre_name, genre_level) VALUES (?, ?, ?)',
            [id, validatedData.genre_name, validatedData.genre_level]
        );

        logger.info('Genre added: ', { id, ...validatedData });

        res.status(201).json({ 
            message: 'Genre added successfully',
            genre: { id, ...validatedData }
        });
    } catch (e) {
        if (e instanceof z.ZodError) {
            logger.warn('Invalid request body for addGenre', { errors: e.issues });
            return res.status(400).json({ 
                message: 'Invalid request body',
                errors: e.issues
            });
        }
        
        const error = e as Error;
        logger.error('Failed to add genre', { error: error.message, stack: error.stack });
        res.status(500).json({ message: 'Failed to add genre' });
    }
}

export const deleteGenre = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const [rows] = await db.query<Genre[]>('SELECT * FROM genres WHERE id = ?', [id]);

        if (rows.length < 1) {
            return res.status(404).json({ message: `no genre by id: '${id}' exists.` })
        }

        const [movies_with_genre] = await db.query<GenreJunction[]>('SELECT * FROM movie_genres WHERE genre_id = ?', [id])

        if (movies_with_genre.length > 0) {
            return res.status(400).json({message: `cannot currently delete genres that are in use, ${movies_with_genre.length} movies linked.`})
        }

        const [result] = await db.query<ResultSetHeader>('DELETE FROM genres WHERE id = ?', [id]);

        if (result.affectedRows !== 1) {
            throw new Error('expected amount of rows were not affected by delete')
        }

        res.status(204).json({ message: `successfully deleted genre: '${id}'` })
    } catch (e) {
        const error = e as Error;
        logger.error('Failed to delete genre', { error: error.message, stack: error.stack });
        res.status(500).json({ message: 'Failed to delete genre' });
    }
}
