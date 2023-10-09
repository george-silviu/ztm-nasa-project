const mongoose = require("mongoose");

//mongodb connection string
const MONGO_URL = `mongodb+srv://nasa-api:jEL4lzpf14Pj1K36@nasa-db.6olq2y3.mongodb.net/?retryWrites=true&w=majority`;

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
