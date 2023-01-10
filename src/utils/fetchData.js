//import { getServerConfig } from './serverConfig.js';
//import { favoritesData } from '../carousel.js';

// Check which request to send search or top5 by default
async function getStations(data) {
  if (data) {
    return await getStationsSearch(data);
  }
  return getStationsTop();
}

async function getStationsTop() {
  try {
    // eslint-disable-next-line no-undef
    const response = await axios.post(
      "http://all.api.radio-browser.info/json/stations/search",
      { limit: 5, order: "clickcount", reverse: true }
    );
    return response.data;
  } catch (error) {
    console.error(error);
  }
}

async function getStationsSearch(searchText) {
  try {
    // eslint-disable-next-line no-undef
    const response = await axios.post(
      "http://all.api.radio-browser.info/json/stations/search",
      {
        limit: 5,
        name: searchText,
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
