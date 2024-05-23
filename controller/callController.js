import { query } from "express";
import asyncHandler from "../middleware/asyncHandler.js";
import generateToken from "../utils/generateToken.js";
import db, { sequelize } from "../src/models/index.js";
import crypto from "crypto";
import { sendPasswordResetEmail } from "./emailController.js";
import { hashSync, genSaltSync } from "bcrypt";
import bcrypt from "bcryptjs";
import { Op, QueryTypes } from "sequelize";

const getCallandAgentByTime = asyncHandler(async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const result = await sequelize.query(
      `  SELECT
      DAYOFWEEK(c.CallDate) AS day_of_week, 
      COUNT(c.CallID) AS total_calls,
      COUNT(DISTINCT e.EmployeeID) AS total_agents
    FROM
      Calls c
      JOIN employees e ON c.employeeID = e.employeeID
    WHERE
      c.CallDate BETWEEN :startDate AND :endDate
    GROUP BY
      DAYOFWEEK(c.CallDate)
    ORDER BY
      DAYOFWEEK(c.CallDate);`,
      {
        replacements: { startDate, endDate },
        type: QueryTypes.SELECT,
      }
    );
    res.status(200).json({
        message:'get call and agent successfully',
        result
    })

  } catch (e) {
    console.error(e);
  }
});

// @desc get call and agent by week
// @routes GET/callandagent/getCallAndAgentByWeek
// @access private

const getCallAndAgentByWeek = asyncHandler(async(req,res)=>{
  try{
    const now = new Date();
    const formattedDate = now.toISOString().split('T')[0];
    const callAndAgent = await sequelize.query(`
    SELECT
    CASE DAYOFWEEK(CallDate)
        WHEN 1 THEN 'Sunday'
        WHEN 2 THEN 'Monday'
        WHEN 3 THEN 'Tuesday' 
        WHEN 4 THEN 'Wednesday'
        WHEN 5 THEN 'Thursday'
        WHEN 6 THEN 'Friday'
        WHEN 7 THEN 'Saturday'
    END AS DayOfWeek,
    COUNT(*) AS TotalCalls,
    COUNT(DISTINCT EmployeeID) AS TotalAgents
FROM
    calls
WHERE
    CallDate BETWEEN DATE_SUB(:formattedDate, 
      INTERVAL (WEEKDAY(:formattedDate) + 7) DAY) 
      AND DATE_SUB(:formattedDate, 
        INTERVAL (WEEKDAY(:formattedDate) + 1) DAY)
GROUP BY
    DAYOFWEEK(CallDate)
ORDER BY
    CASE
        WHEN DAYOFWEEK(CallDate) = 1 THEN 7 
        ELSE DAYOFWEEK(CallDate) - 1
    END;
    `,{
      type: QueryTypes.SELECT,
      replacements:{
        formattedDate: formattedDate
      }
    });
    console.log('date:', formattedDate);
    res.status(200).json({
      errCode:0,
      callAndAgent
    })
  }catch(e){
    console.error(e)
  }
})


export{ getCallandAgentByTime, getCallAndAgentByWeek}
