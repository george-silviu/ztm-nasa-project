const fs = require("fs");
const path = require("path"); //used whenever looking for a relative path
const { parse } = require("csv-parse");

const planets = require("./planets.mongo");

function isHabitable(planet) {
  return (
    planet["koi_disposition"] === "CONFIRMED" &&
    planet["koi_insol"] > 0.36 &&
    planet["koi_insol"] < 1.11 &&
    planet["koi_prad"] < 1.6
  );
}

//using a promise to ensure that before making a request for planets the data is loaded
function loadPlanetsData() {
  return new Promise((resolve, reject) => {
    fs.createReadStream(
      path.join(__dirname, "..", "..", "data", "kepler_data.csv")
    )
      .pipe(parse({ comment: "#", columns: true }))
      .on("data", async (data) => {
        if (isHabitable(data)) {
          savePlanet(data);
        }
      })
      .on("error", (error) => {
        console.log(error);
        reject(error); //if promise fails
      })
      .on("end", async () => {
        const countPlanetsFound = (await getAllPlanets()).length;
        console.log("Loading planets...");
        console.log(`${countPlanetsFound} habitable planets were found!`);
        resolve(); //if promise succeeds
      });
  });
}

async function getAllPlanets() {
  return await planets.find({}, { _id: 0, __v: 0 });
}

async function savePlanet(planet) {
  //planet will  be added if do not exists
  try {
    await planets.updateOne(
      {
        keplerName: planet.kepler_name,
      },
      {
        keplerName: planet.kepler_name,
      },
      {
        upsert: true,
      }
    );
  } catch (err) {
    console.error(`Could not save a planet ${err}`);
  }
}

module.exports = {
  loadPlanetsData,
  getAllPlanets,
};
