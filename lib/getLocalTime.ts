export function getLocalTime(d = new Date()) {
  const localDate = new Date(d)
  const localTime = localDate.toLocaleString('lt')
  const [date, time] = localTime.split(' ')
  const [h, m] = time.split(':')
  const dateAndTime = `${date}T${h}:${m}`
  return { date, dateAndTime, localTime }
}
