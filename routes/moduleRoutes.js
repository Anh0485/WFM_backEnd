import express from "express";
import { protect } from "../middleware/authMiddleware";
import { getAllModule, getModuleAndPermission, getModuleName, getPermissionSub, getProfileAccount } from "../controller/moduleController";
const router = express.Router();

router.get("/", getAllModule);
router.get("/ModuleName",protect ,getModuleName);
router.get('/permission', protect, getPermissionSub)
router.get('/accountProfile', protect, getProfileAccount)
router.get('/getModuleAndPermission', protect, getModuleAndPermission)
export default router;