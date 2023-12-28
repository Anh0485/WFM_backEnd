import express from "express";
import { protect } from "../middleware/authMiddleware";
import { getCallandAgentByTime } from "../controller/callController";
const router = express.Router();

router.get('/getAllCallandAgent', getCallandAgentByTime);

export default router;