"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Account extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Account.belongsTo(models.Role, {foreignKey:"RoleID"})
    }
  }
  Account.init(
    {
      username: DataTypes.STRING,
      password: DataTypes.STRING,
      IsLoggedIn: DataTypes.BOOLEAN,
      PasswordResetToken: DataTypes.STRING,
      createdBy: DataTypes.INTEGER,
      updatedBy: DataTypes.INTEGER,
      RoleID: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Account",
    }
  );
  return Account;
};
