import express from "express";
import { protect } from "../middleware/authMiddleware";
import { getUserProfile } from "../controller/userController";
const router = express.Router();

router.get('/getUserProfile', protect, getUserProfile);

export default router;