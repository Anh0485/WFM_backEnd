import db, { sequelize } from "../src/models/index.js";
import asyncHandler from "../middleware/asyncHandler.js";
import { QueryTypes, json } from "sequelize";

// @desc get all module
// @routes POST api/superadmin/module/module
// @access private

const getAllModule = asyncHandler(async (req, res) => {
  try {
    const allModule = await db.Module.findAll({
      attributes: ["ModuleName", "path", "title", "icon", "class"],
    });

    res.status(200).json({
      message: "get all module successfully",
      allModule,
    });
  } catch (e) {
    console.error(e);
  }
});

// @desc get module where ModuleName
// @routes GET api/module
// @access private

const getModuleName = asyncHandler(async (req, res) => {
  try {
    const ModuleName = req.ModuleName;
    const getModules = [];
    const id = req.id;
    for (const moduleName of ModuleName) {
      const getModuleNames = await sequelize.query(
        `SELECT m.ModuleName,  m.path, m.icon, m.title, m.class, pd.CanAdd, pd.CanView, pd.CanEdit, pd.CanDelete, pd.CanExport
              FROM permissiondetails as pd 
              JOIN modules as m on m.ModuleID = pd.ModuleID
              JOIN permissions as per on per.PermissionID = pd.PermissionID
              where m.ModuleName = :ModuleName and per.AccountID = :id`,
        {
          type: QueryTypes.SELECT,
          replacements: {
            ModuleName: moduleName,
            id: id
          },
        }
      );
      getModules.push(...getModuleNames);
    }
    console.log("getModules", getModules);

    const formatModule = getModules.map((item) => {
      return {
        path: item.path,
        title: item.title,
        icon: item.icon,
        class: item.class,
        // permission:{
        //     CanAdd: item.CanAdd,
        //     CanView: item.CanView,
        //     CanEdit: item.CanEdit,
        //     CanDelete: item.CanDelete,
        //     CanExport: item.CanExport,
        // }
      };
    });

    res.status(200).json({
      message: "get all module by ModuleName",
      modules: formatModule,
    });
  } catch (e) {
    console.error(e);
  }
});

// @desc get permission_sub of Module
// @routes GET api/module/permission
// @access private

const getPermissionSub = asyncHandler(async(req,res)=>{
  try{
    const ModuleName = req.ModuleName;
    const getPermissions = [];
    const id = req.id;
    for (const moduleName of ModuleName) {
      const getPermission = await sequelize.query(
        `SELECT m.ModuleName, pd.CanAdd, pd.CanView, pd.CanEdit, pd.CanDelete, pd.CanExport
              FROM permissiondetails as pd 
              JOIN modules as m on m.ModuleID = pd.ModuleID
              JOIN permissions as per on per.PermissionID = pd.PermissionID
              where m.ModuleName = :ModuleName and per.AccountID = :id`,
        {
          type: QueryTypes.SELECT,
          replacements: {
            ModuleName: moduleName,
            id: id
          },
        }
      );
      getPermissions.push(...getPermission);
    }
    console.log("getPermission", getPermissions);

    res.status(200).json({
      message: "get all module by ModuleName",
      modules: getPermissions,
    });
  }catch(e){
    console.error(e)
  }
})

export { getAllModule, getModuleName, getPermissionSub };
