const mongoose = require("mongoose");

require("dotenv").config(); //get the secrets

//mongodb connection string
const MONGO_URL = process.env.MONGO_URL;

mongoose.connection.once("open", () => {
  console.log("MongoDB connection ready!");
});

mongoose.connection.on("error", (err) => {
  console.error(err);
});

mongoose.connection.on("mongoDisconnect", () => {
  console.log("Disconnected from MongoDb...");
});

async function mongoConnect() {
  await mongoose.connect(MONGO_URL);
}

async function mongoDisconnect() {
  await mongoose.disconnect();
  mongoose.connection.emit("mongoDisconnect");
}

module.exports = {
  mongoConnect,
  mongoDisconnect,
};
