import { plural, t } from '@lingui/macro'

const iso8601DurationRegex =
  /(-)?P(?:([.,\d]+)Y)?(?:([.,\d]+)M)?(?:([.,\d]+)W)?(?:([.,\d]+)D)?(?:T(?:([.,\d]+)H)?(?:([.,\d]+)M)?(?:([.,\d]+)S)?)?/

const customDurationRegex =
  /(?:([.,\d]+)(?:(?: )+)?(?:years|year|yr|y))?(?:(?: |and|,)+)?(?:([.,\d]+)(?:(?: )+)?(?:months|month|mo|M))?(?:(?: |and|,)+)?(?:([.,\d]+)(?:(?: )+)?(?:weeks|week|w))?(?:(?: |and|,)+)?(?:([.,\d]+)(?:(?: )+)?(?:days|day|d))?(?:(?: |and|,)+)?(?:([.,\d]+)(?:(?: )+)?(?:hours|hour|h))?(?:(?: |and|,)+)?(?:([.,\d]+)(?:(?: )+)?(?:minutes|minute|min|m))?(?:(?: |and|,)+)?(?:([.,\d]+)(?:(?: )+)?(?:seconds|second|s))?/

const customDurationForSplitRegex = /(\d+[^\d]+)/g

export interface ISO8601DurationType {
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

const SECONDS = 1000
const MINUTES = SECONDS * 60
const HOURS = MINUTES * 60
const DAYS = HOURS * 24
const WEEKS = DAYS * 7
const MONTHS = DAYS * 30
const YEARS = DAYS * 365

export const diffDateTimeToDuration = (dateTimeFrom: Date, dateTimeTo: Date) => {
  const negative = dateTimeFrom > dateTimeTo
  const start = negative ? dateTimeTo : dateTimeFrom
  const end = negative ? dateTimeFrom : dateTimeTo
  const duration = Math.abs(start.valueOf() - end.valueOf())
  const years = Math.floor(duration / YEARS)
  let soFar = years * YEARS
  const months = Math.floor((duration - soFar) / MONTHS)
  soFar += months * MONTHS
  const weeks = Math.floor((duration - soFar) / WEEKS)
  soFar += weeks * WEEKS
  const days = Math.floor((duration - soFar) / DAYS)
  soFar += days * DAYS
  const hours = Math.floor((duration - soFar) / HOURS)
  soFar += hours * HOURS
  const minutes = Math.floor((duration - soFar) / MINUTES)
  soFar += minutes * MINUTES
  const seconds = Math.floor((duration - soFar) / SECONDS)
  soFar += seconds * SECONDS
  return { negative, years, months, weeks, days, hours, minutes, seconds, duration } as ISO8601DurationType
}

export const parseCustomDuration = (customDuration: string) => {
  const matches = customDuration.match(customDurationRegex) ?? []

  const numberMatches = matches.map((match) => Number(match))

  const parsedDuration = {
    negative: false,
    years: !Number.isNaN(numberMatches[1]) ? numberMatches[1] : 0,
    months: !Number.isNaN(numberMatches[2]) ? numberMatches[2] : 0,
    weeks: !Number.isNaN(numberMatches[3]) ? numberMatches[3] : 0,
    days: !Number.isNaN(numberMatches[4]) ? numberMatches[4] : 0,
    hours: !Number.isNaN(numberMatches[5]) ? numberMatches[5] : 0,
    minutes: !Number.isNaN(numberMatches[6]) ? numberMatches[6] : 0,
    seconds: !Number.isNaN(numberMatches[7]) ? numberMatches[7] : 0,
    duration: 0,
  }

  parsedDuration.duration =
    (parsedDuration.negative ? -1 : 1) *
    (parsedDuration.seconds * SECONDS +
      parsedDuration.minutes * MINUTES +
      parsedDuration.hours * HOURS +
      parsedDuration.days * DAYS +
      parsedDuration.weeks * WEEKS +
      parsedDuration.months * MONTHS +
      parsedDuration.years * YEARS)

  return parsedDuration
}

export const splitCustomDuration = (customDuration: string) => customDuration.match(customDurationForSplitRegex) ?? ([] as string[])

export const splitedCustomDurationToAutoComplete = (customDurations: string[]) =>
  customDurations.map((value) => ({ label: iso8601DurationToString(parseCustomDuration(value)), value }))

export const durationToCustomDurationString = (duration: ISO8601DurationType) => {
  const { days, hours, minutes, months, seconds, weeks, years } = duration
  return `${years ? `${years}yr` : ''}${months ? `${months}mo` : ''}${weeks ? `${weeks}w` : ''}${days ? `${days}d` : ''}${
    hours ? `${hours}h` : ''
  }${minutes ? `${minutes}min` : ''}${seconds ? `${seconds}s` : ''}`
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

export const iso8601DurationToString = (
  duration: ISO8601DurationType,
  maxStr: 1 | 2 | 3 | 4 | 5 | 6 | 7 = 7,
  showTime: boolean = true,
  joinStr?: string,
) => {
  const str: string[] = []
  if (duration.years) {
    str.push(
      plural(duration.years, {
        one: '# Year',
        other: '# Years',
      }),
    )
  }
  if (duration.months) {
    str.push(
      plural(duration.months, {
        one: '# Month',
        other: '# Months',
      }),
    )
  }
  if (duration.weeks) {
    str.push(
      plural(duration.weeks, {
        one: '# Week',
        other: '# Weeks',
      }),
    )
  }
  if (duration.days) {
    str.push(
      plural(duration.days, {
        one: '# Day',
        other: '# Days',
      }),
    )
  }
  if (duration.hours && showTime) {
    str.push(
      plural(duration.hours, {
        one: '# Hour',
        other: '# Hours',
      }),
    )
  }
  if (duration.minutes && showTime) {
    str.push(
      plural(duration.minutes, {
        one: '# Minute',
        other: '# Minutes',
      }),
    )
  }
  if (duration.seconds && showTime) {
    str.push(
      plural(duration.seconds, {
        one: '# Second',
        other: '# Seconds',
      }),
    )
  }
  if (!str.length && duration.duration && showTime) {
    str.push(t`${duration.duration.toString()} Milliseconds`)
  }
  return str.slice(0, maxStr).join(` ${joinStr ?? t`and`} `)
}
