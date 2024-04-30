"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Employee extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Employee.belongsTo(models.User, { foreignKey: "UserID" });
      Employee.belongsTo(models.Role, { foreignKey: "RoleID" });
      Employee.belongsTo(models.Account, { foreignKey: "AccountID" });
      Employee.hasMany(models.Team, {
        foreignKey: "ManagerID",
        as: "managedTeams",
      });
      Employee.hasMany(models.Team, {
        foreignKey: "MemberID",
        as: "teamMembers",
      });
    }
  }
  Employee.init(
    {
      TenantID: DataTypes.INTEGER,
      Status: DataTypes.STRING,
      RoleID: DataTypes.INTEGER,
      createdBy: DataTypes.INTEGER,
      updatedBy: DataTypes.INTEGER,
      UserID: DataTypes.INTEGER,
      AccountID: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Employee",
    }
  );
  Employee.beforeCreate((employee, options) => {
    // Rename the 'id' property to 'Account'
    employee.dataValues.EmployeeID = employee.dataValues.id;
    delete employee.dataValues.id;
    return employee;
  });
  return Employee;
};
