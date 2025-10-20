import { supabase } from '$lib/utils/supabaseClient';
import { GOLFCOURSEAPI_KEY } from '$env/static/private';

export async function load() {
  const { data: flights, error: flightsError } = await supabase
    .from('flights')
    .select(`
      *,
      golf_courses (
        id,
        name
      ),
      flight_users (
        user_id,
        users (
          id,
          email,
          first_name,
          last_name
        )
      )
    `);

  const { data: users, error: usersError } = await supabase
    .from('users')
    .select('*')

  if (flightsError || usersError) {
    console.error(flightsError || usersError)
    return {
      flights: [],
      users: []
    }
  }

  function formatDate(dateString) {
    const date = new Date(dateString)
    const options = { weekday: 'long', day: 'numeric', month: 'long' }
    return new Intl.DateTimeFormat('nl-NL', options).format(date)
  }

  function formatTime(timeString) {
    return timeString.slice(0, 5)
  }

  const formattedFlights = flights.map(flight => ({
    ...flight,
    pretty_date: formatDate(flight.date),
    pretty_time: formatTime(flight.time),
    flight_users: flight.flight_users.sort((a, b) => a.users.first_name.localeCompare(b.users.first_name))
  }))

  formattedFlights.sort((a, b) => new Date(a.date) - new Date(b.date))

   const golfcoursesRespons = await fetch('https://api.golfcourseapi.com/v1/search?search_query=dubai', {
    method: 'GET',
    headers: {
      'Authorization': 'Key ' + GOLFCOURSEAPI_KEY
    }
  });

  const golfcourses = await golfcoursesRespons.json();

  console.log(golfcourses)

  const golfcourseRespons = await fetch('https://api.golfcourseapi.com/v1/courses/14713', {
    method: 'GET',
    headers: {
      'Authorization': 'Key ' + GOLFCOURSEAPI_KEY
    }
  });

  const golfcourse = await golfcourseRespons.json();

  return {
    flights: formattedFlights ?? [],
    users: users ?? [],
    golfcourse
  }
}