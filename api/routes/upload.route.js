import express from 'express';
import multer from 'multer';
import { uploadFile } from '../controllers/filecontroller.js';
import { authenticateUser } from '../middleware/authenticate.user.js';

const router = express.Router();

// Configure multer to use memory storage
const upload = multer({ storage: multer.memoryStorage() });

// POST /api/files/upload
router.post('/upload', authenticateUser, upload.single('file'), uploadFile);

export default router;