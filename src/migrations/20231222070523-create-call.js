'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Calls', {
      CallID: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
        field: "CallID",
      },
      CallDate: {
        type: Sequelize.DATE
      },
      CallName: {
        type: Sequelize.STRING
      },
      CallPhone: {
        type: Sequelize.STRING
      },
      EmployeeID: {
        type: Sequelize.INTEGER
      },
      CallDuration: {
        type: Sequelize.INTEGER
      },
      ChannelID: {
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
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Calls');
  }
};