import express from 'express';
import multer from 'multer';
import { uploadFile } from '../controllers/filecontroller.js';
import { authenticateUser } from '../middleware/authenticate.user.js';
const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage });

// POST /api/files/upload
router.post('/upload', authenticateUser, upload.single('file'), uploadFile);

export default router;
