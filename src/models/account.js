'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Account extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Account.belongsTo(models.Role, { foreignKey: "RoleID" });
      Account.hasOne(models.Employee, { foreignKey: "AccountID" });
      Account.hasMany(models.Permission, { foreignKey: 'AccountID' });
    }
  }
  Account.init({
    username: DataTypes.STRING,
    password: DataTypes.STRING,
    IsLoggedIn: DataTypes.BOOLEAN,
    RoleID: DataTypes.INTEGER,
    createdBy: DataTypes.INTEGER,
    updatedBy: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Account',
  });
  Account.beforeCreate((account, options) => {
    // Rename the 'id' property to 'Account'
    account.dataValues.AccountID = account.dataValues.id;
    delete account.dataValues.id;
    return account;
  });

  return Account;
};