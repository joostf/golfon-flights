export default function isExpired(dateStr) {
  const flightDate = new Date(dateStr)
  const now = new Date()
  return flightDate < now
}