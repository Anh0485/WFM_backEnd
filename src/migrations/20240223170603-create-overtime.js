'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Overtimes', {
      OverTimeID: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
        field: "OverTimeID",
      },
      EmployeeID: {
        type: Sequelize.INTEGER
      },
      OvertimeDate: {
        type: Sequelize.DATE
      },
      OvertimeHour: {
        type: Sequelize.TIME
      },
      Reason: {
        type: Sequelize.STRING
      },
      ApprovedBy: {
        type: Sequelize.INTEGER
      },
      Status: {
        type: Sequelize.ENUM,
        values:['pending','approved', 'reject']
      },
      createdBy: {
        type: Sequelize.INTEGER
      },
      updatedBy: {
        type: Sequelize.INTEGER
      },
      createdAt: {
        type: "TIMESTAMP",
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
        allowNull: false,
      },
      updatedAt: {
        type: "TIMESTAMP",
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
        allowNull: false,
      },
      isDeleted : {
        type: Sequelize.BOOLEAN
      },
      deleteBy:{
        type: Sequelize.INTEGER,
      },
      deleteAt:{
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Overtimes');
  }
};