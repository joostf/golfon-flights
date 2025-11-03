export function formatDate(dateString) {
  const date = new Date(dateString);
  const options = { weekday: 'long', day: 'numeric', month: 'long' };
  return new Intl.DateTimeFormat('nl-NL', options).format(date);
}

export function formatTime(timeString) {
  return timeString.slice(0, 5);
}