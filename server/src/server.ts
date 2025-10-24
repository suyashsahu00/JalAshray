import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import leakRoutes from './routes/leakRoutes';
import userRoutes from './routes/userRoutes';

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 5000; // Convert to number

// Middleware - Allow all origins for development
app.use(cors({
  origin: '*', // Allow all origins (for development/hackathon)
  credentials: true
}));

app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Routes
app.use('/api/leaks', leakRoutes);
app.use('/api/users', userRoutes);

// Health check
app.get('/', (_req, res) => {
  res.json({ message: 'JalAshray API is running' });
});

// Listen on all network interfaces
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📱 Access from mobile: http://YOUR_IP:${PORT}`);
});
