import express from "express";
import { protect, superAdmin, checkPermission } from "../middleware/authMiddleware.js";
import { getTotalWorkHourandOvertimeHour, totalAgent, totalSupervisor } from "../controller/totalController.js";
const router = express.Router();

router.get("/totalAgent", protect,totalAgent);
router.get("/totalSupervisor", protect, totalSupervisor);
router.get("/getTotalWorkHourandOvertimeHour", protect, getTotalWorkHourandOvertimeHour)
export default router;