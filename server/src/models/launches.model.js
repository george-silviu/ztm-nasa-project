const axios = require("axios");

const launchesDatabase = require("./launches.mongo");
const planets = require("./planets.mongo");

const DEFAULT_FLIGHT_NUMBER = 100;

const SPACEX_API_URL = "https://api.spacexdata.com/v4/launches/query";

// calling the SpaceX API and saving launches in our database
async function populateLaunches() {
  console.log("Downloading launch data...");
  //make request to SpaceX API
  const response = await axios.post(SPACEX_API_URL, {
    query: {},
    options: {
      pagination: false,
      populate: [
        {
          path: "rocket",
          select: {
            name: 1,
          },
        },
        {
          path: "payloads",
          select: {
            customers: 1,
          },
        },
      ],
    },
  });

  //validate the API call response
  if (response.status !== 200) {
    console.log("Problem downloading launch data from SpaceX API.");
    throw new Error("Launch data donload failed.");
  }

  //map the response data from response
  const launchDocs = response.data.docs;
  for (const launchDoc of launchDocs) {
    //get the payloads
    const payloads = launchDoc["payloads"];
    //get the customers from all payloads into one array
    const customers = payloads.flatMap((payload) => {
      return payload["customers"];
    });

    //map each launchDoc into an js object
    const launch = {
      flightNumber: launchDoc["flight_number"],
      mission: launchDoc["name"],
      rocket: launchDoc["rocket"]["name"],
      launchDate: launchDoc["date_local"],
      customers: customers,
      upcoming: launchDoc["upcoming"],
      success: launchDoc["success"],
    };

    console.log(`${launch.flightNumber} ${launch.mission}`);

    //populate launches collection
    await saveLaunch(launch);
  }
}

//load launches data from SpaceX API
async function loadLaunchesData() {
  //before loading the data, check that in our database the first lauch returned from API do not exist
  const firstLaunch = await findLaunch({
    flightNumber: 1,
    rocket: "Falcon 1",
    mission: "FalconSat",
  });

  //validate that the launches were not loaded already
  if (firstLaunch) {
    //log a message
    console.log("Launch data already loaded!");
  } else {
    //call the API and save the launches
    await populateLaunches();
  }
}

//thin function will minimize API load
async function findLaunch(filter) {
  return await launchesDatabase.findOne(filter);
}

async function existsLaunchWithId(launchId) {
  return await findLaunch({ flightNumber: launchId });
}

//get all launches from db
async function getAllLaunches(skip, limit) {
  return await launchesDatabase
    .find({}, { _id: 0, __v: 0 })
    .sort({ flightNumber: 1 }) //-1 for desc/1 for asc
    .skip(skip)
    .limit(limit);
}

async function getLatestFlightNumber() {
  const latestLunch = await launchesDatabase.findOne().sort("-flightNumber");

  if (!latestLunch) {
    return DEFAULT_FLIGHT_NUMBER;
  }

  return latestLunch.flightNumber;
}

//store a launch in db
async function saveLaunch(launch) {
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
  //before saving a launch check if the target planet exists
  const planet = await planets.findOne({ keplerName: launch.target });

  //throw error if no planet was found
  if (!planet) {
    throw new Error("No matching planet was found.");
  }

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
  loadLaunchesData,
  existsLaunchWithId,
  getAllLaunches,
  scheduleNewLunch,
  abortLaunchById,
};
