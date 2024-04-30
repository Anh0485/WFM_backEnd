'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Call extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Call.init({
    CallDate: DataTypes.DATE,
    CallName: DataTypes.STRING,
    CallPhone: DataTypes.STRING,
    EmployeeID: DataTypes.INTEGER,
    CallDuration: DataTypes.INTEGER,
    ChannelID: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Call',
  });
  return Call;
};