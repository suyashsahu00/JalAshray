import express from 'express';
import multer from 'multer';
import { getAllLeaks, createLeak, updateLeakStatus } from '../controllers/leakController';

const router = express.Router();

const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (_req, file, cb) => {  // Changed: req to _req (prefix with underscore)
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage });

router.get('/', getAllLeaks);
router.post('/', upload.single('photo'), createLeak);
router.put('/:id', updateLeakStatus);

export default router;
