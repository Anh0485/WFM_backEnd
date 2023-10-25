import express from "express";
const router = express.Router();

import {
  addEmployee,
  getEmployeeProfile,
} from "../../controller/SuperAdmin/employeeController";

router.post("/addEmployee", addEmployee);
router.get("/:id", getEmployeeProfile);

export default router;
