import express from 'express';
import { login, getProfile } from '../controllers/userController';

const router = express.Router();

router.post('/login', login);
router.get('/profile', getProfile);

export default router;
