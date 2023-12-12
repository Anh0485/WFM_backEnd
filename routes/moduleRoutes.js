import express from "express";
import { protect } from "../middleware/authMiddleware";
import { getAllModule, getModuleName } from "../controller/moduleController";
const router = express.Router();

router.get("/", getAllModule);
router.get("/ModuleName",protect ,getModuleName)

export default router;