import { Request, Response } from 'express';
import { z } from 'zod'
import db from '../../db'

const addGenreSchema = z.object({
    genre_name: z.string().min(1, 'genre_name is a required param'),
    genre_level: z.number().int().min(0).max(4, 'Genre level must be provided')
});

export const getAllGenres = async (req: Request, res: Response) => {
    const [rows] = await db.query('SELECT * FROM genres');
    res.json({ genres: rows });
}

export const addGenre = async (req: Request, res: Response) => {
    try {
        const validatedData = addGenreSchema.parse(req.body);

        const id = crypto.randomUUID();

        await db.query(
            'INSERT INTO genres (id, genre_name, genre_level) VALUES (?, ?, ?)',
            [id, validatedData.genre_name, validatedData.genre_level]
        );

        res.status(201).json({ 
            message: 'Genre added successfully',
            genre: { id, ...validatedData }
        });
    } catch (e) {
        if (e instanceof z.ZodError) {
            return res.status(400).json({ 
                message: 'Invalid request body',
                errors: e.issues
            });
        }
        
        const error = e as Error;
        console.error(error);
        res.status(500).json({ message: 'Failed to add genre' });
    }
}
