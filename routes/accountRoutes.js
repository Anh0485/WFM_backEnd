import express from "express";
const router = express.Router();
import {
  loginAccount,
  logoutAccount,
} from "../controller/accountController.js";

router.post("/login", loginAccount);
router.post("/logout", logoutAccount);

export default router;
