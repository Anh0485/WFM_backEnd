import db, { sequelize } from "../src/models/index.js";
import asyncHandler from "../middleware/asyncHandler.js";
import { QueryTypes } from "sequelize";

// @desc created overtime
// @routes POST api/overtime/createdOT
// @access private

const createdOT = asyncHandler(async (req, res) => {
  const createdBy = req.createdBy;
  const { OvertimeDate, OvertimeHour, Reason } = req.body;
  try {
    const id = req.id;
    const employeeID = await sequelize.query(
      `SELECT e.EmployeeID
    FROM employees as e
    JOIN accounts as a on a.AccountID = e.AccountID
    where a.AccountID = :id
    `,
      {
        type: QueryTypes.SELECT,
        replacements: {
          id: id,
        },
      }
    );
    console.log('EmployeeID:', employeeID)

    const EmployeeID = employeeID[0].EmployeeID
  
    const createOT = await db.Overtime.create({
      EmployeeID: EmployeeID,
      OvertimeDate: OvertimeDate,
      OvertimeHour: OvertimeHour,
      Reason: Reason,
      Status: "pending",
      createdBy: createdBy,
    });
    if (createOT) {
      res.status(200).json({
        message: "created OT successfully",
        createOT,
      });
    } else {
      res.status(500).json({
        message: "Failed to create OT",
      });
    }
  } catch (e) {
    console.log(e);
  }
});

// @desc get all overtime
// @routes GET api/overtime
// @access private

const getAllOT = asyncHandler(async (req, res) => {
  try {
    const overtime = await sequelize.query(
      `select ot.OverTimeID, ot.EmployeeID, CONCAT(u.LastName, ' ', u.FirstName) as FullName, ot.OvertimeHour, date_format(ot.OvertimeDate,'%d/%m/%Y') as OvertimeDate , ot.Status, ot.Reason
      from overtimes as ot
      join employees as e on e.EmployeeID = ot.EmployeeID
      join users as u on e.UserID = u.UserID`,
      { 
        type: QueryTypes.SELECT,
      }
    );

    res.status(200).json({
      message: "get all ot successsfully",
      overtime,
    });
  } catch (e) {
    console.error(e);
  }
});


// @desc approve Request
// @routes GET api/overtime/request/:id
// @access private

const reviewRequest = asyncHandler(async(req,res)=>{
  const {Status} = req.body;
  try{
    const {id} = req.params;
    console.log('id', id)
    const approvedID = req.createdBy;
    const request = await db.Overtime.findOne({
      attributes: ["OverTimeID"],
      where: {
        OverTimeID: id,
      },
    })
    if(request){
      const updateRequest = await sequelize.query(
        `update overtimes 
        set Status = :Status , ApprovedBy = :approvedID  
        where OverTimeID = :id 
        `,{
        replacements:{
          id: id,
          Status: Status, 
          approvedID: approvedID
        }
      })
      res.status(200).json({
        message:'review request successfully', updateRequest
      });
    }else{
      res.status(400).json({
        message:'request isnot exits'
      })
    }
  }catch(e){
    console.error(e)
  }
  
})

// @desc delete overtime
// @routes delete api/overtime/:id
// @access private

const deleteOT = asyncHandler(async(req,res)=>{
  try{
    const {id} = req.params;

    const ot = await db.Overtime.findOne({
      attributes: ["OverTimeID"],
      where: {
        OverTimeID: id,
      },
    })

    if(ot){
      const deleteOvertime = await sequelize.query(`delete from overtimes where OverTimeID = :id`,{
        replacements: {
          id: id
        },
        type: QueryTypes.DELETE
      })
      res.status(200).json({
        message:'delete overtime successfully'
      })
    }else{
      res.status(400).json({message:'OverTime isnot exits'})
    }


  }catch(e){
    console.error(e)
  }
})

// @desc get overtime with Status = 'peding'
// @routes GET api/overtime/pending
// @access private

