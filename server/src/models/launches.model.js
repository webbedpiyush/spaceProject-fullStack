const axios = require("axios");

const launches = require("./launches.mongo");
const planets = require("../models/planets.mongo");

const DEFAULT_FLIGHT_NUM = 100;
const SPACEX_API_URL = "https://api.spacexdata.com/v4/launches/query";

async function populateLaunches() {
  console.log("Downloading data from the spacex api...");
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

  if (response.status !== 200) {
    console.log("Problem downloading launch data");
    throw new Error("Launch data download failed");
  }

  const launchDocs = response.data.docs;
  for (const launchDoc of launchDocs) {
    const payloads = launchDoc.payloads;
    const customer = payloads.flatMap((item) => item.customers);

    const launchData = {
      flightNumber: launchDoc.flight_number,
      mission: launchDoc.name,
      rocket: launchDoc.rocket.name,
      launchDate: launchDoc.date_local,
      upcoming: launchDoc.upcoming,
      success: launchDoc.success,
      customers: customer,
    };
    console.log(`${launchData.flightNumber}. ${launchData.mission}`);
    saveLaunch(launchData);
  }
}

async function loadLaunchData() {
  const firstLaunch = await findLaunch({
    flightNumber: 1,
    rocket: "Falcon 1",
    mission: "FalconSat",
  });

  if (firstLaunch) {
    console.log("data is already downloaded...");
  } else {
    await populateLaunches();
  }
}

async function getAllLaunches(skip, limit) {
  return await launches
    .find({}, { __v: 0, _id: 0 })
    .sort({ flightNumber: 1 })
    .skip(skip)
    .limit(limit);
  // return Array.from(launches.values());
}

async function saveLaunch(launch) {
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
  const planet = await planets.findOne(
    {
      keplerName: launch.target,
    },
    { __v: 0, _id: 0 }
  );

  if (!planet) {
    throw new Error("no matching planets was found");
  }
  const newFlightNumber = Number(await getLatestFlightNumber()) + 1;
  const newLaunch = {
    ...launch,
    success: true,
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

async function findLaunch(filter) {
  return await launches.findOne(filter);
}

async function launchExistByLaunchID(id) {
  return await findLaunch({
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
  loadLaunchData,
};
