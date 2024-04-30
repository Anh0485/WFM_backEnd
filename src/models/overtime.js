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
    Status: DataTypes.ENUM('pending','approved','reject'),
    createdBy: DataTypes.INTEGER,
    updatedBy: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Overtime',
  });
  Overtime.beforeCreate((ot, options) => {
    // Rename the 'id' property to 'Account'
    ot.dataValues.OvertimeID = ot.dataValues.id;
    delete ot.dataValues.id;
    return ot;
  });
  return Overtime;
};