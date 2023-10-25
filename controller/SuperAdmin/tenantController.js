import db from "../../src/models/index.js";
import asyncHandler from "../../middleware/asyncHandler.js";

// @desc created tenants
// @routes POST api/superadmin/tenant/createTenant
// @access private

const createdTenant = asyncHandler(async (req, res) => {
  const { tenantName, subscriptionDetails } = req.body;
  try {
    const creatTenant = await db.Tenants.create({
      TenantName: tenantName,
      SubscriptionDetails: subscriptionDetails,
    });
    res.status(200).json({
      status: "create tenant successfully",
    });
  } catch (error) {
    console.log(`Error by: ${error}`);
  }
});

export { createdTenant };
