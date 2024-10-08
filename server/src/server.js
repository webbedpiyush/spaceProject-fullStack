// this way of creating a server will give us more a flexible way to organise our server
const http = require("http");
require("dotenv").config();

const { mongoConnect } = require("./services/mongo");
const app = require("./app");
const { loadPlanetData } = require("./models/planets.model");
const { loadLaunchData } = require("./models/launches.model");

const PORT = process.env.PORT || 8000;

const server = http.createServer(app);

async function startServer() {
  await mongoConnect();
  await loadPlanetData();
  await loadLaunchData();

  server.listen(PORT, () => {
    console.log(`Listening on the PORT:${PORT}...`);
  });
}

startServer();
