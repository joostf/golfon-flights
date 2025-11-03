import { ADMIN_PASSWORD } from '$env/static/private';
import { redirect, fail, error } from '@sveltejs/kit';

/**
 * Require an authenticated user to access an action.
 * Throws a 401 error if `locals.user` does not exist.
 */
export function requireUser(locals) {
  if (!locals.user) {
    throw error(401, 'Niet geautoriseerd – log in om deze actie uit te voeren.');
  }
}

/**
 * Login using the password stored in the .env file.
 */
export async function login({ request, cookies }) {
  const data = await request.formData();
  const password = data.get('password');

  if (password === ADMIN_PASSWORD) {
    cookies.set('session', 'admin', {
      path: '/',
      httpOnly: true,
      sameSite: 'lax',
      secure: false,
      maxAge: 60 * 60 * 24 // 1 day
    });
    throw redirect(302, '/');
  }

  return fail(401, { incorrect: true });
}

/**
 * Log out by deleting the session cookie.
 */
export async function logout({ cookies }) {
  cookies.delete('session', { path: '/' });
  throw redirect(302, '/');
}
