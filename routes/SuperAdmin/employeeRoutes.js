import express from "express";
const router = express.Router();

import {
  addEmployee,
  getEmployeeProfileByID,
  updateInforEmployee,
  deleteEmployee,
  searchEmployee,
} from "../../controller/SuperAdmin/employeeController";

router.post("/addEmployee", addEmployee);
router
  .route("/:id")
  .get(getEmployeeProfileByID)
  .put(updateInforEmployee)
  .delete(deleteEmployee);
router.route("/").get(searchEmployee);
export default router;
