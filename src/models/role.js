"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Role extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Role.hasOne(models.Account, { foreignKey: "RoleID" });
      
      Role.hasOne(models.Employee,{foreignKey:"RoleID"})
    }
  }
  Role.init(
    {
      RoleName: DataTypes.STRING,
      Description: DataTypes.STRING,
      createdBy: DataTypes.INTEGER,
      updatedBy: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Role",
    }
  );
  return Role;
};
