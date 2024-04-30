import express from "express";
const router = express.Router();
import {
  loginAccount,
  logoutAccount,
  forgotPassoword,
  validateResetTokenResetPassword,
  changePassword,
  addAccount,
  getAllRole,
} from "../controller/accountController.js";
import { protect } from "../middleware/authMiddleware.js";

router.post("/login", loginAccount);
router.post("/logout", logoutAccount);
router.post("/forgotPassword", forgotPassoword);
router.post("/resetPassword", validateResetTokenResetPassword);
router.post("/changePassword", changePassword);
router.post("/addAccount", addAccount);
router.get("/role",protect, getAllRole)

export default router;
