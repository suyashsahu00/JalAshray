import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';
import users from './routes/users.js';
import leaks from './routes/leaks.js';
import repairs from './routes/repairs.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Serve uploaded files statically
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.get('/api/health', (_req, res) => res.json({ ok: true }));

app.use('/api/users', users);
app.use('/api/leaks', leaks);
app.use('/api/repairs', repairs);

const port = Number(process.env.PORT || 5000);
app.listen(port, '0.0.0.0', () => {
  // eslint-disable-next-line no-console
  console.log(`API listening on http://localhost:${port}`);
});

