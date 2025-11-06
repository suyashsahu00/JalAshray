import { Router } from 'express';
import type { RowDataPacket } from 'mysql2';
import multer from 'multer';
import path from 'path';
import { pool } from '../db.js';
import { auth } from '../middleware/auth.js';

const router = Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'leak-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

router.get('/', auth, async (_req, res) => {
  const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM leaks ORDER BY reported_at DESC');
  res.json(rows);
});

router.post('/', auth, upload.single('photo'), async (req, res) => {
  try {
    const { location, latitude, longitude, severity, status, description, reported_by } = req.body as Record<string, any>;
    
    // Get photo URL if file was uploaded
    const photo_url = req.file ? `/uploads/${req.file.filename}` : null;

    const [result] = await pool.query(
      `INSERT INTO leaks (location, latitude, longitude, severity, status, description, reported_by, photo_url)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [location, latitude, longitude, severity, status || 'active', description || null, reported_by || null, photo_url]
    );
    
    // @ts-ignore mysql2 types
    res.json({ id: result.insertId as number, message: 'Leak created' });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('[LEAK CREATE] error:', error);
    res.status(500).json({ message: 'Failed to create leak' });
  }
});

router.put('/:id', auth, async (req, res) => {
  const { status } = req.body as { status: string };
  await pool.query('UPDATE leaks SET status = ? WHERE id = ?', [status, req.params.id]);
  res.json({ message: 'Leak updated' });
});

export default router;

