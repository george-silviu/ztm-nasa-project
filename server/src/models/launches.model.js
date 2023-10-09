const launchesDatabase = require("./launches.mongo");
const planets = require("./planets.mongo");

const DEFAULT_FLIGHT_NUMBER = 100;

const launch = {
  flightNumber: 100,
  mission: "Kepler Exploration X", //must be sent
  rocket: "Explorer IS1", //must be sent
  launchDate: new Date("December 27, 2030"), //must be sent
  target: "Kepler-442 b", //must be sent
  customers: ["ZTM", "NASA"],
  upcoming: true,
  success: true,
};

//save launch in db
saveLaunch(launch);

async function existsLaunchWithId(launchId) {
  return await launchesDatabase.findOne({ flightNumber: launchId });
}

async function getAllLaunches() {
  return await launchesDatabase.find({}, { _id: 0, __v: 0 });
}

async function getLatestFlightNumber() {
  const latestLunch = await launchesDatabase.findOne().sort("-flightNumber");

  if (!latestLunch) {
    return DEFAULT_FLIGHT_NUMBER;
  }

  return latestLunch.flightNumber;
}

async function saveLaunch(launch) {
  //before saving a launch check if the target planet exists
  const planet = await planets.findOne({ keplerName: launch.target });

  //throw error if no planet was found
  if (!planet) {
    throw new Error("No matching planet was found.");
  }

  //if flight number do not exists, insert the launch
  await launchesDatabase.findOneAndUpdate(
    {
      flightNumber: launch.flightNumber,
    },
    launch,
    {
      upsert: true,
    }
  );
}

//function called in controller
async function scheduleNewLunch(launch) {
  //generate the new flight number for the new launch
  const newFlightNumber = (await getLatestFlightNumber()) + 1;

  //assign default properties to the new launch
  const newLaunch = Object.assign(launch, {
    success: true,
    upcoming: true,
    customers: ["Zero to Mastery", "NASA"],
    flightNumber: newFlightNumber,
  });

  //save the new launch in db
  await saveLaunch(newLaunch);
}

// function addNewLaunch(launch) {
//   latestFlightNumber++;
//   launches.set(
//     latestFlightNumber,
//     Object.assign(launch, {
//       upcoming: true,
//       success: true,
//       customers: ["Zero to Mastery", "NASA"],
//       flightNumber: latestFlightNumber,
//     })
//   );
// }

async function abortLaunchById(launchId) {
  const aborted = await launchesDatabase.updateOne(
    { flightNumber: launchId },
    {
      upcoming: false,
      success: false,
    }
  );

  return aborted.modifiedCount === 1;
}

module.exports = {
  existsLaunchWithId,
  getAllLaunches,
  scheduleNewLunch,
  abortLaunchById,
};
