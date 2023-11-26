import { query } from "express";
import asyncHandler from "../middleware/asyncHandler.js";
import generateToken from "../utils/generateToken.js";
import db, { sequelize } from "../src/models/index.js";
import crypto from "crypto";
import { sendPasswordResetEmail } from "./emailController.js";
import { hashSync, genSaltSync } from "bcrypt";
import bcrypt from "bcryptjs";
import { Op, QueryTypes } from "sequelize";

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

    if (account && account.username == username) {
      const passwordHash = account.password;

      console.log("passwordHash", passwordHash);

      const isPasswordMatch = await bcrypt.compare(password, passwordHash);



      console.log("isPasswordMatch:", isPasswordMatch);

      if (isPasswordMatch) {
        // const permissionDetail = await db.PermissionDetail.findOne({
        //   attributes:["ModuleID","CanView","CanEdit","CanDelete","CanExport"],
        //   where:{
        //     PermissionID: account.PermissionID
        //   }
        // })
        const permissions = await sequelize.query(`SELECT permissions.PermissionID,modules.ModuleName, permissiondetails.CanView, permissiondetails.CanEdit, permissiondetails.CanDelete, permissiondetails.CanExport
        FROM accounts
        JOIN permissions ON accounts.AccountID = permissions.AccountID
        JOIN permissiondetails ON permissiondetails.PermissionID = permissions.PermissionID
        JOIN modules ON permissiondetails.ModuleID = modules.ModuleID
        where accounts.AccountID = :id`,
        {
          replacements: {
            id: account.AccountID
          },
          type: QueryTypes.SELECT
        })
        // const user = await db.
        res.json({
          AccountID: account.AccountID,
          username: account.username,
          RoleID: account.RoleID,
          token: generateToken(account.AccountID, account.RoleID, permissions),
          status: "true",
        });
      } else {
        res.status(401).json({ message: "Invalid Email or Password" });
      }
    } else {
      res.status(401).json({ message: "Invalid Email or Password" });
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

// @desc forgot password
// @routes POST /api/account/forgotPassoword
// @access public

const forgotPassoword = asyncHandler(async (req, res, next) => {
  try {
    const email = req.body.email;

    const origin = req.header("Origin");

    const user = await db.User.findOne({
      attributes: ["email"],
      where: { email: email },
    });

    if (!user.email) {
      res.json({ status: "Email doesn't exits in system" });
    }
    // Get all the tokens that were previously set for this user and set used to 1.
    //This will prevent old and expired tokens  from being used.

    console.log("user email", user.email);

    const expireOldTokens = await db.ResetPasswordToken.update(
      { used: 1 },
      { where: { email: user.email } }
    );

    // create reset token that expire after 1 hours

    const resetToken = crypto.randomBytes(40).toString("hex");
    const resetTokenExpires = new Date(Date.now() + 60 * 60 * 1000);
    const createdAtToken = new Date(Date.now());
    const expiredAtToken = resetTokenExpires;

    //insert the new token into resetPasswordToken table

    const ResetTokenResult = await db.ResetPasswordToken.create({
      email: email,
      token_value: resetToken,
      createdAt: createdAtToken,
      expiredAt: expiredAtToken,
      used: 0,
      raw: true,
    });

    //send email
    await sendPasswordResetEmail(email, resetToken, origin);

    res.status(200).json({
      message: "Please check your email for a new password",
    });
  } catch (e) {
    console.log(`Error by: ${e}`);
  }
});

// @desc reset Password
// @routes POST /api/account/resetPassword
// @access public

//Reset token validate
const validateResetTokenResetPassword = asyncHandler(async (req, res) => {
  const email = req.body.email;
  const resetToken = req.body.token;

  if (!resetToken || !email) {
    res.status(400);
  }

  //need to verify if the token exist in the resetPasswordToken and not expired.

  const currentTime = new Date(Date.now());

  const findValidToken = (token, email, currentTime) => {
    return new Promise(async (resolve, reject) => {
      try {
        await db.ResetPasswordToken.findOne(
          {
            where: {
              email: email,
              token_value: token,
              expired_at: currentTime,
            },
          },
          (error, tokens) => {
            if (error) {
              return reject(error);
            }
            return resolve(tokens[0]);
          }
        );
      } catch (e) {
        console.log(`Error by: ${e}`);
      }
    });
  };

  const token = await db.ResetPasswordToken.findOne({
    attributes: ["token_value"],
    where: {
      email: email,
      used: 0,
    },
  });

  if (!token) {
    res.status(400).json({ message: "Invalid token, please try again." });
  }

  try {
    const newPassword = req.body.newPassword;
    const username = req.body.username;

    if (!newPassword) {
      res.status(400).json({ message: "Invalid new password" });
    }

    console.log("newPassword: ", newPassword);

    const salt = genSaltSync(10);
    const password = hashSync(newPassword, salt);

    await db.Account.update(
      { password: password },
      {
        where: {
          username: username,
        },
      }
    );

    res.status(200).json({
      message:
        "Password reset successful, you can now login with the new password",
    });
  } catch (e) {
    console.log(`Error by: ${e}`);
  }
});

// @desc change Password
// @routes POST /api/account/resetPassword
// @access public

const changePassword = asyncHandler(async (req, res) => {
  const { username, currentPassword, newPassword, reEnterNewPassword } =
    req.body;

  try {
    //find username

    const user = await db.Account.findOne({
      attributes: ["AccountID", "username", "password"],
      where: {
        username: username,
      },
    });
    if (!user.username) {
      res.status(404).json({ message: "user not found" });
    }

    // "New Password" and "Re-enter New Password" fields are not filled
    if (!newPassword || !reEnterNewPassword) {
      res.status(400).json({
        message: "New password and re-enter new password fields are required.",
      });
    }

    //validate the re-enter new password field
    if (newPassword !== reEnterNewPassword) {
      res.status(400).json({ message: "New password do not match" });
    }

    //compare the current password with the stored hash

    console.log("userpassword", user.password);

    const passwordMatch = await bcrypt.compare(currentPassword, user.password);

    console.log("passwordMatch", passwordMatch);

    if (!passwordMatch) {
      res.status(401).json({ message: "Incorrect password" });
    } else {
      //the new password is the same as the old password
      if (newPassword === currentPassword) {
        res.status(401).json({
          message: "New password cannot be the same as the old password",
        });
      } else {
        const hashPassword = await bcrypt.hash(newPassword, 10);
        console.log("hashPassword", hashPassword);
        //update the user's password in the database
        await db.Account.update(
          { password: hashPassword },
          {
            where: {
              username: user.username,
            },
          }
        );
        res.status(200).json({ message: "Password change successfully" });
      }
    }
  } catch (e) {
    console.log(`Error by ${e}`);
  }
});

// @desc create account for employee
// @routes POST /api/account/Account
// @access private

const addAccount = asyncHandler(async (req, res) => {
  const { username, password, RoleID } = req.body;

  try {
    const salt = genSaltSync(10);
    const hashPassword = hashSync(password, salt);

    const findAccount = await db.Account.findOne({
      attributes: ["username"],
      where: {
        username: username,
      },
    });

    if (findAccount === null) {
      console.log("username", username);
      const CreateAccount = await db.Account.create({
        username: username,
        password: hashPassword,
        RoleID: RoleID,
      });
      res.status(200).json({
        message: "Account is  created successfully",
      });
    } else {
      res.json({ message: "username exits in system" });
    }
  } catch (e) {
    console.log(`Error by: ${e}`);
  }
});

export {
  loginAccount,
  logoutAccount,
  forgotPassoword,
  validateResetTokenResetPassword,
  changePassword,
  addAccount,
};
