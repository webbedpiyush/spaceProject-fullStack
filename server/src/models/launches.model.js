const launches = require("./launches.mongo");
const planets = require("../models/planets.mongo");

// const launches = new Map();

// let latestFlightNumber = 100;DEFAULT_FLIGHT_NUM
const DEFAULT_FLIGHT_NUM = 100;

const launch = {
  flightNumber: 100,
  mission: "Kepler Exploration X",
  rocket: "Explorer IS1",
  launchDate: new Date("December 27,2030"),
  target: "Kepler-442 b",
  customers: ["ISRO", "NASA"],
  upcoming: true,
  success: true,
};

// launches.set(launch.flightNumber, launch);
saveLaunch(launch);

async function getAllLaunches() {
  return await launches.find({}, { __v: 0, _id: 0 });
  // return Array.from(launches.values());
}

async function saveLaunch(launch) {
  const planet = await planets.findOne(
    {
      keplerName: launch.target,
    },
    { __v: 0, _id: 0 }
  );

  if (!planet) {
    throw new Error("no matching planets was found");
  }

  await launches.findOneAndUpdate(
    { flightNumber: launch.flightNumber },
    launch,
    {
      upsert: true,
    }
  );

  launches.find;
}

async function scheduleNewLaunch(launch) {
  const newFlightNumber = Number(await getLatestFlightNumber()) + 1;
  const newLaunch = {
    ...launch,
    succes: true,
    upcoming: true,
    customers: ["ME", "ISRO"],
    flightNumber: newFlightNumber,
  };
  await saveLaunch(newLaunch);
}

async function launchAbortByLaunchId(id) {
  // const aborted = launches.get(id);
  // aborted.upcoming = false;
  // aborted.success = false;
  // return aborted;
  const aborted = await launches.updateOne(
    {
      flightNumber: id,
    },
    {
      upcoming: false,
      succes: false,
    }
  );
  // console.log(aborted);
  return aborted.acknowledged && aborted.modifiedCount === 1;
}

async function launchExistByLaunchID(id) {
  return await launches.findOne({
    flightNumber: id,
  });
  // return launches.has(id);
}

async function getLatestFlightNumber() {
  // sorted in descending order high to low
  const latestLaunch = await launches.findOne().sort("-flightNumber");
  if (!latestLaunch) {
    return DEFAULT_FLIGHT_NUM;
  }
  return latestLaunch.flightNumber;
}
module.exports = {
  getAllLaunches,
  launchAbortByLaunchId,
  launchExistByLaunchID,
  scheduleNewLaunch,
};
