'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Team extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Team.init({
    ManagerID: DataTypes.INTEGER,
    MemberID: DataTypes.INTEGER,
    createdBy: DataTypes.INTEGER,
    updatedBy: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Team',
  });
  Team.beforeCreate((team, options) => {
    // Rename the 'id' property to 'Account'
    team.dataValues.TeamID = team.dataValues.id;
    delete team.dataValues.id;
    return team;111111111111111111111111111111111111
  });
  return Team;
};