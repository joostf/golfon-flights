import { supabase } from '$lib/utils/supabaseClient';
import { formatDate, formatTime } from '$lib/server/utils.js';
import { requireUser } from './auth.js';

export async function getFlights() {
  const { data, error } = await supabase
    .from('flights')
    .select(`
      *,
      golf_courses (id, name),
      flight_users (
        user_id,
        users (id, email, first_name, last_name)
      )
    `);

  if (error) {
    console.error('Error fetching flights:', error);
    return [];
  }

  return data ?? [];
}

export async function getAllFlightsData() {
  const [flights, usersRes, coursesRes] = await Promise.all([
    getFlights(),
    supabase.from('users').select('*'),
    supabase.from('golf_courses').select('*')
  ]);

  const users = usersRes.data ?? [];
  const golf_courses = coursesRes.data ?? [];

  const formattedFlights = flights
    .map((flight) => ({
      ...flight,
      pretty_date: formatDate(flight.date),
      pretty_time: formatTime(flight.time),
      flight_users: flight.flight_users.sort((a, b) =>
        a.users.first_name.localeCompare(b.users.first_name)
      )
    }))
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  return { flights: formattedFlights, users, golf_courses };
}

export async function addFlight({ request, locals }) {
  requireUser(locals);

  const formData = await request.formData();
  const date = formData.get('date');
  const time = formData.get('time');
  const golf_course_id = formData.get('golf_course_id');
  const user_ids = formData.getAll('user_ids');
  const creator = locals.user?.id || null;

  const { data: flight, error } = await supabase
    .from('flights')
    .insert({ date, time, golf_course_id, creator })
    .select(
      `id, date, time, golf_course_id, creator, created_at,
       golf_courses(name),
       flight_users(user_id, users!inner(id, first_name, last_name))`
    )
    .single();

  if (error) return { success: false, message: 'Kon flight niet aanmaken', action: 'add' };

  if (user_ids.length > 0) {
    const flightUsers = user_ids.map((user_id) => ({ flight_id: flight.id, user_id }));
    const { error: usersError } = await supabase.from('flight_users').insert(flightUsers);
    if (usersError) {
      return {
        success: true,
        message: 'Flight aangemaakt, maar spelers konden niet gekoppeld worden',
        action: 'add',
        flight
      };
    }
  }

  return { success: true, message: 'Flight aangemaakt', action: 'add', flight };
}

export async function editFlight({ request, locals }) {
  requireUser(locals);

  const formData = await request.formData();
  const id = formData.get('flight_id');
  const date = formData.get('date');
  const time = formData.get('time');
  const golf_course_id = formData.get('golf_course_id');
  const user_ids = formData.getAll('user_ids');

  const { data: updated, error: updateError } = await supabase
    .from('flights')
    .update({ date, time, golf_course_id })
    .eq('id', id)
    .select()
    .single();

  if (updateError) return { success: false, message: 'Kon flight niet bijwerken', action: 'edit' };

  await supabase.from('flight_users').delete().eq('flight_id', id);

  if (user_ids.length > 0) {
    const flightUsers = user_ids.map((user_id) => ({ flight_id: id, user_id }));
    await supabase.from('flight_users').insert(flightUsers);
  }

  return { success: true, message: 'Flight bijgewerkt', action: 'edit', flight: updated };
}

export async function deleteFlight({ request, locals }) {
  requireUser(locals);

  const formData = await request.formData();
  const id = formData.get('flight_id');

  const { error } = await supabase.from('flights').delete().eq('id', id);
  if (error) return { success: false, message: 'Kon flight niet verwijderen', action: 'delete' };

  return { success: true, message: 'Flight verwijderd', action: 'delete', id };
}

export async function removeUserFromFlight({ request, locals }) {
  requireUser(locals);

  const formData = await request.formData();
  const flight_id = formData.get('flight_id');
  const user_id = formData.get('user_id');

  const { error } = await supabase.from('flight_users').delete().match({ flight_id, user_id });
  if (error)
    return { success: false, message: 'Kon speler niet verwijderen', action: 'removeUser' };

  return {
    success: true,
    action: 'removeUser',
    message: 'Golfer verwijderd uit flight',
    flight_id,
    user_id
  };
}
