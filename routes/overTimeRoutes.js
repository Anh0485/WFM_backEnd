import express from "express";
import { protect } from "../middleware/authMiddleware";
import { createdOT, getAllOT } from "../controller/overTimeController";
const router = express.Router();

router.post("/createdOT", protect, createdOT);
router.get("/", protect, getAllOT)

export default router;