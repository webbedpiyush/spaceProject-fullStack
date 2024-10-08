const mongoose = require("mongoose");

const launchesSchema = new mongoose.Schema({
  flightNumber: {
    type: String,
    required: true,
  },
  launchDate: {
    type: Date,
    required: true,
  },
  mission: {
    type: String,
    required: true,
  },
  rocket: {
    type: String,
    required: true,
  },
  target: {
    type: String,
  },
  succes: {
    type: Boolean,
    required: true,
    default: true,
  },
  upcoming: {
    type: Boolean,
    required: true,
  },
  customers: [String],
});

// connects a launchesSchema with the "launches" collection
module.exports = mongoose.model("Launch", launchesSchema);
