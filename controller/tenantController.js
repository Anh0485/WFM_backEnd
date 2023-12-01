import db, { sequelize } from "../src/models/index.js";
import asyncHandler from "../middleware/asyncHandler.js";
import { QueryTypes } from "sequelize";
// @desc created tenants
// @routes POST api/superadmin/tenant/createTenant
// @access private

const createdTenant = asyncHandler(async (req, res) => {
  const { TenantName, SubscriptionDetails } = req.body;

  const createdBy = req.createdBy;
  try {
    
    const creatTenant = await db.Tenants.create({
      TenantName: TenantName,
      SubscriptionDetails: SubscriptionDetails,
      createdBy: createdBy,
    });

    res.status(200).json({
      status: "create tenant successfully",
      creatTenant,
    });
  } catch (error) {
    console.log(`Error by: ${error}`);
  }
});

// @desc get all tenants
// @routes GET api/superadmin/tenant
// @access private/ superadmin

const getAllTenants = asyncHandler(async (req, res) => {
  try {
    const getTenants = await sequelize.query(
      `SELECT t.TenantID, t.TenantName, t.SubscriptionDetails, t.createdAt,
    CONCAT(u.FirstName, ' ', u.LastName) AS createdBy
FROM tenants AS t
JOIN accounts AS a ON t.createdBy = a.AccountID
JOIN employees as e on e.AccountID = a.AccountID
JOIN users AS u ON e.UserID = u.UserID`,
      {
        type: QueryTypes.SELECTS,
      }
    );

    res
      .status(200)
      .json({ message: "get all tenants successfully", getTenants });
  } catch (e) {
    console.log(`Error by: ${e}`);  
  }
});

// @desc delete tenants
// @routes DELETE api/tenant/:id
// @access private/ superadmin

const deleteTenants = asyncHandler(async (req, res) => {
  try {
    const tenantID = req.params.id;
    const tenant = await db.Tenants.findOne({
      attributes: ["TenantID", "TenantName"],
      where: {
        TenantID: tenantID,
      },
    });
    if (!tenant) {
      res.status(200).json({ message: "Tenant isn't exits" });
    } else {
      await db.Tenants.destroy({
        where: { tenantID },
      });

      res.status(200).json({ message: "Delete tenant successfully" });
    }
  } catch (e) {
    console.log(`Error by: ${e}`);
  }
});

// @desc update tenants
// @routes PUT api/tenant/:id
// @access private/ superadmin

const updateTenant = asyncHandler(async (req, res) => {
  try {
    const id = req.params.id;

    const tenant = await db.Tenants.findOne({
      attributes: ["TenantID", "TenantName", "SubscriptionDetails"],
      where: {
        TenantID: id,
      },
    });

    if (tenant) {
      const updatedTenant = await db.Tenants.update(
        {
          TenantName: req.body.TenantName || tenant.TenantName,
          SubscriptionDetails:
            req.body.SubscriptionDetails || tenant.SubscriptionDetails,
        },
        {
          where: {
            TenantID: tenant.TenantID,
          },
        }
      );
      res.status(200).json({
        message: "Updated successfully",
      });
    } else {
      res.status(404).json({ message: "Tenant's not found" });
    }
  } catch (e) {
    console.log(`Error by: ${e}`);
  }
});

export { createdTenant, getAllTenants, deleteTenants, updateTenant };
