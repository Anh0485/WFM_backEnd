import db, { sequelize } from "../src/models/index.js";
import asyncHandler from "../middleware/asyncHandler.js";
import { QueryTypes } from "sequelize";

// @desc get total agent
// @routes GET api/total/agent
// @access private

const totalAgent = asyncHandler(async(req,res)=>{
    try{
        const agent = await sequelize.query(`SELECT COUNT(*) AS total_agents
        FROM employees as e
        join roles as r on r.RoleID = e.RoleID
        where r.RoleName = 'agent'`,{
            type: QueryTypes.SELECT,
        })

        res.status(200).json({
            message:'get total agent successfully',
            agent
        })
    }catch(e){
        console.error(e)
    }
})

export {totalAgent}