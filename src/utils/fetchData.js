let serverUrl = "https://de2.api.radio-browser.info";

function checkServer() {
  document
    .querySelectorAll("input[type=radio][name=server]")
    .forEach((radio) => {
      if (radio.value === serverUrl) radio.checked = true;
    });
}
function changeServer() {
  const selectedServer = document.querySelector(
    "input[type=radio][name=server]:checked"
  );
  serverUrl = selectedServer.value;
}

// Check which request to send search or top5 by default
async function getStations(data) {
  if (data) {
    return await getStationsSearch(data);
  }
  return getStationsTop();
}

async function getStationsTop() {
  const countryCode = document.getElementById("country").value;

  if (countryCode !== "xx") {
    return await getStationsSearch();
  }
  try {
    const response = await axios.post(`${serverUrl}/json/stations/search`, {
      limit: 5,
      order: "clickcount",
      reverse: true,
    });
    return response.data;
  } catch (error) {
    console.error(error);
  }
}

async function getStationsSearch(searchText) {
  try {
    const countryCode = document.getElementById("country").value;
    const response = await axios.post(
      `${serverUrl}/json/stations/search`,
      countryCode === "xx"
        ? {
          name: searchText,
          limit: 5,
          order: "votes",
          reverse: true,
        }
        : {
          name: searchText,
          limit: 5,
          countrycode: countryCode,
          order: "votes",
          reverse: true,
        }
    );
    return response.data;
  } catch (error) {
    console.error(error);
  }
}

export { getStations, changeServer, checkServer };
