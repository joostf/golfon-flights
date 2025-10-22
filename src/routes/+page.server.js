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

  const { data: golf_courses, error: coursesError } = await supabase
    .from('golf_courses')
    .select('*')

  if (flightsError || usersError || coursesError) {
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
    golf_courses: golf_courses ?? [],
    golfcourse
  }
}

export const actions = {
  addFlight: async ({ request, locals }) => {
    const formData = await request.formData();

    console.log(formData)

    const date = formData.get('date');
    const time = formData.get('time');
    const golf_course_id = formData.get('golf_course_id');
    const user_ids = formData.getAll('user_ids');

    const creator = locals.user?.id;

    // Insert flight
    const { data: flight, error: flightError } = await supabase
      .from('flights')
      .insert({ date, time, golf_course_id, creator })
      .select()
      .single();

    if (flightError) {
      console.error('Error inserting flight:', flightError);
      return { success: false };
    }

    // Insert flight users
    const flightUsers = user_ids.map(user_id => ({
      flight_id: flight.id,
      user_id
    }));

    if (flightUsers.length > 0) {
      const { data: insertedUsers, error: usersError } = await supabase
        .from('flight_users')
        .insert(flightUsers)
        .select();

      if (usersError) console.error('Error inserting flight users:', usersError);

      // Attach users to flight object so you can update the page
      flight.flight_users = insertedUsers;
    }

    return { success: true, flight, message: 'Flight succesvol toegevoegd! ⛳️' };
  }
};

