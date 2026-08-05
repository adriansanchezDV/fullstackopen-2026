const jwt = require("jsonwebtoken");
const User = require("./models/User");

const context = async ({ req }) => {
  const auth = req?.headers?.authorization;

  if (!auth || !auth.startsWith("Bearer ")) {
    return {};
  }

  try {
    const decodedToken = jwt.verify(auth.substring(7), process.env.JWT_SECRET);

    const currentUser = await User.findById(decodedToken.id);

    return {
      currentUser,
    };
  } catch (error) {
    return {};
  }
};

module.exports = context;
