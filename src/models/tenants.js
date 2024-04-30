"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Tenants extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Tenants.init(
    {
      TenantName: DataTypes.STRING,
      SubscriptionDetails: DataTypes.STRING,
      createdBy: DataTypes.INTEGER,
      updatedBy: DataTypes.INTEGER,
      // createdAt: {
      //   type: DataTypes.DATE,
      //   allowNull: true,
      // },
    },
    {
      sequelize,
      modelName: "Tenants",
      // timestamps: false
    }
  );
  Tenants.beforeCreate((tenant, options) => {
    // Rename the 'id' property to 'UserID'
    tenant.dataValues.TenantID = tenant.dataValues.id;
    delete tenant.dataValues.id;
    return tenant;
  });
  return Tenants;
};
