import db, { sequelize } from "../src/models/index.js";
import asyncHandler from "../middleware/asyncHandler.js";
import { hashSync, genSaltSync } from "bcrypt";
import bcrypt from "bcryptjs";
import { Op, QueryTypes } from "sequelize";

//// @desc get all channel
// @routes GET /api/channel
// @access private

const getAllChannel = asyncHandler(async(req,res)=>{
    try{
        const channel = await sequelize.query('select * from channels',
        {
            type: QueryTypes.SELECT
        })
        res.status(200).json(channel);
    }catch(e){
        console.error(e)
    }
})

export{getAllChannel}
