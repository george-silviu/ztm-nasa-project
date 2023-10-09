const mongoose = require("mongoose");

const lauchesSchema = new mongoose.Schema({
  flightNumber: {
    type: Number,
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
    //required: true,
  },
  target: {
    type: String,
    required: true,
  },
  customers: [String],
  upcoming: {
    type: Boolean,
    required: true,
  },
  success: {
    type: Boolean,
    required: true,
    default: true,
  },

  //simulating sql relation
  //   target: {
  //     type: mongoose.ObjectId,
  //     ref: "Planet",
  //   },
});

//connects launchesSchema with "launches" collection
module.exports = mongoose.model("Launch", lauchesSchema);