const pendingOT = asyncHandler(async(req, res)=>{
  try{
    const pending  = await sequelize.query(`select ot.OverTimeID, ot.EmployeeID, CONCAT(u.LastName, ' ', u.FirstName) as FullName, ot.OvertimeHour, date_format(ot.OvertimeDate,'%d/%m/%Y') as OvertimeDate , ot.Status, ot.Reason
    from overtimes as ot
    join employees as e on e.EmployeeID = ot.EmployeeID
    join users as u on e.UserID = u.UserID
    where ot.Status = 'pending'`,
    { 
      type: QueryTypes.SELECT,
    });

    res.status(200).json({message:'get ot with pending status',pending })
  }catch(e){
    console.error(e)
  }
})

// @desc get overtime with Status = 'approved'
// @routes GET api/overtime/approved
// @access private

const approvedOT = asyncHandler(async(req,res)=>{
  try{
    const approved  = await sequelize.query(`select ot.OverTimeID, ot.EmployeeID, CONCAT(u.LastName, ' ', u.FirstName) as FullName, ot.OvertimeHour, date_format(ot.OvertimeDate,'%d/%m/%Y') as OvertimeDate , ot.Status, ot.Reason
    from overtimes as ot
    join employees as e on e.EmployeeID = ot.EmployeeID
    join users as u on e.UserID = u.UserID
    where ot.Status = 'approved'`,
    { 
      type: QueryTypes.SELECT,
    });

    res.status(200).json({message:'get ot with approved status', approved })

  }catch(e){
    console.error(e)
  }
})


// @desc get overtime with Status = 'reject'
// @routes GET api/overtime/approved
// @access private

const rejectOT = asyncHandler(async(req,res)=>{
  try{
    const reject  = await sequelize.query(`select ot.OverTimeID, ot.EmployeeID, CONCAT(u.LastName, ' ', u.FirstName) as FullName, ot.OvertimeHour, date_format(ot.OvertimeDate,'%d/%m/%Y') as OvertimeDate , ot.Status, ot.Reason
    from overtimes as ot
    join employees as e on e.EmployeeID = ot.EmployeeID
    join users as u on e.UserID = u.UserID
    where ot.Status = 'reject'`,
    { 
      type: QueryTypes.SELECT,
    });

    res.status(200).json({message:'get ot with reject status', reject })

  }catch(e){
    console.error(e)
  }
})

// @desc get total overtime hour
// @routes GET api/overtime/totalOvertimeHour
// @access private

const getTotalOvertimeHour = asyncHandler(async(req, res)=>{
  try{
    const roleID = req.RoleID;
    const {startDate, endDate} = req.query;

    if(roleID ===1){
      const overtimeHour = await sequelize.query(`
      select e.EmployeeID, CONCAT(u.firstName, ' ', u.lastName) AS fullname , hour(SEC_TO_TIME(SUM(TIME_TO_SEC(o.overtimeHour))))  as totalOvertimeHour
      from employees as e
      join overtimes as o on e.EmployeeID = o.EmployeeID
      join users as u on u.UserID = e.UserID
      join tenants as t on t.TenantID = e.TenantID
      where o.Status = 'approved' AND o.OvertimeDate between :startDate and :endDate
      GROUP BY e.EmployeeID
      `,{
        type: QueryTypes.SELECT,
        replacements:{
          startDate : startDate,
            endDate: endDate
        }
      })
      res.status(200).json({
        errCode:0,
        overtimeHour
      })
    }else{
      const tenantName = req.TenantName;
      const overtimeHour = await sequelize.query(`
      select e.EmployeeID, CONCAT(u.firstName, ' ', u.lastName) AS fullname , hour(SEC_TO_TIME(SUM(TIME_TO_SEC(o.overtimeHour))))  as totalOvertimeHour
from employees as e
join overtimes as o on e.EmployeeID = o.EmployeeID
join users as u on u.UserID = e.UserID
join tenants as t on t.TenantID = e.TenantID
where o.Status = 'approved' AND o.OvertimeDate between :startDate and :endDate and t.TenantName= :tenantName
GROUP BY e.EmployeeID;
      `,{
        type: QueryTypes.SELECT,
        replacements:{
          startDate: startDate,
          endDate: endDate,
          tenantName: tenantName
        }
      })
      res.status(200).json({
        errCode: 200,
        overtimeHour
      })
    }
  }catch(e){
    console.error(e)
  }
})




export { createdOT, 
  getAllOT, 
  reviewRequest, 
  deleteOT, 
  pendingOT, 
  approvedOT, 
  rejectOT,
  getTotalOvertimeHour
 };
