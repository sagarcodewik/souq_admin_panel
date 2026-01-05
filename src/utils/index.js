import moment from 'moment'

export function localDateFormat(datetime, format = 'YYYY-MM-DD HH:mm') {
  const localTime = moment.utc(datetime).local() // Convert from UTC to local
  return localTime.format(format) // Format the local time using the specified format
}

export function localTimeFormat(datetime) {
  const localTime = moment.utc(datetime).local() // Convert from UTC to local
  return localTime.format('LT') // 'LT' formats as 'hh:mm A' (e.g., '12:30 PM')
}

export const toTitleCase = (str) => {
  return str
    .replace(/[_-]/g, ' ')
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase())
}
// utils/debounce.js
