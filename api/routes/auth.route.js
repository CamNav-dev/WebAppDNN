import express from 'express';
import { signin, signup, deleteUser, updateUser } from '../controllers/auth.controller.js';

const router = express.Router();
router.post("/signup",signup)
router.post("/signin", signin)
router.delete('/delete/:id', deleteUser);
router.put('/update/:id', updateUser);

export default router;