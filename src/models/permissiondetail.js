'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class PermissionDetail extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      PermissionDetail.belongsTo(models.Permission, {foreignKey:'PermissionID'})
      PermissionDetail.belongsTo(models.Module, {foreignKey:'ModuleID'})
    }
  }
  PermissionDetail.init({
    PermissionID: DataTypes.INTEGER,
    ModuleID: DataTypes.INTEGER,
    CanAdd: DataTypes.BOOLEAN,
    CanView: DataTypes.BOOLEAN,
    CanEdit: DataTypes.BOOLEAN,
    CanDelete: DataTypes.BOOLEAN,
    CanExport: DataTypes.BOOLEAN,
    createdBy: DataTypes.INTEGER,
    updatedBy: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'PermissionDetail',
  });
  return PermissionDetail;
};