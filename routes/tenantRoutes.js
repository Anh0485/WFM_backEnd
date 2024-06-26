import express from "express";
const router = express.Router();

import {
  createdTenant,
  getAllTenants,
  deleteTenants,
  updateTenant,
  getTenantID
} from "../controller/tenantController.js";
import { protect, superAdmin, checkPermission } from "../middleware/authMiddleware.js";

router.post("/createTenant", protect, createdTenant);
router.get("/", protect, getAllTenants);
router.get("/getTeantID", protect, getTenantID)
router.route("/:id")
.delete(protect, deleteTenants)
.put(protect,updateTenant )
export default router;
