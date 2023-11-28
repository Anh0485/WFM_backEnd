import express from "express";
const router = express.Router();

import {
  createdShift,
  createdWorkSchedule,
  deleteWSchedule,
  deletedShift,
  getAllShift,
  getShiftByID,
  updateWSchedule,
  updatedShift,
} from "../controller/ShiftandWSController";
import { protect, superAdmin, admin } from "../middleware/authMiddleware";

router.post("/createdShift", protect, admin, superAdmin, createdShift);
router.post("/createdWSchedule", protect, admin, superAdmin, createdWorkSchedule);

router.get("/", protect, admin, superAdmin, getAllShift);
router
  .route("/:id")
  .put(protect, admin, superAdmin, updatedShift)
  .delete(protect, admin, superAdmin, deletedShift)
  .get(protect, admin, superAdmin, getShiftByID);
router.route("/wschedule/:id")
.put(protect, admin, superAdmin, updateWSchedule)
.delete(protect,admin, superAdmin, deleteWSchedule)
export default router;
