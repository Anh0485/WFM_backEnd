import express from "express";
const router = express.Router();

import {
  addEmployee,
  getEmployeeProfileByID,
  updateInforEmployee,
  deleteEmployee,
  searchEmployee,
  getAllEmployee,
} from "../../controller/SuperAdmin/employeeController";

router.post("/addEmployee", addEmployee);
router
  .route("/:id")
  .get(getEmployeeProfileByID)
  .put(updateInforEmployee)
  .delete(deleteEmployee)
  .get(searchEmployee);
router.route("/").get(getAllEmployee);
export default router;
