import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import { selectors, state } from './constants'

class Countdown {
  constructor(element) {
    this.element = element
    this.config = this.getConfig()

    if (!this.config) {
      console.error('Countdown JSON does not exist.')
      return
    }

    dayjs.extend(utc)

    this.countdownType = this.config.countdownType
    this.countdownState = this.config.countdownState

    this.startDateString = this.config.startDate
    this.endDateString = this.config.endDate
    this.live = this.config.live

    this.timezoneOffset = this.config.timezoneOffset
    this.timezoneAbbr = this.config.timezoneAbbr

    this.contentLabel = this.element.querySelector(selectors.label)
    this.contentLive = this.element.querySelector(selectors.live)
    this.contentEnds = this.element.querySelector(selectors.ends)

    this.prefixLabel = this.element.querySelector(selectors.prefixLabel)
    this.suffixLabel = this.element.querySelector(selectors.suffixLabel)

    this.days = this.element.querySelector(selectors.days)
    this.hours = this.element.querySelector(selectors.hours)
    this.minutes = this.element.querySelector(selectors.minutes)
    this.seconds = this.element.querySelector(selectors.seconds)

    if (!this.startDateString) {
      console.error('Countdown startDate is missing.')
      return
    }

    if (!this.endDateString) {
      console.error('Countdown endDate is missing.')
      return
    }

    if (!this.timezoneOffset || !this.timezoneAbbr) {
      console.error('Time zone details are missing.')
      return
    }

    if (!this.contentLive) {
      console.error('DOM Element for Live content is missing.')
      return
    }

    this.utcOffset = parseInt(this.timezoneOffset.replace('00', ''))

    this.startDate = dayjs(this.startDateString).utc().utcOffset(this.utcOffset)
    this.endDate = dayjs(this.endDateString).utc().utcOffset(this.utcOffset)

    this.render()
  }

  getConfig() {
    const countdownJSON = this.element.querySelector(selectors.config)

    if (countdownJSON) {
      return JSON.parse(countdownJSON.innerHTML)
    }
    return false
  }

  setConfig(newConfigParams) {
    this.config = {
      ...this.config,
      ...newConfigParams
    }
  }

  getFormattedStartDate() {
    return `${this.startDate.format(this.config.dateFormat)} [${this.timezoneAbbr}]`
  }

  getFormattedEndDate() {
    return `${this.endDate.format(this.config.dateFormat)} [${this.timezoneAbbr}]`
  }

  getTimer(remainSeconds) {
    const remains = {
      days: Math.floor(remainSeconds / (3600 * 24)),
      hours: Math.floor((remainSeconds % (3600 * 24)) / 3600),
      minutes: Math.floor((remainSeconds % 3600) / 60),
      seconds: Math.floor(remainSeconds % 60),
    }

    const units = {
      days: remains.days === 1 ? 'day' : 'days',
      hours: remains.hours === 1 ? 'hour' : 'hours',
      minutes: remains.minutes === 1 ? 'min' : 'mins',
      seconds: remains.seconds === 1 ? 'sec' : 'secs',
    }

    let content = ''

    if (remains.days > 0) {
      content =  this.timeFormat(this.config.daysFormat, remains, units)
    }

    content += this.timeFormat(this.config.countdownFormat, remains, units)

    if (remains.hours == 0 && remains.minutes == 0 && remains.seconds < 60) {
      content = 'less than 1 minute'
    }

    if(this.countdownType == "custom") {
      content = {
        'days': (remains.days > 0 ? ('0' + remains.days).slice(-2) : '00'),
        'hours': ('0' + remains.hours).slice(-2),
        'minutes': ('0' + remains.minutes).slice(-2),
        'seconds': ('0' + remains.seconds).slice(-2),
      }
    }

    return content
  }

  timeFormat(string, remains, units) {
    const mapFormat = {
      '%RD': remains.days,
      '%RH': remains.hours,
      '%RM': remains.minutes,
      '%RS': remains.seconds,
      '%UD': units.days,
      '%UH': units.hours,
      '%UM': units.minutes,
      '%US': units.seconds
    }

    string = string.replace(/%RD|%RH|%RM|%RS|%UD|%UH|%UM|%US/gi, (matched)=> {
      return mapFormat[matched];
    })

    return string
  }

