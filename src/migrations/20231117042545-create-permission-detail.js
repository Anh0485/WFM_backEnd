'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('PermissionDetails', {
      PermissionDetailID: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
        field: "PermissionDetailID",
      },
      PermissionID: {
        type: Sequelize.INTEGER
      },
      ModuleID: {
        type: Sequelize.INTEGER
      },
      CanView: {
        type: Sequelize.BOOLEAN
      },
      CanEdit: {
        type: Sequelize.BOOLEAN
      },
      CanDelete: {
        type: Sequelize.BOOLEAN
      },
      CanExport: {
        type: Sequelize.BOOLEAN
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
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('PermissionDetails');
  }
};