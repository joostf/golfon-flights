export default  function getAvailableUsers(currentFlightUsers, allUsers) {
  const usedIds = currentFlightUsers.map(user => user.user_id)
  return allUsers.filter(user => !usedIds.includes(user.id))
}