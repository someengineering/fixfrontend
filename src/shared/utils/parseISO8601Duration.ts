const iso8601DurationRegex =
  /(-)?P(?:([.,\d]+)Y)?(?:([.,\d]+)M)?(?:([.,\d]+)W)?(?:([.,\d]+)D)?(?:T(?:([.,\d]+)H)?(?:([.,\d]+)M)?(?:([.,\d]+)S)?)?/

interface ISO8601DurationType {
  negative: boolean
  years: number
  months: number
  weeks: number
  days: number
  hours: number
  minutes: number
  seconds: number
  duration: number
}

export const parseISO8601Duration = (iso8601Duration: string) => {
  const matches = iso8601Duration.match(iso8601DurationRegex) ?? []

  const numberMatches = matches.map((match) => Number(match))

  const parsedDuration = {
    negative: Boolean(matches[1]),
    years: !Number.isNaN(numberMatches[2]) ? numberMatches[2] : 0,
    months: !Number.isNaN(numberMatches[3]) ? numberMatches[3] : 0,
    weeks: !Number.isNaN(numberMatches[4]) ? numberMatches[4] : 0,
    days: !Number.isNaN(numberMatches[5]) ? numberMatches[5] : 0,
    hours: !Number.isNaN(numberMatches[6]) ? numberMatches[6] : 0,
    minutes: !Number.isNaN(numberMatches[7]) ? numberMatches[7] : 0,
    seconds: !Number.isNaN(numberMatches[8]) ? numberMatches[8] : 0,
    duration: 0,
  }

  parsedDuration.duration =
    (parsedDuration.negative ? -1 : 1) *
    (parsedDuration.seconds +
      parsedDuration.minutes * 60 +
      parsedDuration.hours * 60 * 60 +
      parsedDuration.days * 60 * 60 * 24 +
      parsedDuration.weeks * 60 * 60 * 24 * 7 +
      parsedDuration.months * 60 * 60 * 24 * 30 +
      parsedDuration.years * 60 * 60 * 24 * 30 * 365) *
    1000

  return parsedDuration
}

export const iso8601DurationToString = (duration: ISO8601DurationType) => {
  if (duration.years) {
    return duration.years + ' Years'
  } else if (duration.months) {
    return duration.months + ' Months'
  } else if (duration.weeks) {
    return duration.weeks + ' Weeks'
  } else if (duration.days) {
    return duration.days + ' Days'
  } else if (duration.hours) {
    return duration.hours + ' Hours'
  } else if (duration.minutes) {
    return duration.minutes + ' Minutes'
  } else if (duration.seconds) {
    return duration.seconds + ' Seconds'
  }
  return duration.duration.toString() + ' Miliseconds'
}
