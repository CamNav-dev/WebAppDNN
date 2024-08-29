import express from 'express';
import multer from 'multer';
import { uploadFile } from '../controllers/filecontroller.js';

const router = express.Router();

// Configure multer to use memory storage instead of disk storage
const storage = multer.memoryStorage();

const upload = multer({ storage });

// POST /api/files/upload
router.post('/upload', upload.single('file'), uploadFile);

export default router;
