require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");

// Database configurations
const db = require("./models");

// Init app
const app = express();
app.use(bodyParser.json());

// Import routes
const statsRoutes = require("./routes/stats");
const mutantRoutes = require("./routes/mutant");

// Use routes
app.use("/stats", statsRoutes);
app.use("/mutant", mutantRoutes);

// Not found routes
app.use(async (req, res, next) => {
  const err = new Error("Route not found!");
  err.status = 404;
  next(err);
});

// Error Handler
app.use(async (err, req, res, next) => {
  const status = err.status || 500;
  res.status(status).json({ message: err.message });
});

// Connect to database and init app
db.mongoose
  .connect("mongodb+srv://root:toor@cluster0.1cm0djm.mongodb.net/ficohsa")
  .then(() => {
    console.log("Connected");
    app.listen(process.env.PORT || 3000);
    // dbInit().then(() => {});
  })
  .catch((err) => {
    console.log("Connection error", err);
  });

module.exports = app;
