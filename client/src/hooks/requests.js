const API_URL = "http://localhost:8000/v1";

async function httpGetPlanets() {
  try {
    const res = await fetch(`${API_URL}/planets`);
    const data = await res.json();
    console.log(data);
    return data;
  } catch (error) {
    console.error(error.message);
  }
}

// Load launches, sort by flight number, and return as JSON.
async function httpGetLaunches() {
  const res = await fetch(`${API_URL}/launches`);
  const launchesData = await res.json();
  return launchesData.sort((a, b) => {
    return a.flightNumber - b.flightNumber;
  });
}

// Submit given launch data to launch system.
async function httpSubmitLaunch(launch) {
  try {
    return await fetch(`${API_URL}/launches`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(launch),
    });
  } catch (err) {
    return {
      ok: false,
    };
  }
}

async function httpAbortLaunch(id) {
  try {
    return await fetch(`${API_URL}/launches/${id}`, {
      method: "DELETE",
    });
  } catch (error) {
    console.log(error);
    return {
      ok: false,
    };
  }
  // Delete launch with given ID.
}

export { httpGetPlanets, httpGetLaunches, httpSubmitLaunch, httpAbortLaunch };
