import { supabase } from '$lib/utils/supabaseClient';
import { GOLFCOURSEAPI_KEY, GIPHY_KEY } from '$env/static/private';

export async function load() {
  // get flights
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

  // get users
  const { data: users, error: usersError } = await supabase
    .from('users')
    .select('*');
  
  // get goflcourses
  const { data: golf_courses, error: coursesError } = await supabase
    .from('golf_courses')
    .select('*');

  if (flightsError || usersError || coursesError) {
    console.error(flightsError || usersError);
    return {
      flights: [],
      users: [],
      golf_courses: []
    };
  }

  // helpers
  function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { weekday: 'long', day: 'numeric', month: 'long' };
    return new Intl.DateTimeFormat('nl-NL', options).format(date);
  }

  function formatTime(timeString) {
    return timeString.slice(0, 5);
  }

  const formattedFlights = flights.map((flight) => ({
    ...flight,
    pretty_date: formatDate(flight.date),
    pretty_time: formatTime(flight.time),
    flight_users: flight.flight_users.sort((a, b) =>
      a.users.first_name.localeCompare(b.users.first_name)
    )
  }));

  formattedFlights.sort((a, b) => new Date(a.date) - new Date(b.date));

  // get golfcourse from memory lane
  const golfCourseURL = 'https://api.golfcourseapi.com/v1/courses/14713';
  const golfcourseRespons = await fetch(golfCourseURL, {
    method: 'GET',
    headers: {
      Authorization: 'Key ' + GOLFCOURSEAPI_KEY
    }
  });

  const golfcourse = await golfcourseRespons.json();

  // get random golf giphy
  const giphyURL = 'https://api.giphy.com/v1/gifs/random';
  const randomGiphyResponse = await fetch(
    `${giphyURL}?api_key=${GIPHY_KEY}&tag=golf`
  );
  const randomGiphy = await randomGiphyResponse.json();

  return {
    flights: formattedFlights ?? [],
    users: users ?? [],
    golf_courses: golf_courses ?? [],
    golfcourse,
    randomGiphy
  };
}

export const actions = {
  addFlight: async ({ request, locals }) => {
    const formData = await request.formData();
    const date = formData.get('date');
    const time = formData.get('time');
    const golf_course_id = formData.get('golf_course_id');
    const user_ids = formData.getAll('user_ids');
    const creator = locals.user?.id || null;

    // insert flight
    const { data: flight, error: flightError } = await supabase
      .from('flights')
      .insert({ date, time, golf_course_id, creator })
      .select(
        `id, date, time, golf_course_id, creator, created_at,
         golf_courses(name),
         flight_users(user_id, users!inner(id, first_name, last_name))`
      )
      .single();

    if (flightError) {
      return { success: false, message: 'Kon flight niet aanmaken', action: 'add' };
    }

    // insert flight_users if any
    if (user_ids.length > 0) {
      const flightUsers = user_ids.map((user_id) => ({
        flight_id: flight.id,
        user_id
      }));

      const { error: usersError } = await supabase.from('flight_users').insert(flightUsers);
      if (usersError) {
        // still return success for flight creation but indicate partial failure
        return {
          success: true,
          message: 'Flight aangemaakt, maar spelers konden niet gekoppeld worden',
          action: 'add',
          flight
        };
      }
    }

    // re-fetch flight with related users & course to return full object
    const { data: fullFlight } = await supabase
      .from('flights')
      .select(
        `id, date, time, golf_course_id, creator, created_at,
         golf_courses!inner(id, name),
         flight_users!inner(user_id, users!inner(id, first_name, last_name))`
      )
      .eq('id', flight.id)
      .single();

    return { success: true, message: 'Flight aangemaakt', action: 'add', flight: fullFlight };
  },

  editFlight: async ({ request }) => {
    const formData = await request.formData();
    const id = formData.get('flight_id');
    const date = formData.get('date');
    const time = formData.get('time');
    const golf_course_id = formData.get('golf_course_id');
    const user_ids = formData.getAll('user_ids');

    // update flights row
    const { data: updated, error: updateError } = await supabase
      .from('flights')
      .update({ date, time, golf_course_id })
      .eq('id', id)
      .select()
      .single();

    if (updateError) {
      return { success: false, message: 'Kon flight niet bijwerken', action: 'edit' };
    }

    // replace flight_users: delete existing then insert new set
    await supabase.from('flight_users').delete().eq('flight_id', id);

    if (user_ids && user_ids.length > 0) {
      const flightUsers = user_ids.map((user_id) => ({
        flight_id: id,
        user_id
      }));
      const { error: insertError } = await supabase.from('flight_users').insert(flightUsers);
      if (insertError) {
        return { success: false, message: 'Kon spelers niet bijwerken', action: 'edit' };
      }
    }

    // fetch full updated flight
    const { data: fullFlight, error: fetchError } = await supabase
      .from('flights')
      .select(
        `id, date, time, golf_course_id, creator, created_at,
         golf_courses!inner(id, name),
         flight_users!inner(user_id, users!inner(id, first_name, last_name))`
      )
      .eq('id', id)
      .single();

    if (fetchError) {
      return { success: true, message: 'Flight bijgewerkt (gedeeltelijk)', action: 'edit', flight: updated };
    }

    return { success: true, message: 'Flight bijgewerkt', action: 'edit', flight: fullFlight };
  },

  deleteFlight: async ({ request }) => {
    const formData = await request.formData();
    const id = formData.get('flight_id');

    const { error } = await supabase.from('flights').delete().eq('id', id);

    if (error) {
      return { success: false, message: 'Kon flight niet verwijderen', action: 'delete' };
    }

    return { success: true, message: 'Flight verwijderd', action: 'delete', id };
  },

  removeUserFromFlight: async ({ request }) => {
    const formData = await request.formData();
    const flight_id = formData.get('flight_id');
    const user_id = formData.get('user_id');

    const { error } = await supabase
      .from('flight_users')
      .delete()
      .match({ flight_id, user_id });

    if (error) return { success: false, message: 'Kon speler niet verwijderen', action: 'removeUser' };

    return { 
      success: true, 
      action: 'removeUser', 
      message: 'Golfer verwijderd uit flight',
      flight_id, 
      user_id 
    };
  },

  refreshGiphy: async () => {
    const url = 'https://api.giphy.com/v1/gifs/random';
    const response = await fetch(`${url}?api_key=${GIPHY_KEY}&tag=golf`);
    const randomGiphy = await response.json();

    return {
      success: true,
      action: 'refreshGiphy',
      randomGiphy
    };
  }
};
