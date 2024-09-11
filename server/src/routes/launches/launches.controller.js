const {
  getAllLaunches,
  launchExistByLaunchID,
  launchAbortByLaunchId,
  scheduleNewLaunch,
} = require("../../models/launches.model");

async function httpGetAllLaunches(req, res) {
  res.status(200).json(await getAllLaunches());
}

async function httpAddNewLaunch(req, res) {
  const launch = req.body;

  if (
    !launch.launchDate ||
    !launch.mission ||
    !launch.rocket ||
    !launch.target
  ) {
    res.status(400).json({
      error: "Missing required launch property",
    });
  }

  launch.launchDate = new Date(launch.launchDate);
  if (isNaN(launch.launchDate)) {
    res.status(400).json({
      error: "Invalid Date",
    });
  }

  // addNewLaunch(launch);
  await scheduleNewLaunch(launch);
  res.status(201).json(launch);
}

function httpAbortLaunch(req, res) {
  // convert the params from string to number for indexing
  const launchId = Number(req.params.id);

  // if it doesn't exist then 404
  if (!launchExistByLaunchID(launchId)) {
    res.status(404).json({
      error: "launch doesn't exist",
    });
  }

  // if the launch exist then abort it
  const response = launchAbortByLaunchId(launchId);
  res.status(200).json(response);
}
module.exports = {
  httpGetAllLaunches,
  httpAddNewLaunch,
  httpAbortLaunch,
};
