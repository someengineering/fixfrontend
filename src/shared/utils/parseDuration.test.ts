import {
  diffDateTimeToDuration,
  durationToCustomDurationString,
  getISO8601DurationFromTimestamp,
  iso8601DurationToString,
  parseCustomDuration,
  parseISO8601Duration,
  splitCustomDuration,
  splittedCustomDurationToAutoComplete,
} from './parseDuration'

describe('parseDuration', () => {
  test('diffDateTimeToDuration should give duration between two dates', () => {
    const dateStart = new Date(0)
    const dateEnd = new Date(
      dateStart.getFullYear() + 1,
      dateStart.getMonth() + 1,
      dateStart.getDate() + 7,
      dateStart.getHours() + 1,
      dateStart.getMinutes() + 1,
      dateStart.getSeconds() + 1,
      dateStart.getMilliseconds() + 1,
    )
    const positiveDiff = diffDateTimeToDuration(dateStart, dateEnd)
    const negativeDiff = diffDateTimeToDuration(dateEnd, dateStart)
    expect(positiveDiff).toMatchObject({
      negative: false,
      years: 1,
      months: 1,
      weeks: 1,
      days: 1,
      hours: 1,
      minutes: 1,
      seconds: 1,
      duration: dateEnd.valueOf(),
    })
    expect(negativeDiff).toMatchObject({
      negative: true,
      years: 1,
      months: 1,
      weeks: 1,
      days: 1,
      hours: 1,
      minutes: 1,
      seconds: 1,
      duration: dateEnd.valueOf(),
    })
  })
  test('durationToCustomDurationString should translate iso8601 duration to fix duration', () => {
    const duration = {
      years: 1,
      months: 1,
      weeks: 1,
      days: 1,
      hours: 1,
      minutes: 1,
      seconds: 1,
    }
    const durationWithOnlyTimestamp = {
      duration: 34822861001,
    }
    const customDurationString = durationToCustomDurationString(duration)
    const customDurationStringWithOnlyTimestamp = durationToCustomDurationString(durationWithOnlyTimestamp)
    expect(customDurationString).toBe(customDurationStringWithOnlyTimestamp)
    expect(customDurationString).toBe('1yr1mo1w1d1h1min1s')
  })
  test('getISO8601DurationFromTimestamp should get iso8601 duration from timestamp', () => {
    const negativeTimestamp = -34822861001
    const duration = getISO8601DurationFromTimestamp(negativeTimestamp)
    expect(duration).toMatchObject({
      negative: true,
      years: 1,
      months: 1,
      weeks: 1,
      days: 1,
      hours: 1,
      minutes: 1,
      seconds: 1,
      duration: 34822861001,
    })
  })
  test('iso8601DurationToString should get iso8601 duration from timestamp', () => {
    const duration = {
      years: 1,
      months: 1,
      weeks: 1,
      days: 1,
      hours: 1,
      minutes: 1,
      seconds: 1,
      duration: 34822861001,
    }
    const durationMil = {
      duration: 15,
    }
    const durationString = iso8601DurationToString(duration)
    const durationMilString = iso8601DurationToString(durationMil)
    expect(durationString).toBe('1 Year and 1 Month and 1 Week and 1 Day and 1 Hour and 1 Minute and 1 Second')
    expect(durationMilString).toBe('15 Milliseconds')
  })
  test('parseCustomDuration should get iso8601 duration from fix duration', () => {
    const customDurationFullStringMany = '2 years and 2 months and 2 weeks and 2 days and 2 hours and 2 minutes and 2 seconds'
    const customDurationFullString = '1 year and 1 month and 1 week and 1 day and 1 hour and 1 minute and 1 second'
    const customDurationString = '1 yr , 1 mo , 1 w , 1 d , 1 h , 1 min , 1 s'
    const customDurationMinString = '1y1M1w1d1h1m1s'
    const durationFullStringMany = parseCustomDuration(customDurationFullStringMany)
    const durationFullString = parseCustomDuration(customDurationFullString)
    const durationString = parseCustomDuration(customDurationString)
    const durationMinString = parseCustomDuration(customDurationMinString)
    expect(durationFullStringMany).toMatchObject({
      negative: false,
      years: 2,
      months: 2,
      weeks: 2,
      days: 2,
      hours: 2,
      minutes: 2,
      seconds: 2,
      duration: 69645722000,
    })
    expect(durationFullString).toMatchObject(durationString)
    expect(durationString).toMatchObject(durationMinString)
    expect(durationString).toMatchObject({
      negative: false,
      years: 1,
      months: 1,
      weeks: 1,
      days: 1,
      hours: 1,
      minutes: 1,
      seconds: 1,
      duration: 34822861000,
    })
  })
  test('parseISO8601Duration should parse from iso8601 duration', () => {
    const iso8601DurationString = '-P1Y1M1W1DT1H1M1S'
    const duration = parseISO8601Duration(iso8601DurationString)
    expect(duration).toMatchObject({
      negative: true,
      years: 1,
      months: 1,
      weeks: 1,
      days: 1,
      hours: 1,
      minutes: 1,
      seconds: 1,
      duration: -949366861000,
    })
  })
  test('splitCustomDuration should split duration string that comes from durationToCustomDurationString', () => {
    const customDurationString = '1yr1mo1w1d1h1min1s'
    const splittedDurationArray = splitCustomDuration(customDurationString)
    expect(splittedDurationArray).toMatchObject(['1yr', '1mo', '1w', '1d', '1h', '1min', '1s'])
  })
  test('splittedCustomDurationToAutoComplete should turn splitted coming from splitCustomDuration to autoComplete values', () => {
    const splittedDurationArray = ['1yr', '1mo', '1w', '1d', '1h', '1min', '1s']
    const autocompleteDuration = splittedCustomDurationToAutoComplete(splittedDurationArray)
    expect(autocompleteDuration).toMatchObject([
      { label: '1 Year', value: '1yr' },
      { label: '1 Month', value: '1mo' },
      { label: '1 Week', value: '1w' },
      { label: '1 Day', value: '1d' },
      { label: '1 Hour', value: '1h' },
      { label: '1 Minute', value: '1min' },
      { label: '1 Second', value: '1s' },
    ])
  })
})
