export const dataPrefix = 'data-countdown'

export const selectors = {
  countdown: `[${dataPrefix}="countdown"]`,
  config: `[${dataPrefix}="json"]`,
  live: `[${dataPrefix}="live"]`,
  ends: `[${dataPrefix}="ends"]`,
  label: `[${dataPrefix}="label"]`,
  prefixLabel: `[${dataPrefix}="prefix"]`,
  suffixLabel: `[${dataPrefix}="suffix"]`,
  days: `[${dataPrefix}="days"]`,
  hours: `[${dataPrefix}="hours"]`,
  minutes: `[${dataPrefix}="minutes"]`,
  seconds: `[${dataPrefix}="seconds"]`,
}

export const state = {
  pre: 'PRE',
  active: 'ACTIVE',
  end: 'END',
  finished: 'FINISHED',
}