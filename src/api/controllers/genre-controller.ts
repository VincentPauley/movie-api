import { Request, Response } from 'express';
import db from '../../db'

export const getAllGenres = async (req: Request, res: Response) => {
    const [rows] = await db.query('SELECT * FROM genres');
    res.json({ genres: rows })
}