import jwt from "jsonwebtoken";
import asyncHandler from "./asyncHandler";
import db from "../src/models/index.js";

//protect routes
export const protect = asyncHandler(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log("decoded", decoded);

      req.account = await db.Account.findOne({
        attributes: ["AccountID", "RoleID"],
        where: {
          AccountID: decoded.id,
        },
      });

      //   req.account.roleID = await db.Account.findOne({
      //     attributes: ["RoleID"],
      //     where: {
      //       RoleID: decoded.roleID,
      //     },
      //   });
      next();
    } catch (error) {
      console.error(error);
      res.status(401);
      throw new Error("Not authorized, token failed");
    }
  }
  if (!token) {
    res.status(401).json({ message: "Not authorized, no token" });
  }
});

export const superAdmin = asyncHandler(async (req, res, next) => {
  console.log("req.account", req.account, "req.account.id", req.account.RoleID);
  if (req.account && (req.account.RoleID === 1 )) {
    next();
  } else {
    res.status(401).json({ message: "Not authorized as superadmin" });
  }
});

export const admin = asyncHandler(async (req, res, next) => {
  if (req.account && (req.account.RoleID === 1 || req.account.RoleID === 2)) {
    next();
  } else {
    res.status(401).json({ message: "Not authorized as admin" });
  }
});
