import { Request, Response } from 'express';
import pool from '../config/database.js';
import { CustomRequest } from '../middleware/auth.js'; // Assuming you have this type
import type { ResultSetHeader } from 'mysql2';  // Add this import

export const getAllLeaks = async (_req: Request, res: Response): Promise<void> => {
  try {
    const [rows] = await pool.query('SELECT * FROM leaks ORDER BY reported_at DESC');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch leaks' });
  }
};

export const createLeak = async (req: CustomRequest, res: Response): Promise<void> => {
  try {
    const { location, latitude, longitude, severity, description } = req.body;
    const reported_by = req.userId; // Assuming userId is set by auth middleware on CustomRequest
    const photo_url = req.file ? `/uploads/${req.file.filename}` : null;

    const [result] = await pool.query<ResultSetHeader>(
      'INSERT INTO leaks (location, latitude, longitude, severity, description, reported_by, photo_url, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [location, latitude, longitude, severity, description, reported_by, photo_url, 'active']
    );

    res.status(201).json({
      id: result.insertId, 
      message: 'Leak reported successfully' 
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create leak report' });
  }
};

export const updateLeakStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    await pool.query('UPDATE leaks SET status = ? WHERE id = ?', [status, id]);
    res.json({ message: 'Leak status updated successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update leak status' });
  }
};
