//import { getServerConfig } from './serverConfig.js';
//import { searchText } from '../app.js';

async function getStations(data) {
  if (data) {
    const searchText = data;
    console.log(searchText);
    return await getStationsSearch(searchText);
  }
  return getStationsTop();
}

async function getStationsTop() {
  try {
    // eslint-disable-next-line no-undef
    const response = await axios.post(
      'http://all.api.radio-browser.info/json/stations/search',
      { order: 'votes', limit: 5, reverse: true },
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
      'http://all.api.radio-browser.info/json/stations/search',
      {
        limit: 5,
        name: searchText,
        order: 'votes',
        reverse: true,
      },
    );
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error(error);
  }
}

export { getStations };
