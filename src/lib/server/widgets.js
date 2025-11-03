import { GIPHY_KEY, GOLFCOURSEAPI_KEY } from '$env/static/private';

export async function refreshGiphy({ locals }) {
  const res = await fetch(`https://api.giphy.com/v1/gifs/random?api_key=${GIPHY_KEY}&tag=golf`);
  const randomGiphy = await res.json();
  return { success: true, action: 'refreshGiphy', randomGiphy };
}

export async function getRandomGiphy() {
  const res = await fetch(`https://api.giphy.com/v1/gifs/random?api_key=${GIPHY_KEY}&tag=golf`);
  return res.json();
}

export async function getGolfcourse() {
  const res = await fetch('https://api.golfcourseapi.com/v1/courses/14713', {
    headers: { Authorization: 'Key ' + GOLFCOURSEAPI_KEY }
  });
  return res.json();
}