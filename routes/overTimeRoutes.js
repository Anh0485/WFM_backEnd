import express from "express";
import { protect } from "../middleware/authMiddleware";
import { createdOT, getAllOT,reviewRequest, deleteOT, pendingOT, approvedOT, rejectOT, getTotalOvertimeHour } from "../controller/overTimeController";
const router = express.Router();

router.post("/createdOT", protect, createdOT);
router.get("/", protect, getAllOT);
router.get("/pending", protect, pendingOT);
router.get("/approved", protect, approvedOT);
router.get("/reject", protect, rejectOT);
router.get("/getTotalOvertimeHour", protect, getTotalOvertimeHour)
router.put("/reviewRequest/:id",protect,reviewRequest)
router.route("/:id").delete(protect,deleteOT)

export default router;