export default function removeUserFromFlight(flights, flightId, userId) {
  console.log('remove')
  const flight = flights.find(flight => flight.id === flightId)
  if (!flight) return
  flight.flight_users = flight.flight_users.filter(user => user.user_id !== userId)
}