  getCountdownState() {
    if (typeof this.countdownState !== 'undefined' && this.countdownState == state.finished) {
      return state.finished
    }

    let startDateDifference = this.startDate.diff(dayjs().format(), 'seconds')
    let endDateDifference = this.endDate.diff(dayjs().format(), 'seconds')

    if (startDateDifference >= 0) {
      return state.pre
    } else if (startDateDifference < 0 && endDateDifference >= 0) {
      return state.active
    } else {
      return state.end
    }
  }

  renderPreState() {
    if(this.countdownType == "custom") {
      if (this.days) this.days.innerHTML = '00'
      if (this.hours) this.hours.innerHTML = '00'
      if (this.minutes) this.minutes.innerHTML = '00'
      if (this.seconds) this.seconds.innerHTML = '00'
    } else {
      if (this.contentLabel && this.config.label) this.contentLabel.innerHTML = this.config.label
      this.contentLive.innerHTML = `${this.getFormattedStartDate()}`
      if (this.contentEnds) this.contentEnds.innerHTML = ''
      if (this.prefixLabel && this.config.prefixLabel) this.prefixLabel.innerHTML = this.config.prefixLabel
      if (this.suffixLabel && this.config.suffixLabel) this.suffixLabel.innerHTML = this.config.suffixLabel
    }
  }

  renderActiveState() {
    const remainSeconds = this.endDate.diff(dayjs().format(), 'seconds')
    let time = this.getTimer(remainSeconds)

    if(this.countdownType == "custom") {
      if (this.days) this.days.innerHTML = time.days
      if (this.hours) this.hours.innerHTML = time.hours
      if (this.minutes) this.minutes.innerHTML = time.minutes
      if (this.seconds) this.seconds.innerHTML = time.seconds
    } else {
      if (this.contentLabel && this.config.label) this.contentLabel.innerHTML = `${this.config.label} is live!`
      this.contentLive.innerHTML = `${time}`
      if (this.contentEnds) this.contentEnds.innerHTML = `${this.getFormattedEndDate()}`
      if (this.prefixLabel && this.config.prefixLabel) this.prefixLabel.innerHTML = this.config.prefixLabel
      if (this.suffixLabel && this.config.suffixLabel) this.suffixLabel.innerHTML = this.config.suffixLabel
    }
  }

  renderEndState() {
    if(this.countdownType == "custom") {
      if (this.days) this.days.innerHTML = '00'
      if (this.hours) this.hours.innerHTML = '00'
      if (this.minutes) this.minutes.innerHTML = '00'
      if (this.seconds) this.seconds.innerHTML = '00'
      setTimeout(function(){
        window.location.href = '/'
      },5000)
    } else {
      if (this.contentLabel) this.contentLabel.innerHTML = ''
      this.contentLive.innerHTML = `${this.config.label} has ended.`
      if (this.contentEnds) this.contentEnds.innerHTML = ''
      if (this.prefixLabel) this.prefixLabel.innerHTML = ''
      if (this.suffixLabel) this.suffixLabel.innerHTML = ''
    }

    // Reset timer if needed
    if (this.config.resetOnEnd) this.reset()
  }

  render() {
    let countdownState = this.getCountdownState()

    switch (countdownState) {
      case state.pre:
        this.renderPreState()
        break
      case state.active:
        this.renderActiveState()
        break
      case state.end:
        this.renderEndState()
        break
      case state.finished:
        return
    }

    setTimeout(this.render.bind(this), 1000)
  }

  reset() {
    this.setConfig({
      startDate: this.config.resetStartDate,
      endDate: this.config.resetEndDate,
      prefixLabel: this.config.resetPrefixLabel,
      suffixLabel: this.config.resetSuffixLabel,
      resetOnEnd: false
    })

    this.startDateString = this.config.startDate
    this.endDateString = this.config.endDate

    this.startDate = dayjs(this.startDateString).utc().utcOffset(this.utcOffset)
    this.endDate = dayjs(this.endDateString).utc().utcOffset(this.utcOffset)

    this.render()
  }
}

export const countdown = () => {
  const elements = document.querySelectorAll(selectors.countdown)

  for (let i = 0; i < elements.length; i++) {
    new Countdown(elements[i])
  }
}