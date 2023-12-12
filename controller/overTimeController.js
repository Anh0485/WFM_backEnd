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



export { createdOT };
