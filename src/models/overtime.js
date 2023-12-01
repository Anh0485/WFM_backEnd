'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Overtime extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Overtime.init({
    EmployeeID: DataTypes.INTEGER,
    OvertimeDate: DataTypes.DATE,
    OvertimeHour: DataTypes.TIME,
    Reason: DataTypes.STRING,
    ApprovedBy: DataTypes.INTEGER,
    Status: DataTypes.ENUM('pending','approved'),
    createdBy: DataTypes.INTEGER,
    updatedBy: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Overtime',
  });
  return Overtime;
};