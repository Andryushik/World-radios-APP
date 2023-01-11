//import { getServerConfig } from './serverConfig.js';

// Check which request to send search or top5 by default
async function getStations(data) {
  if (data) {
    return await getStationsSearch(data);
  }
  return getStationsTop();
}

async function getStationsTop() {
  const countryCode = document.getElementById("country").value;

  if (countryCode !== "" || !!countryCode) {
    return await getStationsSearch();
  }
  try {
    // eslint-disable-next-line no-undef
    const response = await axios.post(
      "https://de1.api.radio-browser.info/json/stations/search",
      { limit: 5, order: "clickcount", reverse: true }
    );
    return response.data;
  } catch (error) {
    console.error(error);
  }
}

async function getStationsSearch(searchText) {
  try {
    const countryCode = document.getElementById("country").value;
    // eslint-disable-next-line no-undef
    const response = await axios.post(
      "https://de1.api.radio-browser.info/json/stations/search",
      countryCode === "" || !countryCode
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

export { getStations };
