"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Tenants", {
      TenantID: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
        field: "TenantID",
      },
      TenantName: {
        type: Sequelize.STRING,
      },
      SubscriptionDetails: {
        type: Sequelize.STRING,
      },
      createdBy: {
        type: Sequelize.INTEGER,
      },
      updatedBy: {
        type: Sequelize.INTEGER,
      },
      createdAt: {
        // type: Sequelize.DATE,
        // allowNull: true,
        type: "TIMESTAMP",
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
        allowNull: true,
      },
      updatedAt: {
        type: "TIMESTAMP",
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
        allowNull: true,
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
    await queryInterface.dropTable("Tenants");
  },
};
