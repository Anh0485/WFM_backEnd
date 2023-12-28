import express from "express";
import { protect } from "../middleware/authMiddleware";
import { getAllModule, getModuleName, getPermissionSub } from "../controller/moduleController";
const router = express.Router();

router.get("/", getAllModule);
router.get("/ModuleName",protect ,getModuleName);
router.get('/permission', protect, getPermissionSub)

export default router;