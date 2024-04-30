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
    const createdBy = req.createdBy;

    const createShift = await sequelize.query(
      "INSERT INTO shifts (ShiftTypeName, ShiftStart, ShiftEnd, createdBy) VALUES (:ShiftTypeName, :ShiftStart, :ShiftEnd, :createdBy)",
      {
        replacements: {
          ShiftTypeName,
          ShiftStart,
          ShiftEnd,
          createdBy,
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
    // const allShift = await db.Shift.findAll({
    //   attributes: [
    //     "ShiftTypeID",
    //     "ShiftTypeName",
    //     "ShiftStart",
    //     "ShiftEnd",
    //     "createdBy",
    //     "updatedBy",
    //     "createdAt"
    //   ],
    // });

    const allShift = await sequelize.query(
      `SELECT s.ShiftTypeID, s.ShiftTypeName, s.ShiftStart, s.ShiftEnd, DATE_FORMAT(s.createdAt, '%d-%m-%Y') AS createdAt,
    CONCAT(u.FirstName, ' ', u.LastName) AS createdBy
FROM shifts AS s
JOIN accounts AS a ON s.createdBy = a.AccountID
JOIN employees as e on e.AccountID = a.AccountID
JOIN users AS u ON e.UserID = u.UserID`,
      {
        type: QueryTypes.SELECT,
      }
    );

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
    const { EmployeeID, ShiftTypeID, WorkDate, isScheduled, ChannelID } =
      req.body;
    const createdBy = req.createdBy;

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
        createdBy: createdBy,
        ChannelID: ChannelID,
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
    console.log("id", req.params.id);
    const wschedule = await db.WorkSchedule.findOne({
      attributes: [
        "ScheduleID",
        "ShiftTypeID",
        "workdate",
        "isScheduled",
        "ChannelID",
      ],
      where: {
        ScheduleID: id,
      },
    });

    if (wschedule) {
      console.log("workdate", req.body.WorkDate);
      console.log("workdate", req.body.ShiftTypeID);

      const updatedWSchedule = await db.WorkSchedule.update(
        {
          ShiftTypeID: req.body.ShiftTypeID || wschedule.ShiftTypeID,
          workdate: req.body.WorkDate || wschedule.workdate,
          isScheduled: req.body.isScheduled || wschedule.isScheduled,
          ChannelID: req.body.ChannelID || wschedule.ChannelID,
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

const deleteWSchedule = asyncHandler(async (req, res) => {
  try {
    const id = req.params.id;
    const wschedule = await db.WorkSchedule.findOne({
      attributes: ["ScheduleID"],
      where: {
        ScheduleID: id,
      },
    });

    console.log(wschedule);

    if (!wschedule) {
      res.status(200).json({
        message: "WSchedule isn't exits",
      });
    } else {
      await db.WorkSchedule.destroy({
        where: {
          ScheduleID: wschedule.ScheduleID,
        },
      });
    }
    res.status(200).json({ message: "Delete wschedule successfully" });
  } catch (e) {
    console.error(e);
  }
});

// @desc get all WSchedule
// @routes GET api/shift/wschedule
// @access private/ superadmin

const getAllWSchedule = asyncHandler(async (req, res) => {
  try {
    const roleid = req.RoleID;
    console.log("roleid", roleid);
    if (roleid === 1) {
      const allWSchedule = await sequelize.query(
        `SELECT w.ScheduleID, e.EmployeeID, CONCAT(u.FirstName, ' ', u.LastName) AS FullName,s.ShiftTypeID ,s.ShiftStart, s.ShiftEnd,
        date_format(w.workdate, '%m-%d-%Y') as workdate, w.isScheduled,c.ChannelID,c.ChannelName, CONCAT(u2.FirstName, ' ', u2.LastName) AS CreatedBy, 
            DATE_FORMAT(w.createdAt, '%d-%m-%Y') AS createdAt
            FROM workschedules AS w
            JOIN employees AS e ON w.EmployeeID = e.EmployeeID
            JOIN users AS u ON e.UserID = u.UserID
            JOIN shifts AS s ON s.ShiftTypeID = w.ShiftTypeID
            JOIN employees AS e2 ON w.createdBy = e2.AccountID
            JOIN users AS u2 ON e2.UserID = u2.UserID
            jOIN channels AS c on w.ChannelID = c.ChannelID`,
        {
          type: QueryTypes.SELECT,
        }
      );

      res.status(200).json({
        message: "get all wschedule successfully by superadmin",
        allWSchedule,
      });
    } else {
      const tenantName = req.TenantName;
      const allWSchedule = await sequelize.query(
        `SELECT w.ScheduleID, e.EmployeeID, CONCAT(u.FirstName, ' ', u.LastName) AS FullName,s.ShiftTypeID ,s.ShiftStart, s.ShiftEnd,
        date_format(w.workdate, '%m-%d-%Y') as workdate, w.isScheduled,c.ChannelID,c.ChannelName, CONCAT(u2.FirstName, ' ', u2.LastName) AS CreatedBy, 
            DATE_FORMAT(w.createdAt, '%d-%m-%Y') AS createdAt
            FROM workschedules AS w
            JOIN employees AS e ON w.EmployeeID = e.EmployeeID
            JOIN users AS u ON e.UserID = u.UserID
            JOIN shifts AS s ON s.ShiftTypeID = w.ShiftTypeID
            JOIN employees AS e2 ON w.createdBy = e2.AccountID
            JOIN users AS u2 ON e2.UserID = u2.UserID
            jOIN channels AS c on w.ChannelID = c.ChannelID
            join tenants as t on t.TenantID = e.TenantID
            WHERE t.TenantName = :tenantName`,
        {
          type: QueryTypes.SELECT,
          replacements: {
            tenantName: tenantName,
          },
        }
      );
      res.status(200).json({
        message: "get all wschedule successfully",
        allWSchedule,
      });
    }
  } catch (e) {
    console.log(e);
  }
});

// @desc get total ontime  today
// @routes GET api/workschedule/ontime
// @access private/ supervisor

const formatDate = (date) => {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const onTime = asyncHandler(async (req, res) => {
  try {
    const date = new Date();
    const now = formatDate(date);
    const attent = await sequelize.query(
      `
    SELECT COUNT(*) AS total_ontime
		from workschedules as w
        where w.workdate = :date;
    `,
      {
        replacements: {
          date: now,
        },
        type: QueryTypes.SELECT,
      }
    );

    res.status(200).json({
      mesasge: "ok",
      attent,
    });
  } catch (e) {
    console.error(e);
  }
});

// @desc get total working hours
// @routes GET api/workschedule/ontime
// @access private/ /superadminadmin/supervisor

const getTotalWorkHour = asyncHandler(async (req, res) => {
  try {
    const roleID = req.RoleID;
    const {startDate} = req.query;
    const {endDate} = req.query;
    if (roleID === 1) {
      console.log(startDate, endDate);
      const workHour = await sequelize.query(
        `
        select w.EmployeeID,CONCAT(u.firstName, ' ', u.lastName) AS fullname, c.ChannelName,
        sum(Hour(TIMEDIFF(ShiftEnd, ShiftStart))) AS TOTALWORKINGHOURS
        from workschedules as w
        join employees as e on w.EmployeeID = e.EmployeeID
        join shifts as s on w.ShiftTypeID = s.ShiftTypeID
        join users as u on u.UserID = e.UserID
        join tenants as t on t.TenantID = e.TenantID
        join channels as c on c.ChannelID = w.ChannelID
        WHERE w.workdate BETWEEN :startDate AND :endDate
        GROUP BY w.EmployeeID;
      `,
        {
          type: QueryTypes.SELECT,
          replacements: {
            startDate : startDate,
            endDate: endDate
          },
        }
      );
      res.status(200).json({
        errCode: 0,
        workHour,
      });
    } else {
      const tenantName = req.TenantName;
      const workHour = await sequelize.query(
        `
      select w.EmployeeID,CONCAT(u.firstName, ' ', u.lastName) AS fullname, c.ChannelName,
sum(Hour(TIMEDIFF(ShiftEnd, ShiftStart))) AS TOTALWORKINGHOURS
from workschedules as w
join employees as e on w.EmployeeID = e.EmployeeID
join shifts as s on w.ShiftTypeID = s.ShiftTypeID
join users as u on u.UserID = e.UserID
join tenants as t on t.TenantID = e.TenantID
join channels as c on c.ChannelID = w.ChannelID
WHERE w.workdate BETWEEN :startDate AND :endDate and t.TenantName = :tenantName 
GROUP BY w.EmployeeID
      `,
        {
          type: QueryTypes.SELECT,
          replacements: {
            startDate : startDate,
            endDate : endDate,
            tenantName: tenantName,
          },
        }
      );
      res.status(200).json({
        errCode: 0,
        workHour,
      });
    }
  } catch (e) {
    console.error(e);
  }
});


// @desc get total working hours by filter employee, startDate, endDate, ChannelD
// @routes GET api/workschedule/totalWorkHour?EmployeeID=...&startDate=...&endDate=...&ChannelID=...
// @access private/ /superadminadmin/supervisor

const getTotalWorkHourWithAllFilter = asyncHandler(async(req,res)=>{
  try{

    const{ EmployeeID, startDate, endDate, ChannelID} = req.query;
    const roleID = req.RoleID;
    const tenantName = req.TenantName;

    if(roleID ===1 ){
      console.log('employeeID', EmployeeID)
      const totalNumberWorkHours = await sequelize.query(`
      select w.EmployeeID,CONCAT(u.firstName, ' ', u.lastName) AS fullname, c.ChannelName,
      sum(Hour(TIMEDIFF(ShiftEnd, ShiftStart))) AS TOTALWORKINGHOURS
      from workschedules as w
      join employees as e on w.EmployeeID = e.EmployeeID
      join shifts as s on w.ShiftTypeID = s.ShiftTypeID
      join users as u on u.UserID = e.UserID
      join tenants as t on t.TenantID = e.TenantID
      join channels as c on c.ChannelID = w.ChannelID
      WHERE e.EmployeeID = :EmployeeID AND w.workdate BETWEEN :startDate AND :endDate AND c.ChannelID = :ChannelID
      GROUP BY w.EmployeeID
      `,{
        type: QueryTypes.SELECT,
        replacements:{
          EmployeeID: EmployeeID,
          startDate: startDate,
          endDate: endDate,
          ChannelID: ChannelID
        }
      });
      res.status(200).json({
        errCode:0,
        totalNumberWorkHours
      })
    } else{
      const totalNumberWorkHours = await sequelize.query(`
      select w.EmployeeID,CONCAT(u.firstName, ' ', u.lastName) AS fullname, c.ChannelName,
      sum(Hour(TIMEDIFF(ShiftEnd, ShiftStart))) AS TOTALWORKINGHOURS
      from workschedules as w
      join employees as e on w.EmployeeID = e.EmployeeID
      join shifts as s on w.ShiftTypeID = s.ShiftTypeID
      join users as u on u.UserID = e.UserID
      join tenants as t on t.TenantID = e.TenantID
      join channels as c on c.ChannelID = w.ChannelID
      WHERE e.EmployeeID = :EmployeeID AND w.workdate BETWEEN :startDate AND :endDate AND c.ChannelID = :ChannelID and t.TenantName = :tenantName
      GROUP BY w.EmployeeID
      `,{
        type: QueryTypes.SELECT,
        replacements:{
          EmployeeID: EmployeeID,
          startDate: startDate,
          endDate: endDate,
          ChannelID: ChannelID,
          tenantName:tenantName
        }
      })
      res.status(200).json({
        errCode: 0,
        totalNumberWorkHours
      })
    
    }
  
    

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
  deleteWSchedule,
  getAllWSchedule,
  onTime,
  getTotalWorkHour,
  getTotalWorkHourWithAllFilter
};
