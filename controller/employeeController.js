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
    address,
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
      attributes: ["UserID", "Email",],
      where: { 
        Email: Email,
        isDeleted: 0
       },
    });
    console.log('email', user)
    if (user) {
      res.status(200).json({ errCode: -1, message: "Email exist in system" });
    } else {
      const addInforUser = await db.User.create({
        FirstName: FirstName,
        LastName: LastName,
        Birthday: Birthday,
        Email: Email,
        Address: address,
        PhoneNumber: PhoneNumber,
        Gender: Gender,
        isDeleted: 0
      });
      console.log('UserID')
      const userID = addInforUser.id;
      //created Account
      const salt = genSaltSync(10);
      const hashPassword = hashSync(password, salt);

      const findAccount = await db.Account.findOne({
        attributes: ["username"],
        where: {
          username: username,
          isDeleted: 0
        },
      });

      console.log("account", findAccount);

      if (findAccount === null) {
        console.log("username", username);
        const CreateAccount = await db.Account.create({
          AccountID: userID,
          username: username,
          password: hashPassword,
          RoleID: RoleID,
          isDeleted: 0
        });

        //created EmployeeID

        const roleID = CreateAccount.RoleID;
        const accountID = CreateAccount.id;

        const createdEmployee = await db.Employee.create({
          EmployeeID: userID,
          TenantID: TenantID,
          RoleID: roleID,
          Status: "Active",
          UserID: userID,
          AccountID: accountID,
          isDeleted: 0
        });

        res.status(200).json({
          errCode: 0,
          message: "create employee successfully",
          createdEmployee,
          addInforUser,
        });
      } else {
        res
          .status(200)
          .json({ errCode: -1, message: "username exits in system" });
      }
      // res.status(200).json({
      //   errCode: 0,
      //   message: "Add employee success",
      // });
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

    if (employee) {
      let query = `UPDATE users AS u 
      INNER JOIN employees AS e ON u.UserID = e.UserID 
      SET 
      u.FirstName = :FirstName,
      u.LastName = :LastName,
      u.Birthday = :Birthday,
      u.Email = :Email,
      u.Address = :Address,
      u.PhoneNumber = :PhoneNumber,
      u.Gender = :Gender
      WHERE 
        e.EmployeeID = :EmployeeID
      `;

      const result = await sequelize.query(query, {
        replacements: {
          FirstName: req.body.FirstName || employee[0].FirstName,
          LastName: req.body.LastName || employee[0].LastName,
          Birthday: req.body.Birthday || employee[0].Birthday,
          Email: req.body.Email || employee[0].Email,
          Address: req.body.address || employee[0].Address,
          PhoneNumber: req.body.PhoneNumber || employee[0].PhoneNumber,
          Gender: req.body.Gender || employee[0].Gender,
          EmployeeID: id,
        },
      });

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
  try {
    const deletedBy = req.createdBy;
    console.log('deletedBy', deletedBy)
    const employee = await sequelize.query(
      `
    select e.EmployeeID, concat(u.FirstName, '', u.LastName) as fullname, a.AccountID
    from employees as e
join accounts as a on a.AccountID = e.AccountID
join users as u on u.UserID = e.UserID
where e.EmployeeID =  :EmployeeID
    `,
      {
        type: QueryTypes.SELECT,
        replacements: {
          EmployeeID: EmployeeID,
        },
      }
    );
    if (!employee[0]) {
      res.status(200).json({
        errCode: 1,
        message: "Employee is not exist",
      });
    } else {
      console.log("employee", employee[0]);
      const deleteEmployee = await sequelize.query(
        `
        UPDATE employees as e 
        JOIN users as u ON e.UserID = u.UserID
        JOIN accounts as a ON a.AccountID = e.AccountID
        SET e.isDeleted = 1, e.deleteBy = :deletedBy, e.deleteAt = CURDATE(), 
        u.isDeleted = 1, u.deleteBy = :deletedBy, u.deleteAt = CURDATE(), 
        a.isDeleted = 1, a.deleteBy = :deletedBy, a.deleteAt = CURDATE()
        WHERE e.EmployeeID = :EmployeeID
      `,
        {
          type: QueryTypes.UPDATE,
          replacements: {
            EmployeeID: EmployeeID,
            deletedBy: deletedBy,
          },
        }
      );
      res.status(200).json({errCode: 0,message:'delete employee is successfully'});
    }
  } catch (e) {
    console.error(e);
  }

  // try {
  //   const employee = await db.Employee.findOne({
  //     attributes: ["EmployeeID", "AccountID", "UserID"],
  //     where: {
  //       EmployeeID: EmployeeID,
  //     },
  //   });
  //   console.log(employee);
  //   if (!employee) {
  //     res.status(200).json({ message: "Employee isn't exist" });
  //   } else {
  //     await db.Employee.destroy({
  //       where: { EmployeeID },
  //     });

  //     await db.Account.destroy({
  //       where: {
  //         AccountID: employee.AccountID,
  //       },
  //     });

  //     await db.User.destroy({
  //       where: {
  //         UserID: employee.UserID,
  //       },
  //     });

  //     res.status(200).json({
  //       message: "Delete employee successfully",
  //     });
  //   }
  // } catch (e) {
  //   console.log(`Error by: ${e}`);
  // }
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
      `SELECT e.EmployeeID,
      CONCAT(users.LastName, ' ', users.FirstName) AS FullName, users.FirstName, users.LastName, r.RoleName,
      users.Email, users.Birthday, users.Gender, users.address, users.PhoneNumber 
      FROM employees as e 
      JOIN users ON e.UserID = users.UserID
      JOIN roles as r on r.RoleID = e.RoleID`,
      {
        type: QueryTypes.SELECT,
      }
    );
    res.status(200).json(employee);
  } catch (e) {
    console.log(`Error by ${e}`);
  }
});

