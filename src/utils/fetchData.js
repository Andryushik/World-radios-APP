//import { getServerConfig } from './serverConfig.js';
import { searchText } from '../app.js';

function getStations() {
  // if (searchText.value !== '') {
  // console.log(
  //   `https://de1.api.radio-browser.info/json/stations/byname/${searchText.value}`,
  // );
  //   return getStationsSearch();
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

// async function getStationsSearch() {
//   try {
//     // eslint-disable-next-line no-undef
//     const response = await axios.post(
//       `https://de1.api.radio-browser.info/json/stations/byname/${searchText.value}`,
//     );
//     console.log(response.data);
//     return response.data;
//   } catch (error) {
//     console.error(error);
//   }
// }

export { getStations };
