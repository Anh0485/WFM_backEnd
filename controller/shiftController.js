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

export { createdShift, updatedShift, deletedShift, getAllShift, getShiftByID };
