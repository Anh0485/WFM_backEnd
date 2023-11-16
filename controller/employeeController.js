import db, { sequelize } from "../src/models/index.js";
import asyncHandler from "../middleware/asyncHandler.js";
import { hashSync, genSaltSync } from "bcrypt";
import bcrypt from "bcryptjs";
import { Op, QueryTypes } from "sequelize";
// @desc add information employees
// @routes POST /api/employee/addEmployee
// @access private

const addEmployee = asyncHandler(async (req, res) => {
  const {
    FirstName,
    LastName,
    Birthday,
    Email,
    Address,
    PhoneNumber,
    Gender,
    username,
    password,
    RoleID,
    TenantID,
    Status,
  } = req.body;

  try {
    const user = await db.User.findOne({
      attributes: ["UserID", "Email"],
      where: { Email: Email },
    });

    if (!user) {
      const addInforUser = await db.User.create({
        FirstName: FirstName,
        LastName: LastName,
        Birthday: Birthday,
        Email: Email,
        Address: Address,
        PhoneNumber: PhoneNumber,
        Gender: Gender,
      });

      const userID = addInforUser.id;

      //created Account
      const salt = genSaltSync(10);
      const hashPassword = hashSync(password, salt);

      const findAccount = await db.Account.findOne({
        attributes: ["username"],
        where: {
          username: username,
        },
      });

      if (findAccount === null) {
        console.log("username", username);
        const CreateAccount = await db.Account.create({
          AccountID: userID,
          username: username,
          password: hashPassword,
          RoleID: RoleID,
        });

        //created EmployeeID

        const roleID = CreateAccount.RoleID;
        const accountID = CreateAccount.id;

        const createdEmployee = await db.Employee.create({
          EmployeeID: userID,
          TenantID: TenantID,
          RoleID: roleID,
          Status: Status,
          UserID: userID,
          AccountID: accountID,
        });
        
        res
          .status(200)
          .json({ message: "create employee successfully", createdEmployee });
      } else {
        res.json({ message: "username exits in system" });
      }

      res.status(200).json({
        message: "Add employee success",
      });
    } else {
      res.json({ message: "Email exist in system" });
    }
  } catch (e) {
    console.log(`Error by: ${e}`);
  }
});

// @desc get employee profile
// @routes POST /api/superadmin/employee/profile
// @access private

const getEmployeeProfileByID = asyncHandler(async (req, res) => {
  try {
    const id = req.params.id;
    const employee = await sequelize.query(
      "SELECT employees.EmployeeID, users.FirstName, users.LastName, users.Email, users.Birthday, users.Address FROM employees JOIN users ON employees.UserID = users.UserID WHERE employees.EmployeeID = :id;",
      {
        replacements: { id },
        type: QueryTypes.SELECT,
      }
    );
    // const employee = await db.User.findOne({
    //   attributes: [
    //     "FirstName",
    //     "LastName",
    //     "PhoneNumber",
    //     "Email",
    //     "Birthday",
    //     "Address",
    //   ],
    //   where: { UserID: id },
    // });

    res.status(200).json({
      message: "get employee successfully",
      employee,
    });

    console.log(employee);
  } catch (e) {
    console.log(`Error by: ${e}`);
  }
});

// @desc update information employee
// @routes POST /api/superadmin/employee/updateEmployeeProfile
// @access private

const updateInforEmployee = asyncHandler(async (req, res) => {
  try {
    const id = req.params.id;

    const employee = await sequelize.query(
      "SELECT employees.EmployeeID, users.FirstName, users.LastName, users.Email, users.Birthday, users.Address, users.Gender, users.PhoneNumber FROM employees JOIN users ON employees.UserID = users.UserID WHERE employees.EmployeeID = :id;",
      {
        replacements: { id },
        type: QueryTypes.SELECT,
      }
    );
    
    console.log(employee);
    console.log(employee[0].LastName)
    if (employee) {
      let query = `UPDATE users AS u 
      INNER JOIN employees AS e ON u.UserID = e.UserID 
      SET 
      u.FirstName = :FirstName,
      u.LastName = :LastName,
      u.Birthday = :Birthday,
      u.Email = :Email,
      u.Address = :Address,
      u.PhoneNumber = :PhoneNumber
      WHERE 
        e.EmployeeID = :EmployeeID
      `;

      const result = await sequelize.query(query,{
        replacements:{
          FirstName: req.body.FirstName || employee[0].FirstName,
          LastName: req.body.LastName || employee[0].LastName,
          Birthday: req.body.Birthday || employee[0].Birthday,
          Email: req.body.Birthday || employee[0].Birthday,
          Address: req.body.Address || employee[0].Address,
          PhoneNumber: req.body.PhoneNumber || employee[0].PhoneNumber,
          Gender: req.body.Gender || employee[0].Gender,
          EmployeeID : id
        }
      })
      
      res.status(200).json({
        message: "Update success",
        result,
      });
    } else {
      res.status(404).json({ message: "User's not found" });
    }
  } catch (e) {
    console.log(`Error by: ${e}`);
  }
});

//// @desc update information employee
// @routes POST /api/superadmin/employee/updateEmployeeProfile
// @access private

const deleteEmployee = asyncHandler(async (req, res) => {
  const EmployeeID = req.params.id;
  console.log(EmployeeID);
  try {
    const employee = await db.Employee.findOne({
      attributes: ["EmployeeID", "AccountID", "UserID"],
      where: {
        EmployeeID: EmployeeID,
      },
    });
    console.log(employee);
    if (!employee) {
      res.status(200).json({ message: "Employee isn't exist" });
    } else {
      await db.Employee.destroy({
        where: { EmployeeID },
      });

      await db.Account.destroy({
        where: {
          AccountID: employee.AccountID,
        },
      });

      await db.User.destroy({
        where: {
          UserID: employee.UserID,
        },
      });

      res.status(200).json({
        message: "Delete employee successfully",
      });
    }
  } catch (e) {
    console.log(`Error by: ${e}`);
  }
});

//// @desc search employee
// @routes POST /api/superadmin/employee?id
// @access private

const searchEmployee = asyncHandler(async (req, res) => {
  try {
    const { queryParam } = req.query;
    const employee = await db.User.findAll({
      attributes: ["UserID", "FirstName", "LastName", "Email"],
      where: {
        [Op.or]: [
          { firstName: { [Op.like]: `%${queryParam}%` } },
          { lastName: { [Op.like]: `%${queryParam}%` } },
        ],
      },
    });
    if (employee) {
      res.status(200).json(employee);
    } else {
      res.json({ message: "Employee isn't on the system" });
    }
  } catch (e) {
    console.log(`Error by ${e}`);
  }
});

//// @desc get all employee
// @routes GET /api/superadmin/employee
// @access private

const getAllEmployee = asyncHandler(async (req, res) => {
  try {
    const employee = await sequelize.query(
      "SELECT employees.EmployeeID, users.FirstName, users.LastName, users.Email, users.Birthday, users.Address, users.PhoneNumber FROM employees JOIN users ON employees.UserID = users.UserID;",
      {
        type: QueryTypes.SELECT,
      }
    );
    res.status(200).json(employee);
  } catch (e) {
    console.log(`Error by ${e}`);
  }
});

export {
  addEmployee,
  getEmployeeProfileByID,
  updateInforEmployee,
  deleteEmployee,
  searchEmployee,
  getAllEmployee,
};
