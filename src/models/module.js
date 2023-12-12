'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Module extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Module.hasMany(models.PermissionDetail,{foreignKey:'ModuleID'})
    }
  }
  Module.init({
    ModuleName: DataTypes.STRING,
    Description: DataTypes.STRING,
    path: DataTypes.STRING,
    title: DataTypes.STRING,
    icon: DataTypes.STRING,
    class: DataTypes.STRING,
    createdBy: DataTypes.INTEGER,
    updatedBy: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Module',
  });
  return Module;
};