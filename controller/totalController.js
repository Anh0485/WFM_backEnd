import db, { sequelize } from "../src/models/index.js";
import asyncHandler from "../middleware/asyncHandler.js";
import { QueryTypes } from "sequelize";

// @desc get total agent
// @routes GET api/total/agent
// @access private

const totalAgent = asyncHandler(async (req, res) => {
  try {
    const agent = await sequelize.query(
      `SELECT COUNT(*) AS total_agents
        FROM employees as e
        join roles as r on r.RoleID = e.RoleID
        where r.RoleName = 'agent'`,
      {
        type: QueryTypes.SELECT,
      }
    );

    res.status(200).json({
      message: "get total agent successfully",
      agent,
    });
  } catch (e) {
    console.error(e);
  }
});

// @desc get total supervisor
// @routes GET api/total/supervisor
// @access private

const totalSupervisor = asyncHandler(async (req, res) => {
  try {
    const supervisor = await sequelize.query(
      `SELECT COUNT(*) AS total_supervisor
        FROM employees as e
        join roles as r on r.RoleID = e.RoleID
        where r.RoleName = 'supervisor'`,
      {
        type: QueryTypes.SELECT,
      }
    );

    res.status(200).json({
      message: "get total supervisor successfully",
      supervisor,
    });
  } catch (e) {
    console.error(e);
  }
});

// @desc  getTotalWorkHourandOvertimeHour
// @routes GET api/total/getTotalWorkHourandOvertimeHour
// @access private/ /superadminadmin/supervisor

const getTotalWorkHourandOvertimeHour = asyncHandler(async (req, res) => {
  try {
    const roleID = req.RoleID;
    const { startDate } = req.query;
    const { endDate } = req.query;
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
            startDate: startDate,
            endDate: endDate,
          },
        }
      );
      const overtimeHour = await sequelize.query(
        `
        select e.EmployeeID, CONCAT(u.firstName, ' ', u.lastName) AS fullname , hour(SEC_TO_TIME(SUM(TIME_TO_SEC(o.overtimeHour))))  as totalOvertimeHour
        from employees as e
        join overtimes as o on e.EmployeeID = o.EmployeeID
        join users as u on u.UserID = e.UserID
        join tenants as t on t.TenantID = e.TenantID
        where o.Status = 'approved' AND o.OvertimeDate between :startDate and :endDate
        GROUP BY e.EmployeeID
        `,
        {
          type: QueryTypes.SELECT,
          replacements: {
            startDate: startDate,
            endDate: endDate,
          },
        }
      );
      res.status(200).json({
        errCode: 0,
        workHour,
        overtimeHour,
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
            startDate: startDate,
            endDate: endDate,
            tenantName: tenantName,
          },
        }
      );
      const overtimeHour = await sequelize.query(
        `
        select e.EmployeeID, CONCAT(u.firstName, ' ', u.lastName) AS fullname , hour(SEC_TO_TIME(SUM(TIME_TO_SEC(o.overtimeHour))))  as totalOvertimeHour
  from employees as e
  join overtimes as o on e.EmployeeID = o.EmployeeID
  join users as u on u.UserID = e.UserID
  join tenants as t on t.TenantID = e.TenantID
  where o.Status = 'approved' AND o.OvertimeDate between :startDate and :endDate and t.TenantName= :tenantName
  GROUP BY e.EmployeeID;
        `,
        {
          type: QueryTypes.SELECT,
          replacements: {
            startDate: startDate,
            endDate: endDate,
            tenantName: tenantName,
          },
        }
      );
      res.status(200).json({
        errCode: 0,
        workHour,
        overtimeHour,
      });
    }
  } catch (e) {
    console.error(e);
  }
});







export { totalAgent, totalSupervisor, getTotalWorkHourandOvertimeHour};
