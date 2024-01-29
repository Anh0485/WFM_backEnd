import db, { sequelize } from "../src/models/index.js";
import asyncHandler from "../middleware/asyncHandler.js";
import { QueryTypes, json } from "sequelize";


const getUserProfile = asyncHandler(async(req,res)=>{
    try{
        const id = req.id;
        const user = await sequelize.query(`SELECT CONCAT(u.LastName,' ', u.FirstName) AS FullName, r.RoleName
        FROM users AS u
        JOIN employees AS e ON e.UserID = u.UserID
        JOIN accounts AS a ON a.AccountID = e.AccountID
        JOIN Roles AS r ON a.RoleID = r.RoleID
        WHERE a.AccountID = :id`,{
            type: QueryTypes.SELECT,
          replacements: {
            id: id
          },
        })

        res.status(200).json({
            user
        })

    }catch(e){
        console.error(e)
    }
})

export {getUserProfile}