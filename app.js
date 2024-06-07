const express = require("express");
const mongoose = require("mongoose");
const authRoutes = require("./src/routes/authRoutes");
const eventRoutes = require("./src/routes/eventRoutes");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (process.env.MONGODB_URI && process.env.NODE_ENV !== "test") {
  mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => {
      console.log("DB connected successfully!");
    })
    .catch((err) => {
      console.log(err);
    });
}

app.use("/auth", authRoutes);
app.use("/events", eventRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports = app;
