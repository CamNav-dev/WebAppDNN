import express from 'express';
import multer from 'multer';
import { uploadFile, updateFileName, deleteFile, getAllFiles, testFile, getFiles} from '../controllers/filecontroller.js';
import { authenticateUser } from '../middleware/authenticate.user.js';

const router = express.Router();

// Configure multer to use memory storage
const upload = multer({ storage: multer.memoryStorage() });

// POST /api/files/upload Files
router.post('/upload', authenticateUser, upload.single('file'), uploadFile);
router.put('/update', authenticateUser, updateFileName);
router.delete('/delete/:fileId', authenticateUser, deleteFile);
//router.get('/allfiles', authenticateUser, getAllFiles);
router.get('/files', authenticateUser, getFiles);
router.put('/update', authenticateUser, updateFileName);
// Nueva ruta para test
router.post('/test/:fileId', authenticateUser, testFile);
// POST Folder
export default router;
