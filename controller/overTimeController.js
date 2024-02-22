import db, { sequelize } from "../src/models/index.js";
import asyncHandler from "../middleware/asyncHandler.js";
import { QueryTypes } from "sequelize";

// @desc created overtime
// @routes POST api/overtime/createdOT
// @access private

const createdOT = asyncHandler(async (req, res) => {
  const createdBy = req.createdBy;
  const { OvertimeDate, OvertimeHour, Reason } = req.body;


  try {
    const id = req.id;
    const employeeID = await sequelize.query(
      `SELECT e.EmployeeID
    FROM employees as e
    JOIN accounts as a on a.AccountID = e.AccountID
    where a.AccountID = :id
    `,
      {
        type: QueryTypes.SELECT,
        replacements: {
          id: id,
        },
      }
    );
    console.log('EmployeeID:', employeeID)

    const EmployeeID = employeeID[0].EmployeeID
  
    const createOT = await db.Overtime.create({
      EmployeeID: EmployeeID,
      OvertimeDate: OvertimeDate,
      OvertimeHour: OvertimeHour,
      Reason: Reason,
      Status: "pending",
      createdBy: createdBy,
    });
    if (createOT) {
      res.status(200).json({
        message: "created OT successfully",
        createOT,
      });
    } else {
      res.status(500).json({
        message: "Failed to create OT",
      });
    }
  } catch (e) {
    console.log(e);
  }
});

// @desc get all overtime
// @routes GET api/overtime
// @access private

const getAllOT = asyncHandler(async (req, res) => {
  try {
    const overtime = await sequelize.query(
      `select ot.OverTimeID, ot.EmployeeID, CONCAT(u.LastName, ' ', u.FirstName) as FullName, ot.OvertimeHour, date_format(ot.OvertimeDate,'%d-%m-%Y') as OvertimeDate , ot.Status
      from overtimes as ot
      join employees as e on e.EmployeeID = ot.EmployeeID
      join users as u on e.UserID = u.UserID`,
      {
        type: QueryTypes.SELECT,
      }
    );

    res.status(200).json({
      message: "get all ot successsfully",
      overtime,
    });
  } catch (e) {
    console.error(e);
  }
});


// @desc approve Request
// @routes GET api/overtime/request/:id
// @access private

const aprrovedRequest = asyncHandler(async(req,res)=>{
  
  try{
    const {id} = req.params;
    console.log('id', id)
    const aprrovedID = req.createdBy;
    const request = await db.Overtime.findOne({
      attributes: ["OverTimeID"],
      where: {
        OverTimeID: id,
      },
    })
    if(request){
      const updateRequest = await sequelize.query(
        `update overtimes 
        set Status = 'approved', ApprovedBy = :aprrovedID  
        where OverTimeID = :id 
        `,{
        replacements:{
          id: id,
          aprrovedID: aprrovedID
        }
      })
      res.status(200).json({
        message:'aprroved request',
      });
    }else{
      res.status(400).json({
        message:'request isnot exits'
      })
    }
  }catch(e){
    console.error(e)
  }
  
})

// @desc delete overtime
// @routes delete api/overtime/:id
// @access private

const deleteOT = asyncHandler(async(req,res)=>{
  try{
    const {id} = req.params;

    const ot = await db.Overtime.findOne({
      attributes: ["OverTimeID"],
      where: {
        OverTimeID: id,
      },
    })

    if(ot){
      const deleteOvertime = await sequelize.query(`delete from overtimes where OverTimeID = :id`,{
        replacements: {
          id: id
        },
        type: QueryTypes.DELETE
      })
      res.status(200).json({
        message:'delete overtime successfully'
      })
    }else{
      res.status(400).json({message:'OverTime isnot exits'})
    }


  }catch(e){
    console.error(e)
  }
})

// @desc update overtime
// @routes delete api/overtime/:id
// @access private





export { createdOT, getAllOT, aprrovedRequest, deleteOT };
