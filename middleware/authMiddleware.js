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
      
      req.createdBy = decoded.id;

      req.ModuleName = decoded.permission.map(item => item.ModuleName);

      console.log('req.ModuleName', req.ModuleName)

      console.log('req.ModuleTenat', decoded.permission[0].ModuleName)

      console.log('decoded',decoded.permission[0].permission_sub)
      

      //check permission method
      const methodType = req.method;
      switch(methodType){
        case 'POST':
          for (let i = 0; i < decoded.permission.length; i++){
            const permission = decoded.permission[i].permission_sub;
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
          for (let i = 0; i < decoded.permission.length; i++){
            const permission = decoded.permission[i].permission_sub;
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
          for (let i = 0; i < decoded.permission.length; i++){
            const permission = decoded.permission[i].permission_sub;
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
          for (let i = 0; i < decoded.permission.length; i++){
            const permission = decoded.permission[i].permission_sub;
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
