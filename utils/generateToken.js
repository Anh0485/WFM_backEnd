import jwt from "jsonwebtoken";

const generateToken = (id, roleID) => {
  return jwt.sign({ id, roleID }, process.env.JWT_SECRET, {
    expiresIn: "15d",
  });
};

export default generateToken;
