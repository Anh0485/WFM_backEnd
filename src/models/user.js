"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.hasOne(models.Employee, { foreignKey: "UserID" });
    }
  }
  User.init(
    {
      FirstName: DataTypes.STRING,
      LastName: DataTypes.STRING,
      Email: DataTypes.STRING,
      PhoneNumber: DataTypes.STRING,
      Birthday: DataTypes.DATEONLY,
      createdBy: DataTypes.INTEGER,
      updatedBy: DataTypes.INTEGER,
      Address: DataTypes.STRING,
      Gender: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "User",
    }
  );
  User.beforeCreate((user, options) => {
    // Rename the 'id' property to 'UserID'
    user.dataValues.UserID = user.dataValues.id;
    delete user.dataValues.id;
    return user;
  });
  return User;
};
