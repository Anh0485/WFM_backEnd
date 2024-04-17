import express from "express";
const router = express.Router();

import {
  createdShift,
  createdWorkSchedule,
  deleteWSchedule,
  deletedShift,
  getAllShift,
  getAllWSchedule,
  getShiftByID,
  getTotalWorkHour,
  onTime,
  updateWSchedule,
  updatedShift,
} from "../controller/ShiftandWSController";
import { protect, superAdmin, admin } from "../middleware/authMiddleware";

router.post("/createdShift", protect, createdShift);
router.post("/createdWSchedule", protect, createdWorkSchedule);

router.get("/", protect, getAllShift);
router.get("/workschedule", protect, getAllWSchedule);
router.get("/workschedule/ontime", protect, onTime);
router.get("/workschedule/totalWorkHour", protect, getTotalWorkHour)
router
  .route("/:id")
  .put(protect, updatedShift)
  .delete(protect,  deletedShift)
  .get(protect, getShiftByID);
router.route("/wschedule/:id")
.put(protect, updateWSchedule)
.delete(protect, deleteWSchedule)
export default router;
