const fs = require("fs");
const path = require("path"); //used whenever looking for a relative path
const { parse } = require("csv-parse");

const habitablePlanets = [];

function isHabitable(planet) {
  return (
    planet["koi_disposition"] === "CONFIRMED" &&
    planet["koi_insol"] > 0.36 &&
    planet["koi_insol"] < 1.11 &&
    planet["koi_prad"] < 1.6
  );
}

/**
 * const promise = new Promise((resolve, reject) => {
 *  resolve(42);
 * });
 * promise.then((result) => {
 *
 * });
 *
 * const result = await promise;
 * console.log(result);
 *
 */

//using a promise to ensure that before making a request for planets the data is loaded
function loadPlanetsData() {
  return new Promise((resolve, reject) => {
    fs.createReadStream(
      path.join(__dirname, "..", "..", "data", "kepler_data.csv")
    )
      .pipe(parse({ comment: "#", columns: true }))
      .on("data", (data) => {
        if (isHabitable(data)) {
          habitablePlanets.push(data);
        }
      })
      .on("error", (error) => {
        console.log(error);
        reject(error); //if promise fails
      })
      .on("end", () => {
        console.log("Loading planets...");
        console.log(`${habitablePlanets.length} habitable planets were found!`);
        resolve(); //if promise succeeds
      });
  });
}

function getAllPlanets() {
  console.log(habitablePlanets);
  return habitablePlanets;
}

module.exports = {
  loadPlanetsData,
  getAllPlanets,
};
