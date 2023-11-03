import express from "express";
const router = express.Router();

import {
  createdShift,
  deletedShift,
  getAllShift,
  getShiftByID,
  updatedShift,
} from "../controller/shiftController";
import { protect, superAdmin, admin } from "../middleware/authMiddleware";

router.post("/createdShift", protect, admin, superAdmin, createdShift);
router.get("/", protect, admin, superAdmin, getAllShift);
router
  .route("/:id")
  .put(protect, admin, superAdmin, updatedShift)
  .delete(protect, admin, superAdmin, deletedShift)
  .get(protect, admin, superAdmin, getShiftByID);

export default router;
