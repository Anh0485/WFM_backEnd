import express from "express";
const router = express.Router();
import {
  loginAccount,
  logoutAccount,
  forgotPassoword,
  validateResetTokenResetPassword,
} from "../controller/accountController.js";

router.post("/login", loginAccount);
router.post("/logout", logoutAccount);
router.post("/forgotPassword", forgotPassoword);
router.post("/resetPassword", validateResetTokenResetPassword);

export default router;
