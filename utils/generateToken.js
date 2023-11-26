import jwt from "jsonwebtoken";

const generateToken = (id, roleID, permission) => {
  return jwt.sign({ id, roleID, permission }, process.env.JWT_SECRET, {
    expiresIn: "15d",
  });
};

export default generateToken;
