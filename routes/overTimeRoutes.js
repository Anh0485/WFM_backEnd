import express from "express";
import { protect } from "../middleware/authMiddleware";
import { createdOT } from "../controller/overTimeController";
const router = express.Router();

router.post("/createdOT", protect, createdOT);

export default router;