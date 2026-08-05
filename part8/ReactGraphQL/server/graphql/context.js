const jwt = require("jsonwebtoken");
const User = require("../models/user");

const context = async ({ req }) => {
  const auth = req?.headers.authorization;

  if (auth && auth.startsWith("Bearer ")) {
    const decoded = jwt.verify(auth.substring(7), process.env.JWT_SECRET);

    const currentUser = await User.findById(decoded.id).populate("friends");

    return { currentUser };
  }

  return {};
};

module.exports = context;
