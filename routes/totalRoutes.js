import express from "express";
import { protect, superAdmin, checkPermission } from "../middleware/authMiddleware.js";
import { totalAgent } from "../controller/totalController.js";
const router = express.Router();

router.get("/totalAgent", protect,totalAgent);

export default router;