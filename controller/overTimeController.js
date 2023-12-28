import db, { sequelize } from "../src/models/index.js";
import asyncHandler from "../middleware/asyncHandler.js";
import { QueryTypes } from "sequelize";

// @desc created overtime
// @routes POST api/overtime/createdOT
// @access private

const createdOT = asyncHandler(async (req, res) => {
  const createdBy = req.createdBy;
  const { EmployeeID, OvertimeDate, OvertimeHour, Reason } = req.body;
  try {
    const createOT = await db.Overtime.create({
      EmployeeID: EmployeeID,
      OvertimeDate: OvertimeDate,
      OvertimeHour: OvertimeHour,
      Reason: Reason,
      Status: 'pending',
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

const getAllOT = asyncHandler(async(req,res)=>{
  try{
    const overtime = await sequelize.query(`select ot.OverTimeID, ot.EmployeeID, CONCAT(u.LastName, ' ', u.FirstName) as FullName, ot.OvertimeHour, ot.OvertimeDate, ot.Status
    from overtimes as ot
    join employees as e on e.EmployeeID = ot.EmployeeID
    join users as u on e.UserID = u.UserID`,{
      type: QueryTypes.SELECT,
    })

    res.status(200).json({
      message:'get all ot successsfully',
      overtime
    })

  }catch(e){
    console.error(e)
  }
})


export { createdOT, getAllOT };
