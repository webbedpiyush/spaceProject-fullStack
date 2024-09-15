const {
  getAllLaunches,
  launchExistByLaunchID,
  launchAbortByLaunchId,
  scheduleNewLaunch,
} = require("../../models/launches.model");
const { getPagination } = require("../../services/query");

async function httpGetAllLaunches(req, res) {
  const { skip, limit } = getPagination(req.query);
  const launches = await getAllLaunches(skip, limit);
  res.status(200).json(launches);
}

async function httpAddNewLaunch(req, res) {
  const launch = req.body;

  if (
    !launch.launchDate ||
    !launch.mission ||
    !launch.rocket ||
    !launch.target
  ) {
    return res.status(400).json({
      error: "Missing required launch property",
    });
  }

  launch.launchDate = new Date(launch.launchDate);
  if (isNaN(launch.launchDate)) {
    return res.status(400).json({
      error: "Invalid Date",
    });
  }

  // addNewLaunch(launch);
  await scheduleNewLaunch(launch);
  return res.status(201).json(launch);
}

async function httpAbortLaunch(req, res) {
  // convert the params from string to number for indexing
  const launchId = Number(req.params.id);

  const existsLaunch = await launchExistByLaunchID(launchId);
  // if it doesn't exist then 404
  if (!existsLaunch) {
    res.status(404).json({
      error: "launch doesn't exist",
    });
  }

  // if the launch exist then abort it
  const response = await launchAbortByLaunchId(launchId);
  if (!response) {
    return res.status(400).json({
      error: "Launch not aborted",
    });
  }
  res.status(200).json({
    ok: true,
  });
}
module.exports = {
  httpGetAllLaunches,
  httpAddNewLaunch,
  httpAbortLaunch,
};
