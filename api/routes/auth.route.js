import express from 'express';
import { signin, signup, deleteUser, updateUser, payment } from '../controllers/auth.controller.js';

const router = express.Router();
router.post("/signup",signup)
router.post("/signin", signin)
router.delete('/delete/:id', deleteUser);
router.put('/update/:id', updateUser);
router.post("/payment", payment)

export default router;