import { getAllFlightsData } from '$lib/server/flights.js';
import { getGolfcourse, getRandomGiphy } from '$lib/server/widgets.js';
import { login, logout } from '$lib/server/auth.js';
import {
  addFlight,
  editFlight,
  deleteFlight,
  removeUserFromFlight
} from '$lib/server/flights.js';

export async function load() {
  const [flightData, golfcourse, randomGiphy] = await Promise.all([
    getAllFlightsData(),
    getGolfcourse(),
    getRandomGiphy()
  ]);

  return {
    ...flightData,
    golfcourse,
    randomGiphy
  };
}

export const actions = {
  login,
  logout,
  addFlight,
  editFlight,
  deleteFlight,
  removeUserFromFlight
};
