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
      Birthday: DataTypes.DATEONLY,
      Email: DataTypes.STRING,
      Address: DataTypes.STRING,
      PhoneNumber: DataTypes.STRING,
      createdBy: DataTypes.INTEGER,
      updatedBy: DataTypes.INTEGER,
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
  // User.beforeFind((user, options) => {
  //   // Rename the 'id' property to 'UserID'
  //   user.dataValues.UserID = user.dataValues.id;
  //   delete user.dataValues.id;
  //   return user;
  // });

  return User;
};
