import jwt from "jsonwebtoken";

const generateToken = (id, roleID, tenantName,permission ) => {
  return jwt.sign({ id, roleID, tenantName , permission }, process.env.JWT_SECRET, {
    expiresIn: "15d",
  });
};

export default generateToken;
