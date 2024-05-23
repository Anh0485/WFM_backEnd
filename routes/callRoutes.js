import express from "express";
import { protect } from "../middleware/authMiddleware";
import { getCallAndAgentByWeek, getCallandAgentByTime } from "../controller/callController";
const router = express.Router();

router.get('/getAllCallandAgent', getCallandAgentByTime);
router.get('/getCallAndAgentByWeek', protect, getCallAndAgentByWeek)
export default router;  