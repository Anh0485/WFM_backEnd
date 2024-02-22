import db, { sequelize } from "../src/models/index.js";
import asyncHandler from "../middleware/asyncHandler.js";
import { QueryTypes, json } from "sequelize";

// @desc create team
// @routes POST /api/team/createdTeam
// @access private

const createdTeam = asyncHandler(async (req, res) => {
  const { ManagerID, MemberID } = req.body;
  try {
    const createTeam = await db.Team.create({
        ManagerID: ManagerID,
        MemberID: MemberID
    });
    res.status(200).json({
        message:"create team successfully", createTeam
    })
  } catch (e) {
    console.error(e);
  }
});





export {createdTeam}