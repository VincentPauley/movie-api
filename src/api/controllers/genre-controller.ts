import { Request, Response } from 'express';
import { z } from 'zod'
import db from '../../db'
import logger from '../../config/logger'

const addGenreSchema = z.object({
    genre_name: z.string().min(1, 'genre_name is a required param'),
    genre_level: z.number().int().min(0).max(4, 'Genre level must be provided')
});

export const getAllGenres = async (req: Request, res: Response) => {
    try {
        const [rows] = await db.query('SELECT * FROM genres');

        if (!Array.isArray(rows)) {
            throw new Error('improper result from query')
        }

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
