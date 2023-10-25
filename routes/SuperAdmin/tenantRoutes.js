import express from "express";
const router = express.Router();

import { createdTenant } from "../../controller/SuperAdmin/tenantController.js";

router.post("/createTenant", createdTenant);

export default router;
