//import { getServerConfig } from './serverConfig.js';
//import { createCarousel, stationsData } from '../carousel.js';

function getStations() {
  // if (search) {
  //   // under construction
  // }
  return getStationsTop();
}

async function getStationsTop() {
  try {
    // eslint-disable-next-line no-undef
    const response = await axios.post(
      'http://nl1.api.radio-browser.info/json/stations/topvote/5',
    );
    return response.data;
  } catch (error) {
    console.error(error);
  }
}

export { getStations };
