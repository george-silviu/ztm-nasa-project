const http = require("http");

require("dotenv").config(); //get the secrets for this app

const app = require("./app");
const { mongoConnect } = require("./services/mongo");
const { loadPlanetsData } = require("./models/planets.model");
const { loadLaunchesData } = require("./models/launches.model");

const PORT = process.env.PORT || 8000;

const server = http.createServer(app);

async function startServer() {
  //logic that must happen before the server starts : load data, perform actions, setting up a db, downloading files, checking 3rd party services

  //connect to db
  await mongoConnect();

  //wait the planets data to load
  await loadPlanetsData();

  //get lauch data from launch model (SplaceX launches)
  await loadLaunchesData();

  //server starts to listen for requests
  server.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}...`);
  });
}

startServer();
