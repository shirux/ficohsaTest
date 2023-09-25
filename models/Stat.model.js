const { boolean } = require("joi");
const mongoose = require("mongoose");

const Stat = mongoose.model(
  "Stat",
  new mongoose.Schema({
    isMutant: {
      type: Boolean,
      required: true,
    },
  })
);

module.exports = Stat;
