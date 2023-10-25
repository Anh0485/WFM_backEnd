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
      attributes: ["UserID"],
      where: { UserID: id },
    });
    if (employee) {
      employee.FirstName = req.body.FirstName || employee.FirstName;
      employee.LastName = req.body.LastName || employee.LastName;
      employee.Birthday = req.body.Birthday || employee.Birthday;
      employee.Email = req.body.Email || employee.Email;
      employee.Address = req.body.Address || employee.Address;

      const updatedEmployee = await employee.save();
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

export { addEmployee, getEmployeeProfile, updateInforEmployee };