//// @desc get all role
// @routes GET /api/employee
// @access private

const getAllRole = asyncHandler(async (req, res) => {
  try {
    const id = req.RoleID;
    let filteredRole = [];
    const allRole = await sequelize.query("SELECT * FROM roles", {
      type: QueryTypes.SELECT,
    });

    if (id === 1) {
      filteredRole = allRole.filter((role) => role.RoleID !== 1);
    } else if (id === 2) {
      filteredRole = allRole.filter(
        (role) => role.RoleID !== 1 && role.RoleID !== 2
      );
    } else if (id === 3) {
      filteredRole = allRole.filter(
        (role) => role.RoleID !== 1 && role.RoleID !== 2 && role.RoleID !== 3
      );
    }
    res.status(200).json(filteredRole);
  } catch (e) {
    console.error(e);
  }
});

//// @desc get all employee by tenant
// @routes GET /api/employeeAtTenant
// @access private

const getEmployeeByTenant = asyncHandler(async (req, res) => {
  try {
    const roleid = req.RoleID;
    if (roleid === 1) {
      const employee = await sequelize.query(
        `SELECT e.EmployeeID,
        CONCAT(users.LastName, ' ', users.FirstName) AS FullName, users.FirstName, users.LastName, r.RoleName,
        users.Email, users.Birthday, users.Gender, users.address, users.PhoneNumber 
        FROM employees as e 
        JOIN users ON e.UserID = users.UserID
        JOIN roles as r on r.RoleID = e.RoleID
        WHERE e.isDeleted = 0`,
        {
          type: QueryTypes.SELECT,
        }
      );
      res.status(200).json(employee);
    } else {
      const TenantName = req.TenantName;
      const employee = await sequelize.query(
        `SELECT e.EmployeeID,
      CONCAT(users.LastName, ' ', users.FirstName) AS FullName, users.FirstName, users.LastName, r.RoleName, t.TenantName,
      users.Email, users.Birthday, users.Gender, users.address, users.PhoneNumber 
      FROM employees as e 
      JOIN users ON e.UserID = users.UserID
      JOIN roles as r on r.RoleID = e.RoleID
      JOIN tenants as t on e.TenantID = t.TenantID
      where t.TenantName = :TenantName and e.isDeleted = 0`,
        {
          type: QueryTypes.SELECT,
          replacements: {
            TenantName: TenantName,
          },
        }
      );

      res.status(200).json(employee);
    }
  } catch (e) {
    console.error(e);
  }
});

//// @desc get employee by supervisor
// @routes GET /api/agent
// @access private

const getAgent = asyncHandler(async (req, res) => {
  try {
    const TenantName = req.TenantName;
    const roleid = req.RoleID;
    if (roleid === 1) {
      const agent = await sequelize.query(
        `
        select e.EmployeeID,
        CONCAT(u.LastName, ' ', u.FirstName) AS FullName, u.FirstName, u.LastName, r.RoleName, t.TenantName,
        u.Email, u.Birthday, u.Gender, u.address, u.PhoneNumber, e.isDeleted, u.isDeleted 
        FROM employees as e 
        JOIN users as u ON e.UserID = u.UserID
        JOIN roles as r on r.RoleID = e.RoleID
        JOIN tenants as t on e.TenantID = t.TenantID
        WHERE r.RoleID = 4 
		    AND e.isDeleted =0 and u.isDeleted = 0
      `,
        {
          type: QueryTypes.SELECT,
        }
      );
      res.status(200).json({
        agent,
      });
    } else {
      const agent = await sequelize.query(
        `
      select e.EmployeeID,
        CONCAT(users.LastName, ' ', users.FirstName) AS FullName, users.FirstName, users.LastName, r.RoleName, t.TenantName,
        users.Email, users.Birthday, users.Gender, users.address, users.PhoneNumber 
        FROM employees as e 
        JOIN users ON e.UserID = users.UserID
        JOIN roles as r on r.RoleID = e.RoleID
        JOIN tenants as t on e.TenantID = t.TenantID
        where t.TenantName = :TenantName AND r.RoleName = 'Agent'
        and users.isDeleted = 0 and e.isDeleted = 0
      `,
        {
          type: QueryTypes.SELECT,
          replacements: {
            TenantName: TenantName,
          },
        }
      );
      res.status(200).json({
        agent,
      });
    }
  } catch (e) {
    console.error(e);
  }
});

export {
  addEmployee,
  getEmployeeProfileByID,
  updateInforEmployee,
  deleteEmployee,
  searchEmployee,
  getAllEmployee,
  getAllRole,
  getEmployeeByTenant,
  getAgent,
};
