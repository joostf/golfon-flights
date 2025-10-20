export default function addUserToFlight(flightId, userId, allUsers) {
  const flight = flights.find(flight => flight.id === flightId)
  if (!flight) return
  const user = allUsers.find(user => user.id === userId)
  if (!user) return
  flight.flight_users.push({ user_id: userId, users: user })
}