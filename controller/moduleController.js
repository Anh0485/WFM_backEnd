import db, { sequelize } from "../src/models/index.js";
import asyncHandler from "../middleware/asyncHandler.js";
import { QueryTypes, json } from "sequelize";

// @desc get all module
// @routes POST api/superadmin/module/module
// @access private

const getAllModule = asyncHandler(async (req, res) => {
  try {
    const allModule = await db.Module.findAll({
      attributes: ["ModuleID","ModuleName", "path", "title", "icon", "class"],
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

// @desc get profile user at permission
// @routes GET api/module/accountProfile
// @access private

const getProfileAccount = asyncHandler(async(req,res)=>{
  try{
    const user = await sequelize.query(`
    select a.AccountID, concat(u.LastName,' ', u.FirstName) as FullName, a.username, r.RoleName, t.TenantName
    from employees as e
    join tenants as t on t.TenantID = e.TenantID
    join users as u on e.UserID = u.UserID
    join accounts as a on a.AccountID = e.AccountID
    join roles as r on r.RoleID = e.RoleID;
    `,{
      type: QueryTypes.SELECT,
    });
    
    res.status(200).json({
      errCode: 0,
      user
    })
  }catch(e){
    console.error(e)
  }
})

// @desc get module and permission by AccountID
// @routes GET api/module/moduleAndPermissionByID
// @access private

const getModuleAndPermission = asyncHandler(async(req,res)=>{
  try{
    const {AccountID} = req.query;
    const moduleAndPermission = await sequelize.query(`
    SELECT permissions.PermissionID,modules.ModuleName, permissiondetails.CanAdd, permissiondetails.CanView, permissiondetails.CanEdit, permissiondetails.CanDelete, permissiondetails.CanExport
    FROM accounts
    JOIN permissions ON accounts.AccountID = permissions.AccountID
    JOIN permissiondetails ON permissiondetails.PermissionID = permissions.PermissionID
    JOIN modules ON permissiondetails.ModuleID = modules.ModuleID
    where accounts.AccountID = :AccountID`,{
      type: QueryTypes.SELECT,
      replacements:{
        AccountID: AccountID
      }
    })
    res.status(200).json({
      errCode: 0,
      moduleAndPermission
    })

  }catch(e){
    console.error(e)
  }
})

// @desc create permission
// @routes GET api/module/createPermission
// @access private

const createPermission = asyncHandler(async(req,res)=>{
  try{
    const {Description, 
      AccountID, 
      ModuleID, 
      CanAdd, 
      CanView, 
      CanEdit ,
      CanDelete, 
      CanExport} = req.body;
    
    const permissions = await sequelize.query(`
    INSERT INTO permissions (Description, AccountID, isDeleted) 
    VALUES (:Description, :AccountID, 0);
    `,{
      type: QueryTypes.INSERT,
      replacements:{
        Description: Description,
        AccountID: AccountID
      }
    })
    const PermissionID = permissions[0];
    console.log('per:' ,permissions[0])
    const permissionDetail = await sequelize.query(`
    INSERT INTO permissiondetails (PermissionID,ModuleID, 
      CanAdd, CanView, CanEdit ,CanDelete, 
      CanExport, isDeleted) 
    VALUE (:PermissionID, :ModuleID, :CanAdd,:CanView,
      :CanEdit,:CanDelete,:CanExport, 0);    
    `,{
      type: QueryTypes.INSERT,
      replacements:{
        PermissionID: PermissionID,
        ModuleID: ModuleID,
        CanAdd: CanAdd,
        CanView: CanView,
        CanEdit: CanEdit,
        CanDelete: CanDelete,
        CanExport: CanExport
      }
    })
    if(permissions.length === 0 && permissionDetail.length ===0){
      res.status(200).json({
        errCode: -2,
        message:'create permission unsuccessfully'
      })
    }else{
      res.status(200).json({
        errCode:0,
        message:"create permission successfully",
        permissions,
        permissionDetail
      })  
    }
  }catch(e){
    console.error(e)
  }
})


export { getAllModule, 
  getModuleName, 
  getPermissionSub, 
  getProfileAccount,
  getModuleAndPermission,
  createPermission
 };
