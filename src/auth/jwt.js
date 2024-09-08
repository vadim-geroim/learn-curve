const jwt = require("jsonwebtoken");
const SECRET = process.env.JWT_SECRET || "your-secret-key";

const createToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
    },
    SECRET,
    { expiresIn: "1d" }
  );
};

const verifyToken = (token) => {
  try {
    return jwt.verify(token, SECRET);
  } catch (error) {
    return null;
  }
};

module.exports = { createToken, verifyToken };