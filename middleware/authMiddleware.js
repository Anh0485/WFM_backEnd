import jwt from "jsonwebtoken";
import asyncHandler from "./asyncHandler";
import db, { sequelize } from "../src/models/index.js";
import { Op, QueryTypes } from "sequelize";

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

      
    
      req.permission = await sequelize.query(`SELECT permissions.PermissionID,modules.ModuleName, permissiondetails.CanAdd, permissiondetails.CanView, permissiondetails.CanEdit, permissiondetails.CanDelete, permissiondetails.CanExport
      FROM accounts
      JOIN permissions ON accounts.AccountID = permissions.AccountID
      JOIN permissiondetails ON permissiondetails.PermissionID = permissions.PermissionID
      JOIN modules ON permissiondetails.ModuleID = modules.ModuleID
      where accounts.AccountID = :id`,
      {
        replacements: {
          id: decoded.id
        },
        type: QueryTypes.SELECT
      })


      req.createdBy = decoded.id;

      //check permission
      const methodType = req.method;

      switch(methodType){
        case 'POST':
          for (let i = 0; i < req.permission.length; i++){
            const permission = req.permission[i];
            if(permission.CanAdd == 1){
              next();
              break;
            }else{
              res.status(200).json({message:'You do not have access'});
              return
            }
          }
          break;
        case 'GET':
          for (let i = 0; i < req.permission.length; i++){
            const permission = req.permission[i];
            if(permission.CanView === 1){
              next();
              break;
            }else{
              res.status(200).json({message:'You do not have access'})
              return;

            }
          }
          break;
        case 'PUT':
          for (let i = 0; i < req.permission.length; i++){
            const permission = req.permission[i];
            if(permission.CanEdit === 1){
              next();
              break;
            }else{
              res.status(200).json({message:'You do not have access'})
              return;
            }
          }
          break;
        case 'DELETE':
          for (let i = 0; i < req.permission.length; i++){
            const permission = req.permission[i];
            if(permission.CanDelete === 1){
              next();
              break;
            }else{
              res.status(200).json({message:'You do not have access'})
              return;
            }
          }
          break;
        default:
          break;
      }

      // console.log('req.method:', req.method);
      // console.log('req.permission', req.permission);

      // for (let i = 0; i < req.permission.length; i++) {
      //   const permission = req.permission[i];
      //   console.log(`Permission ID: ${permission.PermissionID}`);
      //   console.log(`Module Name: ${permission.ModuleName}`);
      //   console.log(`Can View: ${permission.CanView}`);
      //   console.log(`Can Edit: ${permission.CanEdit}`);
      //   console.log(`Can Delete: ${permission.CanDelete}`);
      //   console.log(`Can Export: ${permission.CanExport}`);
      //   console.log('------------------');
      // }
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
  // console.log('req.permission', req.permission)
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
