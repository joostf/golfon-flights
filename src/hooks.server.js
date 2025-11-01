import { ADMIN_PASSWORD } from '$env/static/private';
import { redirect } from '@sveltejs/kit';

export const handle = async ({ event, resolve }) => {
  const session = event.cookies.get('session');

  event.locals.user = session === 'admin' ? { name: 'Admin' } : null;

  const response = await resolve(event, {
    transformPageChunk: ({ html }) => html
  });

  return response;
};