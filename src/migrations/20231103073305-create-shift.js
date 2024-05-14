"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Shifts", {
      ShiftTypeID: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
        field: "ShiftTypeID",
      },
      ShiftTypeName: {
        type: Sequelize.STRING,
      },
      ShiftStart: {
        type: Sequelize.TIME,
      },
      ShiftEnd: {
        type: Sequelize.TIME,
      },
      createdBy: {
        type: Sequelize.INTEGER,
      },
      updatedBy: {
        type: Sequelize.INTEGER,
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
    await queryInterface.dropTable("Shifts");
  },
};
