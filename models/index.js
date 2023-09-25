const mongoose = require("mongoose");

const db = {};

db.mongoose = mongoose;

db.Stat = require("./Stat.model");

module.exports = db;
