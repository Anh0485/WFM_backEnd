import db from "../../src/models/index.js";
import asyncHandler from "../../middleware/asyncHandler.js";
import { hashSync, genSaltSync } from "bcrypt";
import bcrypt from "bcryptjs";
// @desc add information employees
// @routes POST /api/employee/addEmployee
// @access private

const addEmployee = asyncHandler(async (req, res) => {
  const {
    firstName,
    lastName,
    Birthday,
    Email,
    Address,
    PhoneNumber,
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
        FirstName: firstName,
        LastName: lastName,
        Birthday: Birthday,
        Email: Email,
        Address: Address,
        PhoneNumber: PhoneNumber,
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

const getEmployeeProfile = asyncHandler(async (req, res) => {
  try {
    const id = req.params.id;
    const employee = await db.User.findOne({
      attributes: [
        "FirstName",
        "LastName",
        "PhoneNumber",
        "Email",
        "Birthday",
        "Address",
      ],
      where: { UserID: id },
    });

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
    const employee = await db.User.findOne({
      attributes: [
        "UserID",
        "FirstName",
        "LastName",
        "Birthday",
        "Email",
        "Address",
      ],
      where: { UserID: id },
    });
    console.log(employee);
    if (employee) {
      const updatedEmployee = await db.User.update(
        {
          FirstName: req.body.FirstName || employee.FirstName,
          LastName: req.body.LastName || employee.LastName,
          Birthday: req.body.Birthday || employee.Birthday,
          Email: req.body.Email || employee.Email,
          Address: req.body.Address || employee.Address,
        },
        {
          where: {
            UserID: employee.UserID,
          },
        }
      );
      res.status(200).json({
        message: "Update success",
        updatedEmployee,
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

export { addEmployee, getEmployeeProfile, updateInforEmployee, deleteEmployee };
