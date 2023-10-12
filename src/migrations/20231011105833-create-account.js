"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Accounts", {
      AccountID: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      username: {
        type: Sequelize.STRING,
      },
      password: {
        type: Sequelize.STRING,
      },
      IsLoggedIn: {
        type: Sequelize.BOOLEAN,
      },
      PasswordResetToken: {
        type: Sequelize.STRING,
      },
      createdBy: {
        type: Sequelize.INTEGER,
      },
      updatedBy: {
        type: Sequelize.INTEGER,
      },
      RoleID: {
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
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Accounts");
  },
};
