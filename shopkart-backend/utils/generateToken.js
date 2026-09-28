const jwt = require("jsonwebtoken");

const generateToken = (customerId) => {
  return jwt.sign(
    {
      userId: customerId,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d",
    }
  );
};

module.exports = generateToken;
