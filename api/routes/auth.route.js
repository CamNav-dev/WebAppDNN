import express from 'express';
import { signin, signup, deleteUser, updateUser, processPayment } from '../controllers/auth.controller.js';
import { refreshTokenHandler } from '../utils/error.js';
const router = express.Router();
router.post("/signup",signup)
router.post("/signin", signin)
router.delete('/delete/:id', deleteUser);
router.put('/update/:id', updateUser);
router.post("/refresh-token", refreshTokenHandler);
router.post('/payment/:id', processPayment); // Ruta para procesar pagos
export default router;