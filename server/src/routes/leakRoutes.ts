import express from 'express';
import multer from 'multer';
import type { Request } from 'express';
import type { Multer } from 'multer';
import { getAllLeaks, createLeak, updateLeakStatus } from '../controllers/leakController.js';

const router = express.Router();

const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (_req: Request, file: Express.Multer.File, cb: (error: Error | null, filename: string) => void) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage });

router.get('/', getAllLeaks);
router.post('/', upload.single('photo'), createLeak);
router.put('/:id', updateLeakStatus);

export default router;
