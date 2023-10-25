import express from "express";
const router = express.Router();

import {
  addEmployee,
  getEmployeeProfile,
  updateInforEmployee,
} from "../../controller/SuperAdmin/employeeController";

router.post("/addEmployee", addEmployee);
router.route("/:id").get(getEmployeeProfile).put(updateInforEmployee);

export default router;
