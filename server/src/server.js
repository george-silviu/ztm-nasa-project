const http = require("http");
const mongoose = require("mongoose");

const app = require("./app");

const { loadPlanetsData } = require("./models/planets.model");

const PORT = process.env.PORT || 8000;

//mongodb connection string
const MONGO_URL = `mongodb+srv://nasa-api:jEL4lzpf14Pj1K36@nasa-db.6olq2y3.mongodb.net/?retryWrites=true&w=majority`;

const server = http.createServer(app);

mongoose.connection.once("open", () => {
  console.log("MongoDB connection ready!");
});

mongoose.connection.on("error", (err) => {
  console.error(err);
});

async function startServer() {
  //logic that must happen before the server starts : load data, perform actions, setting up a db, downloading files, checking 3rd party services

  //connect to db
  await mongoose.connect(MONGO_URL);

  //wait the planets data to load
  await loadPlanetsData();
  //server starts to listen for requests
  server.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}...`);
  });
}

startServer();
