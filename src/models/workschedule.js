'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class WorkSchedule extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  WorkSchedule.init({
    EmployeeID: DataTypes.INTEGER,
    ShiftTypeID: DataTypes.INTEGER,
    workdate: DataTypes.DATE,
    isScheduled: DataTypes.BOOLEAN,
    ChannelID: DataTypes.INTEGER,
    createdBy: DataTypes.INTEGER,
    updatedBy: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'WorkSchedule',
  });
  WorkSchedule.beforeCreate((wschedule, options) => {
    // Rename the 'id' property to 'UserID'
    wschedule.dataValues.ScheduleID = wschedule.dataValues.id;
    delete wschedule.dataValues.id;
    return wschedule;
  });
  return WorkSchedule;
};