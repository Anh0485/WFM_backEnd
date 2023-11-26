'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Permission extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    Permission.belongsTo(models.Account, { foreignKey: 'AccountID' });

    }
  }
  Permission.init({
    PermissionName: DataTypes.STRING,
    Description: DataTypes.STRING,
    AccountID: DataTypes.INTEGER,
    createdBy: DataTypes.INTEGER,
    updatedBy: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Permission',
  });
  return Permission;
};