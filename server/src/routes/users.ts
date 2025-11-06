import { Router } from 'express';
import type { RowDataPacket } from 'mysql2';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { pool } from '../db.js';
import { auth, AuthedRequest } from '../middleware/auth.js';

const router = Router();

router.post('/login', async (req, res) => {
  const { email, password } = req.body as { email?: string; password?: string };
  if (!email || !password) return res.status(400).json({ message: 'Email and password required' });

  // Debug logging to help diagnose invalid credential issues in dev
  // eslint-disable-next-line no-console
  console.log(`[LOGIN] attempt`, { email });

  const normalizedEmail = email.trim().toLowerCase();
  const [rows] = await pool.query<RowDataPacket[]>(
    'SELECT * FROM users WHERE LOWER(email) = ? LIMIT 1',
    [normalizedEmail]
  );
  const user = rows[0] as any;
  if (!user) {
    // eslint-disable-next-line no-console
    console.log('[LOGIN] user not found');
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  let ok = false;
  if (typeof user.password === 'string' && user.password.startsWith('$2')) {
    ok = await bcrypt.compare(password, user.password);
  } else {
    // Allow legacy plaintext password for initial seed/dev DB
    ok = password === user.password;
    if (ok) {
      // Migrate to bcrypt hash silently
      const newHash = await bcrypt.hash(password, 10);
      await pool.query('UPDATE users SET password = ? WHERE id = ?', [newHash, user.id]);
    }
  }
  if (!ok) {
    // eslint-disable-next-line no-console
    console.log('[LOGIN] password mismatch');
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const token = jwt.sign(
    { id: user.id, role: user.role, name: user.name, email: user.email },
    process.env.JWT_SECRET || '',
    { expiresIn: '7d' }
  );

  res.json({
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      department: user.department,
      created_at: user.created_at
    }
  });
});

router.post('/register', async (req, res) => {
  const { name, email, password, role, department } = req.body as {
    name?: string;
    email?: string;
    password?: string;
    role?: 'admin' | 'worker' | 'citizen';
    department?: string;
  };

  // Validation
  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Name, email, and password are required' });
  }

  // Validate role
  const validRoles: ('admin' | 'worker' | 'citizen')[] = ['admin', 'worker', 'citizen'];
  const userRole = role && validRoles.includes(role) ? role : 'citizen';

  // Normalize email
  const normalizedEmail = email.trim().toLowerCase();

  // Check if email already exists
  const [existingRows] = await pool.query<RowDataPacket[]>(
    'SELECT id FROM users WHERE LOWER(email) = ?',
    [normalizedEmail]
  );

  if (existingRows.length > 0) {
    return res.status(409).json({ message: 'Email already registered' });
  }

  // Hash password
  const passwordHash = await bcrypt.hash(password, 10);

  // Insert new user
  try {
    const [result] = await pool.query(
      'INSERT INTO users (name, email, password, role, department) VALUES (?, ?, ?, ?, ?)',
      [name.trim(), normalizedEmail, passwordHash, userRole, department?.trim() || null]
    );

    // Get the created user
    const [userRows] = await pool.query<RowDataPacket[]>(
      'SELECT id, name, email, role, department, created_at FROM users WHERE id = ?',
      [(result as any).insertId]
    );

    const newUser = userRows[0];

    // Generate JWT token
    const token = jwt.sign(
      { id: newUser.id, role: newUser.role, name: newUser.name, email: newUser.email },
      process.env.JWT_SECRET || '',
      { expiresIn: '7d' }
    );

    res.status(201).json({
      token,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        department: newUser.department,
        created_at: newUser.created_at
      }
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('[REGISTER] error:', error);
    res.status(500).json({ message: 'Registration failed. Please try again.' });
  }
});

router.get('/profile', auth, async (req: AuthedRequest, res) => {
  const [rows] = await pool.query<RowDataPacket[]>(
    'SELECT id, name, email, role, department, created_at FROM users WHERE id = ?',
    [req.user!.id]
  );
  res.json(rows[0] || null);
});

export default router;

