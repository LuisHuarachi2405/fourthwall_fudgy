import isMobileFunction from 'ismobilejs'
import smoothscroll from 'smoothscroll-polyfill'

smoothscroll.polyfill()

export const isMobile = isMobileFunction()

export function getQueryVariable(variable) {
  let query = window.location.search.substring(1)
  let vars = query.split('&')
  for (var i = 0; i < vars.length; i++) {
    let pair = vars[i].split('=')

    if (pair[0] === variable) {
      return pair[1]
    }
  }
  return false
}

export function getPriceString(amount, currency) {
  const price = currency === 'JPY' ? amount : amount / 100
  return new Intl.NumberFormat(currencyData.locale, { style: 'currency', currency }).format(price)
}

export function pluralize(value, singular, plural) {
  if (value === 1) {
    return singular
  } else {
    return plural
  }
}

export function setCartWidgetQuantity(quantity) {
  const dataPrefix = 'data-cart-widget'

  const selectors = {
    widget: `[${dataPrefix}="widget"]`,
    widgetQuantity: `[${dataPrefix}="quantity"]`,
  }

  const cartWidget = document.querySelectorAll(selectors.widget)
  const cartWidgetQuantity = document.querySelectorAll(selectors.widgetQuantity)

  for (let i = 0; i < cartWidgetQuantity.length; i++) {
    cartWidgetQuantity[i].innerHTML = quantity
  }

  for (let i = 0; i < cartWidget.length; i++) {
    if (parseInt(quantity) === 0) {
      cartWidget[i].classList.add(cssClasses.empty)
    } else {
      cartWidget[i].classList.remove(cssClasses.empty)
    }
  }
}

export const theme = fourthwallTheme

export const strings = theme.strings

export const urls = theme.urls

export const cssClasses = {
  loading: 'loading',
  hidden: 'hidden',
  active: 'active',
  visible: 'visible',
  empty: 'empty',
  unavailable: 'unavailable',
  disabled: 'disabled',
  paused: 'paused',
  filled: 'filled',
  selected: 'selected',
  noScroll: 'no-scroll',
}

export function setBodyScroll(set) {
  const body = document.querySelector('body')
  if (set === false && !body.classList.contains(cssClasses.noScroll)) {
    body.classList.add(cssClasses.noScroll)
  } else {
    body.classList.remove(cssClasses.noScroll)
  }
}

export const isElementTopInViewport = ({ element, offset }) => {
  if (!offset) offset = 0
  if (element.getBoundingClientRect().top - offset >= 0) return true
  return false
}

export const scrollToElement = ({ element, offset, behavior, ifNeeded }) => {
  if (ifNeeded === true && isElementTopInViewport({ element, offset })) return

  if (!offset) offset = 0
  if (!behavior) behavior = 'smooth'

  const viewportY = window.scrollY || window.pageYOffset
  const top = element.getBoundingClientRect().top + viewportY - offset

  window.scrollTo({
    top,
    left: 0,
    behavior,
  })
}

export const cssEscape = window.CSS.escape || function (s) {
  return s.replace(/([^\x7F-\uFFFF\w-])/g, function (c) {
    return '\\' + c.charCodeAt(0).toString(16) + ' '
  })
}

export function getURLVariantId() {
  const queryString = window.location.search.substring(1)
  const queryParams = queryString.split('&')

  const paramsObject = queryParams.reduce((params, currentParam) => {
    const [key, value] = currentParam.split('=')
    params[key] = value
    return params
  }, {})

  const variantValue = paramsObject['variant']

  return variantValue
}