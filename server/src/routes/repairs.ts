import { Router } from 'express';
import type { RowDataPacket } from 'mysql2';
import { pool } from '../db.js';
import { auth } from '../middleware/auth.js';

const router = Router();

router.get('/', auth, async (_req, res) => {
  const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM repairs ORDER BY id DESC');
  res.json(rows);
});

router.post('/', auth, async (req, res) => {
  const { leak_id, worker_id, status, before_photo, after_photo } = req.body as Record<string, any>;
  const [result] = await pool.query(
    `INSERT INTO repairs (leak_id, worker_id, status, started_at, before_photo, after_photo)
     VALUES (?, ?, ?, NOW(), ?, ?)`,
    [leak_id, worker_id || null, status || 'assigned', before_photo || null, after_photo || null]
  );
  // @ts-ignore mysql2 types
  res.json({ id: result.insertId as number, message: 'Repair created' });
});

router.put('/:id', auth, async (req, res) => {
  const { status } = req.body as { status: string };
  await pool.query('UPDATE repairs SET status = ?, completed_at = IF(? = "completed", NOW(), completed_at) WHERE id = ?', [status, status, req.params.id]);
  res.json({ message: 'Repair updated' });
});

export default router;

