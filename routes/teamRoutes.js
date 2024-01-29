import express from "express";
const router = express.Router();
import { protect, superAdmin, checkPermission } from "../middleware/authMiddleware.js";
import { createdTeam } from "../controller/teamController.js";


router.post("/createTeam", protect, createdTeam)


export default router;