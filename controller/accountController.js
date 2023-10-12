import { query } from "express";
import asyncHandler from "../middleware/asyncHandler.js";
import generateToken from "../utils/generateToken.js";
import db from "../src/models/index.js";

// @desc Auth account & get token
// @routes POST /api/account/login
// @access public

const loginAccount = asyncHandler(async (req, res) => {
  const { username, password } = req.body;

  try {
    const account = await db.Account.findOne({
      attributes: ["AccountID", "username", "password", "RoleID"],
      where: { username: username },
      raw: true,
    });

    console.log("account", account);

    if (account.username == username) {
      const passwordMatch = await db.Account.findOne({
        attributes: ["password"],
        where: { username: username },
      });

      if (passwordMatch.password == password) {
        res.json({
          AccountID: account.AccountID,
          username: account.username,
          RoleID: account.RoleID,
          token: generateToken(account.AccountID),
        });
      } else {
        res.status(401).json({ message: "Invalid Email or Password" });
      }
    }
  } catch (e) {
    console.log(`Error by: ${e}`);
  }
});

// @desc Logout account / clear cookie
// @routes POST /api/account/login
// @access private

const logoutAccount = asyncHandler(async (req, res) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    expires: new Date(0),
  });
  res.status(200).json({ message: "Logout successed" });
});

export { loginAccount, logoutAccount };
