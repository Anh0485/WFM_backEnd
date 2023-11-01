import express from "express";
const router = express.Router();

import {
  addEmployee,
  getEmployeeProfileByID,
  updateInforEmployee,
  deleteEmployee,
  searchEmployee,
  getAllEmployee,
} from "../controller/employeeController";

router.post("/addEmployee", addEmployee);
router
  .route("/:id")
  .get(getEmployeeProfileByID)
  .put(updateInforEmployee)
  .delete(deleteEmployee);

router.route("/").get(getAllEmployee);
// .get(getAllEmployee);
export default router;
