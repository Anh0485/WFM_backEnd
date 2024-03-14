import express from "express";
import { protect, superAdmin, checkPermission } from "../middleware/authMiddleware.js";
import { totalAgent, totalSupervisor } from "../controller/totalController.js";
const router = express.Router();

router.get("/totalAgent", protect,totalAgent);
router.get("/totalSupervisor", protect, totalSupervisor);

export default router;