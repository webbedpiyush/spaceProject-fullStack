const fs = require("fs");
const { parse } = require("csv-parse");
const path = require("path");

const planets = require("./planets.mongo");

function helper(planet) {
  return (planet =
    planet["koi_disposition"] === "CONFIRMED" &&
    planet["koi_prad"] < 1.6 &&
    planet["koi_insol"] > 0.36 &&
    planet["koi_insol"] < 1.11);
}

function loadPlanetData() {
  return new Promise((resolve, reject) => {
    const stream = fs
      .createReadStream(
        path.join(__dirname, "..", "..", "data", "kepler_data.csv")
      )
      .pipe(
        parse({
          comment: "#",
          columns: true,
        })
      );

    stream.on("data", async (chunk) => {
      if (helper(chunk)) {
        // res.push(chunk);
        try {
          await planets.updateOne(
            { keplerName: chunk.kepler_name },
            { keplerName: chunk.kepler_name },
            { upsert: true }
          );
        } catch (error) {
          console.error("Error updating planet in database:", error);
        }
      }
    });

    stream.on("end", async () => {
      // const nameHabitablePlanets = res.map((planet) => {
      //   return planet["kepler_name"];
      // });
      const planetsFound = (await getAllPlanets()).length;
      console.log(`${planetsFound} planets found habitable for humans`);
      // console.log(nameHabitablePlanets);
      // console.log(`${res.length} planets found habitable for humans.`);
      resolve();
    });

    stream.on("error", (err) => {
      console.log(err);
      reject();
    });
  });
}

async function getAllPlanets() {
  return await planets.find({}, { __v: 0, _id: 0 });
}
module.exports = {
  loadPlanetData,
  getAllPlanets,
};
