import db, { sequelize } from "../src/models/index.js";
import asyncHandler from "../middleware/asyncHandler.js";
import { QueryTypes, json } from "sequelize";

const getSuperAdminProfile = asyncHandler(async (req, res) => {
  try {
    const id = req.id;
    const sa = await sequelize.query(
      `SELECT CONCAT(u.LastName,' ', u.FirstName) AS FullName, r.RoleName
        FROM users AS u
        JOIN employees AS e ON e.UserID = u.UserID
        JOIN accounts AS a ON a.AccountID = e.AccountID
        JOIN Roles AS r ON a.RoleID = r.RoleID
        WHERE a.AccountID = :id`,
      {
        type: QueryTypes.SELECT,
        replacements: {
          id: id,
        },
      }
    );
    res.status(200).json({
      errCode: 0,
      sa,
    });
  } catch (e) {
    console.error(e);
  }
});

const getUserProfile = asyncHandler(async (req, res) => {
  try {
    const id = req.id;
    const roleid = req.RoleID;
    if (roleid == 1) {
      const user = await sequelize.query(
        `SELECT CONCAT(u.LastName,' ', u.FirstName) AS FullName, r.RoleName
            FROM users AS u
            JOIN employees AS e ON e.UserID = u.UserID
            JOIN accounts AS a ON a.AccountID = e.AccountID
            JOIN Roles AS r ON a.RoleID = r.RoleID
            WHERE a.AccountID = :id`,
        {
          type: QueryTypes.SELECT,
          replacements: {
            id: id,
          },
        }
      );
      res.status(200).json({
        errCode: 0,
        user,
      });
    } else {
      const user = await sequelize.query(
        `SELECT CONCAT(u.LastName,' ', u.FirstName) AS FullName, r.RoleName, t.TenantName
            FROM users AS u
            JOIN employees AS e ON e.UserID = u.UserID
            JOIN accounts AS a ON a.AccountID = e.AccountID
            JOIN Roles AS r ON a.RoleID = r.RoleID
            JOIN tenants as t on e.TenantID = t.TenantID
            WHERE a.AccountID = :id`,
        {
          type: QueryTypes.SELECT,
          replacements: {
            id: id,
          },
        }
      );
      res.status(200).json({
        user,
      });
    }
  } catch (e) {
    console.error(e);
  }
});

export { getUserProfile };
