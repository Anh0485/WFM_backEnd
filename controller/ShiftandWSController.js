import db, { sequelize } from "../src/models/index.js";
import asyncHandler from "../middleware/asyncHandler.js";
import { QueryTypes } from "sequelize";
import { assuredworkloads } from "googleapis/build/src/apis/assuredworkloads/index.js";

// @desc created tenants
// @routes POST api/shift/createdShift
// @access private

const createdShift = asyncHandler(async (req, res) => {
  try {
    const { ShiftTypeName, ShiftStart, ShiftEnd } = req.body;

    const createShift = await sequelize.query(
      "INSERT INTO shifts (ShiftTypeName, ShiftStart, ShiftEnd) VALUES (:ShiftTypeName, :ShiftStart, :ShiftEnd)",
      {
        replacements: {
          ShiftTypeName,
          ShiftStart,
          ShiftEnd,
        },
      }
    );

    if (createShift) {
      res
        .status(200)
        .json({ message: "created shift successfully", createShift });
    } else {
      res.status(401).json({ message: "create shift fail" });
    }
  } catch (e) {
    console.log(`Error by ${e}`);
  }
});

// @desc update shift
// @routes PUT api/shift/:id
// @access private

const updatedShift = asyncHandler(async (req, res) => {
  const { ShiftTypeName, ShiftStart, ShiftEnd } = req.body;
  try {
    const id = req.params.id;
    const findShiftID = await db.Shift.findOne({
      attributes: ["ShiftTypeID", "ShiftTypeName", "ShiftStart", "ShiftEnd"],
      where: {
        ShiftTypeID: id,
      },
    });

    if (findShiftID) {
      const updateShift = await db.Shift.update(
        {
          ShiftTypeName: ShiftTypeName || findShiftID.ShiftTypeName,
          ShiftStart: ShiftStart || findShiftID.ShiftStart,
          ShiftEnd: ShiftEnd || findShiftID.ShiftEnd,
        },
        {
          where: {
            ShiftTypeID: findShiftID.ShiftTypeID,
          },
        }
      );
      res.status(200).json({ message: "Update Shift success", updateShift });
    } else {
      res.status(400).json({ message: "Shift Type doestn't exits" });
    }
  } catch (e) {
    console.log(`Error by ${e}`);
  }
});

// @desc delete shift
// @routes DELETE api/shift/:id
// @access private

const deletedShift = asyncHandler(async (req, res) => {
  const id = req.params.id;
  try {
    const shift = await db.Shift.findOne({
      attributes: ["ShiftTypeID"],
      where: {
        ShiftTypeID: id,
      },
    });
    console.log("shift:", shift);
    if (shift) {
      await db.Shift.destroy({
        where: { ShiftTypeID: shift.ShiftTypeID },
      });

      res.status(200).json({
        message: "Delete shift successfully",
      });
    } else {
      res.status(200).json({ message: "Shift isn't exist" });
    }
  } catch (e) {
    console.log(`Error by: ${e}`);
  }
});

// @desc get all shift
// @routes GET api/shift
// @access private

const getAllShift = asyncHandler(async (req, res) => {
  try {
    const allShift = await db.Shift.findAll({
      attributes: [
        "ShiftTypeID",
        "ShiftTypeName",
        "ShiftStart",
        "ShiftEnd",
        "createdBy",
        "updatedBy",
      ],
    });

    res.status(200).json({ message: "get all shift successfully", allShift });
  } catch (e) {
    console.log(`Error by ${e}`);
  }
});

// @desc get shift by id
// @routes GET api/shift/:id
// @access private

const getShiftByID = asyncHandler(async (req, res) => {
  const id = req.params.id;
  try {
    const shift = await db.Shift.findOne({
      attributes: ["ShiftTypeID", "ShiftTypeName", "ShiftStart", "ShiftEnd"],
      where: {
        ShiftTypeID: id,
      },
    });

    if (shift) {
      res.status(200).json({ message: "get shift by id successfully", shift });
    } else {
      res.status(400).json({ message: "Shift isn't exist" });
    }
  } catch (e) {
    console.log(`Error by: ${e}`);
  }
});

// @desc created work schedule
// @routes POST api/workschedule/createdWS
// @access private

const createdWorkSchedule = asyncHandler(async (req, res) => {
  try {
    const { EmployeeID, ShiftTypeID, WorkDate, isScheduled } = req.body;

    const checkScheduleByEmployeeID = await sequelize.query(
      `SELECT Count(*) 
      FROM workschedules 
      WHERE workdate= :WorkDate
      AND ShiftTypeID = :ShiftTypeID 
      AND EmployeeID = :EmployeeID`,
      {
        replacements: {
          WorkDate: WorkDate,
          ShiftTypeID: ShiftTypeID,
          EmployeeID: EmployeeID,
        },
        type: QueryTypes.SELECT,
      }
    );
    console.log("checkScheduleByEmployeeID: ", checkScheduleByEmployeeID);

    const count = checkScheduleByEmployeeID[0]["Count(*)"];
    console.log(count);

    if (count === 0) {
      const createdworkSchedule = await db.WorkSchedule.create({
        EmployeeID: EmployeeID,
        ShiftTypeID: ShiftTypeID,
        workdate: WorkDate,
        isScheduled: isScheduled,
      });
      res.status(200).json({
        message: "create schedule successfully",
        createdworkSchedule,
      });
    } else {
      res.json({
        message: "schedule already exists.",
      });
    }
  } catch (e) {
    console.error(e);
  }
});

// @desc updated WSchedule
// @routes PUT api/shift/wschedule/:id
// @access private/ superadmin

const updateWSchedule = asyncHandler(async (req, res) => {
  try {
    const id = req.params.id;

    const wschedule = await db.WorkSchedule.findOne({
      attributes: ["ScheduleID", "ShiftTypeID", "workdate", "isScheduled"],
      where: {
        ScheduleID: id,
      },
    });

    if (wschedule) {
      const updatedWSchedule = await db.WorkSchedule.update(
        {
          ShiftTypeID: req.body.ShiftTypeID || wschedule.ShiftTypeID,
          workdate: req.body.workdate || wschedule.workdate,
          isScheduled: req.body.isScheduled || wschedule.isScheduled,
        },
        {
          where: {
            ScheduleID: wschedule.ScheduleID,
          },
        }
      );
      res.status(200).json({
        message: "updated wschedule successfully",
        updatedWSchedule,
      });
    } else {
      res.status(404).json({ message: "Work Schedule's not found" });
    }
  } catch (e) {
    console.error(e);
  }
});

// @desc delete WSchedule
// @routes DELETE api/shift/wschedule/:id
// @access private/ superadmin

const deleteWSchedule = asyncHandler(async(req,res)=>{
  try{

    const id = req.params.id;
    const wschedule = await db.WorkSchedule.findOne({
      attributes:['ScheduleID'],
      where:{
        ScheduleID: id
      }
    });

    console.log(wschedule);

    if(!wschedule){
      res.status(200).json({
        message:"WSchedule isn't exits"
      })
    }else{
      await db.WorkSchedule.destroy({
        where:{
          ScheduleID: wschedule.ScheduleID
        }
      })
    }
    res.status(200).json({ message: "Delete wschedule successfully" });
  }catch(e){
    console.error(e)
  }
})





export {
  createdShift,
  updatedShift,
  deletedShift,
  getAllShift,
  getShiftByID,
  createdWorkSchedule,
  updateWSchedule,
  deleteWSchedule
};
