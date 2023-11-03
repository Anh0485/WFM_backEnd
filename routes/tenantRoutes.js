import express from "express";
const router = express.Router();

import {
  createdTenant,
  getAllTenants,
  deleteTenants,
  updateTenant
} from "../controller/tenantController.js";
import { protect, superAdmin } from "../middleware/authMiddleware.js";

router.post("/createTenant", protect, superAdmin, createdTenant);
router.get("/", protect, superAdmin, getAllTenants);
router.route("/:id")
.delete(protect, superAdmin, deleteTenants)
.put(protect, superAdmin,updateTenant )
export default router;
