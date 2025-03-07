import { Router } from "express";
import { registerUser, loginUser, updateUser, getUserProfile, deleteUserProfile } from '../controllers/user.controller.js';
import { verifyJWT } from "../middlewares/auth.middleware.js";
const router = Router();
router.post('/register', registerUser);
router.post('/login', loginUser);
router.put('/update',verifyJWT(), updateUser);
router.get('/profile',verifyJWT(), getUserProfile);
router.delete('/profile',verifyJWT(), deleteUserProfile);

export default router;