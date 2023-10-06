const mongoose = require("mongoose");

const planetsSchema = new mongoose.Schema({
  keplerName: {
    type: String,
    required: true,
  },
});

//connects launchesSchema with "planets" collection
module.exports = mongoose.model("Planet", planetsSchema);
