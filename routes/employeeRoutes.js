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
import { protect, superAdmin } from "../middleware/authMiddleware";

router.post("/addEmployee", protect, addEmployee);
router
  .route("/:id")
  .get(getEmployeeProfileByID)
  .put(updateInforEmployee)
  .delete(deleteEmployee);

router.route("/").get(protect, getAllEmployee);
// .get(getAllEmployee);
export default router;
