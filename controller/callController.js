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

export{ getCallandAgentByTime}
