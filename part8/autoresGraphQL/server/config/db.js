const mongoose = require("mongoose");
const { MONGODB_URI } = require("./config");

mongoose.set("strictQuery", false);

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.log("Mongo Error:", error.message);
  });
