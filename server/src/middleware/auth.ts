import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthUser {
  id: number;
  role: 'admin' | 'worker' | 'citizen';
  name: string;
  email: string;
}

export interface AuthedRequest extends Request {
  user?: AuthUser;
}

export function auth(req: AuthedRequest, res: Response, next: NextFunction) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : undefined;
  if (!token) return res.status(401).json({ message: 'Missing token' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || '');
    req.user = decoded as AuthUser;
    next();
  } catch {
    return res.status(401).json({ message: 'Invalid token' });
  }
}

